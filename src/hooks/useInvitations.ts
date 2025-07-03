
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export interface GameInvitation {
  id: string;
  game_id: string;
  invited_by: string;
  invited_email: string;
  invited_username?: string;
  invited_user_id?: string;
  role: string;
  token: string;
  expires_at: string;
  used_at?: string;
  created_at: string;
  games?: {
    name: string;
    description?: string;
  };
  profiles?: {
    username?: string;
  };
}

export const useInvitations = () => {
  const [invitations, setInvitations] = useState<GameInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();
  const { t } = useLanguage();

  const fetchInvitations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // First get the invitations
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('game_invitations')
        .select('*')
        .or(`invited_user_id.eq.${user.id},invited_email.eq.${user.email}`)
        .is('used_at', null)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (invitationsError) throw invitationsError;

      if (!invitationsData || invitationsData.length === 0) {
        setInvitations([]);
        setUnreadCount(0);
        return;
      }

      // Get game details for all invitations
      const gameIds = invitationsData.map(inv => inv.game_id);
      const { data: gamesData } = await supabase
        .from('games')
        .select('id, name, description')
        .in('id', gameIds);

      // Get profiles for all invited_by users
      const invitedByIds = invitationsData.map(inv => inv.invited_by);
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', invitedByIds);

      // Transform and combine the data
      const transformedData: GameInvitation[] = invitationsData.map(invitation => {
        const game = gamesData?.find(g => g.id === invitation.game_id);
        const profile = profilesData?.find(p => p.id === invitation.invited_by);

        return {
          ...invitation,
          games: game || { name: 'Unknown Game' },
          profiles: profile || { username: 'Unknown User' }
        };
      });

      setInvitations(transformedData);
      setUnreadCount(transformedData.length);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      toast({
        title: t('error.title'),
        description: t('invitations.loadError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const sendInvitation = async (gameId: string, identifier: string, role: string = 'viewer') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('Searching for user with identifier:', identifier);

      // Check if identifier is email or username
      const isEmail = identifier.includes('@');
      let targetUserId = null;
      let targetEmail = '';
      let targetUsername = '';

      if (isEmail) {
        console.log('Searching by email in profiles table');
        // Search by email in profiles table
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, email, username')
          .eq('email', identifier);
        
        console.log('Profile search result:', profiles, 'Error:', profileError);
        
        if (profileError) {
          console.error('Profile search error:', profileError);
          throw profileError;
        }
        
        if (profiles && profiles.length > 0) {
          const profile = profiles[0];
          targetUserId = profile.id;
          targetEmail = profile.email || identifier;
          targetUsername = profile.username || '';
          console.log('Found user by email:', { targetUserId, targetEmail, targetUsername });
        } else {
          console.log('No user found with email:', identifier);
          toast({
            title: t('error.title'),
            description: t('invitations.userNotFoundEmail'),
            variant: 'destructive',
          });
          return false;
        }
      } else {
        console.log('Searching by username in profiles table');
        // Search by username in profiles table
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, email, username')
          .eq('username', identifier);
        
        console.log('Profile search result:', profiles, 'Error:', profileError);
        
        if (profileError) {
          console.error('Profile search error:', profileError);
          throw profileError;
        }
        
        if (profiles && profiles.length > 0) {
          const profile = profiles[0];
          targetUserId = profile.id;
          targetEmail = profile.email || '';
          targetUsername = profile.username || identifier;
          console.log('Found user by username:', { targetUserId, targetEmail, targetUsername });
        } else {
          console.log('No user found with username:', identifier);
          toast({
            title: t('error.title'),
            description: t('invitations.userNotFoundUsername'),
            variant: 'destructive',
          });
          return false;
        }
      }

      // Check if invitation already exists
      const { data: existingInvitation } = await supabase
        .from('game_invitations')
        .select('id')
        .eq('game_id', gameId)
        .eq('invited_user_id', targetUserId)
        .is('used_at', null)
        .gte('expires_at', new Date().toISOString())
        .maybeSingle();

      if (existingInvitation) {
        toast({
          title: t('error.title'),
          description: t('invitations.alreadyInvited'),
          variant: 'destructive',
        });
        return false;
      }

      console.log('Creating invitation with data:', {
        game_id: gameId,
        invited_by: user.id,
        invited_email: targetEmail,
        invited_username: targetUsername || null,
        invited_user_id: targetUserId,
        role: role,
      });

      const { error } = await supabase
        .from('game_invitations')
        .insert([{
          game_id: gameId,
          invited_by: user.id,
          invited_email: targetEmail,
          invited_username: targetUsername || null,
          invited_user_id: targetUserId,
          role: role,
        }]);

      if (error) {
        console.error('Invitation creation error:', error);
        throw error;
      }

      toast({
        title: t('success.title'),
        description: t('invitations.invitationSent'),
      });

      return true;
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: t('error.title'),
        description: t('invitations.sendError'),
        variant: 'destructive',
      });
      return false;
    }
  };

  const acceptInvitation = async (invitationId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get invitation details
      const { data: invitation, error: invitationError } = await supabase
        .from('game_invitations')
        .select('*')
        .eq('id', invitationId)
        .single();

      if (invitationError) throw invitationError;

      // Add user to game_members
      const { error: memberError } = await supabase
        .from('game_members')
        .insert([{
          game_id: invitation.game_id,
          user_id: user.id,
          role: invitation.role,
        }]);

      if (memberError) throw memberError;

      // Mark invitation as used
      const { error: updateError } = await supabase
        .from('game_invitations')
        .update({ used_at: new Date().toISOString() })
        .eq('id', invitationId);

      if (updateError) throw updateError;

      await fetchInvitations();

      toast({
        title: t('success.title'),
        description: t('invitations.invitationAccepted'),
      });

      return true;
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast({
        title: t('error.title'),
        description: t('invitations.acceptError'),
        variant: 'destructive',
      });
      return false;
    }
  };

  const declineInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('game_invitations')
        .update({ used_at: new Date().toISOString() })
        .eq('id', invitationId);

      if (error) throw error;

      await fetchInvitations();

      toast({
        title: t('success.title'),
        description: t('invitations.invitationDeclined'),
      });

      return true;
    } catch (error) {
      console.error('Error declining invitation:', error);
      toast({
        title: t('error.title'),
        description: t('invitations.declineError'),
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchInvitations();

    // Set up realtime subscription
    const channel = supabase
      .channel('game-invitations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_invitations'
        },
        () => {
          fetchInvitations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    invitations,
    loading,
    unreadCount,
    sendInvitation,
    acceptInvitation,
    declineInvitation,
    refetch: fetchInvitations,
  };
};
