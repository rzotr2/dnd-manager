

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
        description: 'Не вдалося завантажити запрошення',
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

      // Check if identifier is email or username
      const isEmail = identifier.includes('@');
      let targetUserId = null;
      let targetEmail = '';
      let targetUsername = '';

      if (isEmail) {
        // Search by email in profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, email, username')
          .eq('email', identifier)
          .maybeSingle();
        
        if (profile) {
          targetUserId = profile.id;
          targetEmail = profile.email || identifier;
          targetUsername = profile.username || '';
        } else {
          toast({
            title: t('error.title'),
            description: 'Користувача з таким email не знайдено',
            variant: 'destructive',
          });
          return false;
        }
      } else {
        // Search by username in profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, email, username')
          .eq('username', identifier)
          .maybeSingle();
        
        if (profile) {
          targetUserId = profile.id;
          targetEmail = profile.email || '';
          targetUsername = profile.username || identifier;
        } else {
          toast({
            title: t('error.title'),
            description: 'Користувача з таким іменем не знайдено',
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
          description: 'Запрошення вже надіслано цьому користувачу',
          variant: 'destructive',
        });
        return false;
      }

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

      if (error) throw error;

      toast({
        title: t('success.title'),
        description: 'Запрошення надіслано успішно',
      });

      return true;
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: t('error.title'),
        description: 'Не вдалося надіслати запрошення',
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
        description: 'Ви успішно приєдналися до гри',
      });

      return true;
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast({
        title: t('error.title'),
        description: 'Не вдалося прийняти запрошення',
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
        description: 'Запрошення відхилено',
      });

      return true;
    } catch (error) {
      console.error('Error declining invitation:', error);
      toast({
        title: t('error.title'),
        description: 'Не вдалося відхилити запрошення',
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
