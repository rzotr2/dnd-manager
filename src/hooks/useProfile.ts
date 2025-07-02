
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export interface Profile {
  id: string;
  username: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface GameInvitation {
  id: string;
  game_id: string;
  invited_by: string;
  invited_email: string;
  invited_user_id: string | null;
  role: string;
  token: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
  games?: {
    name: string;
    theme: string;
  };
  inviter_profile?: {
    username: string | null;
    email: string | null;
  };
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [invitations, setInvitations] = useState<GameInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchInvitations();
      setupRealtimeSubscription();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchInvitations = async () => {
    if (!user) return;

    try {
      // First, get the invitations
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('game_invitations')
        .select(`
          *,
          games (name, theme)
        `)
        .eq('invited_user_id', user.id)
        .is('used_at', null)
        .order('created_at', { ascending: false });

      if (invitationsError) {
        console.error('Error fetching invitations:', invitationsError);
        return;
      }

      // Then, get the inviter profiles separately
      const inviterIds = invitationsData?.map(inv => inv.invited_by) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, email')
        .in('id', inviterIds);

      if (profilesError) {
        console.error('Error fetching inviter profiles:', profilesError);
      }

      // Combine the data
      const transformedData = invitationsData?.map(invitation => ({
        ...invitation,
        inviter_profile: profilesData?.find(profile => profile.id === invitation.invited_by) || null,
      })) as GameInvitation[];

      setInvitations(transformedData || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel('profile-invitations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_invitations',
          filter: `invited_user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('New invitation received:', payload);
          fetchInvitations();
          toast({
            title: t('invitations.newInvitation'),
            description: t('invitations.newInvitationDescription'),
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const searchUserByEmailOrUsername = async (query: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`email.eq.${query},username.eq.${query}`)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // User not found
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error searching user:', error);
      return null;
    }
  };

  const sendGameInvitation = async (gameId: string, userQuery: string, role: string = 'viewer') => {
    try {
      setLoading(true);

      // Спочатку знайдемо користувача
      const targetUser = await searchUserByEmailOrUsername(userQuery);
      if (!targetUser) {
        toast({
          title: t('error.title'),
          description: t('invitations.userNotFound'),
          variant: 'destructive',
        });
        return { success: false };
      }

      // Перевіримо, чи не запрошений вже цей користувач
      const { data: existingInvitation } = await supabase
        .from('game_invitations')
        .select('id')
        .eq('game_id', gameId)
        .eq('invited_user_id', targetUser.id)
        .is('used_at', null);

      if (existingInvitation && existingInvitation.length > 0) {
        toast({
          title: t('error.title'),
          description: t('invitations.alreadyInvited'),
          variant: 'destructive',
        });
        return { success: false };
      }

      // Створимо запрошення
      const { error } = await supabase
        .from('game_invitations')
        .insert({
          game_id: gameId,
          invited_by: user!.id,
          invited_email: targetUser.email || '',
          invited_user_id: targetUser.id,
          role: role,
        });

      if (error) {
        console.error('Error sending invitation:', error);
        toast({
          title: t('error.title'),
          description: t('invitations.sendError'),
          variant: 'destructive',
        });
        return { success: false };
      }

      toast({
        title: t('success.title'),
        description: t('invitations.invitationSent'),
      });
      return { success: true };
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: t('error.title'),
        description: t('invitations.sendError'),
        variant: 'destructive',
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const acceptInvitation = async (invitationId: string) => {
    try {
      setLoading(true);

      const invitation = invitations.find(inv => inv.id === invitationId);
      if (!invitation) return { success: false };

      // Додаємо користувача до гри
      const { error: memberError } = await supabase
        .from('game_members')
        .insert({
          game_id: invitation.game_id,
          user_id: user!.id,
          role: invitation.role,
        });

      if (memberError) {
        console.error('Error adding member:', memberError);
        toast({
          title: t('error.title'),
          description: t('invitations.acceptError'),
          variant: 'destructive',
        });
        return { success: false };
      }

      // Позначаємо запрошення як використане
      const { error: updateError } = await supabase
        .from('game_invitations')
        .update({ used_at: new Date().toISOString() })
        .eq('id', invitationId);

      if (updateError) {
        console.error('Error updating invitation:', updateError);
      }

      toast({
        title: t('success.title'),
        description: t('invitations.invitationAccepted'),
      });

      fetchInvitations();
      return { success: true };
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast({
        title: t('error.title'),
        description: t('invitations.acceptError'),
        variant: 'destructive',
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const rejectInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('game_invitations')
        .delete()
        .eq('id', invitationId);

      if (error) {
        console.error('Error rejecting invitation:', error);
        toast({
          title: t('error.title'),
          description: t('invitations.rejectError'),
          variant: 'destructive',
        });
        return { success: false };
      }

      toast({
        title: t('success.title'),
        description: t('invitations.invitationRejected'),
      });

      fetchInvitations();
      return { success: true };
    } catch (error) {
      console.error('Error rejecting invitation:', error);
      return { success: false };
    }
  };

  return {
    profile,
    invitations,
    loading,
    searchUserByEmailOrUsername,
    sendGameInvitation,
    acceptInvitation,
    rejectInvitation,
    unreadInvitationsCount: invitations.length,
  };
};
