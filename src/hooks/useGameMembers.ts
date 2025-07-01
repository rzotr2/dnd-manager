
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface GameMember {
  id: string;
  user_id: string;
  role: 'owner' | 'editor' | 'viewer';
  joined_at: string;
  profiles?: {
    username: string;
    full_name: string;
    email: string;
  };
}

interface GameInvitation {
  id: string;
  game_id: string;
  invited_email: string;
  role: 'owner' | 'editor' | 'viewer';
  token: string;
  expires_at: string;
  used_at?: string;
  created_at: string;
}

export const useGameMembers = (gameId: string | null) => {
  const [members, setMembers] = useState<GameMember[]>([]);
  const [invitations, setInvitations] = useState<GameInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

  const fetchMembers = async () => {
    if (!gameId) return;
    
    try {
      const { data, error } = await supabase
        .from('game_members')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            email
          )
        `)
        .eq('game_id', gameId);

      if (error) {
        console.error('Error fetching members:', error);
        setMembers([]);
        return;
      }
      
      setMembers((data as any[]) || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      setMembers([]);
    }
  };

  const fetchInvitations = async () => {
    if (!gameId) return;
    
    try {
      const { data, error } = await supabase
        .from('game_invitations')
        .select('*')
        .eq('game_id', gameId)
        .is('used_at', null);

      if (error) {
        console.error('Error fetching invitations:', error);
        setInvitations([]);
        return;
      }
      
      setInvitations((data as any[]) || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      setInvitations([]);
    }
  };

  const sendInvitation = async (email: string, role: 'owner' | 'editor' | 'viewer') => {
    if (!gameId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('game_members')
        .select('profiles!inner(email)')
        .eq('game_id', gameId)
        .eq('profiles.email', email)
        .maybeSingle();

      if (existingMember) {
        toast({
          title: t('error.title'),
          description: 'Користувач вже є учасником цієї гри',
          variant: 'destructive',
        });
        return;
      }

      // Check if invitation already exists
      const { data: existingInvitation } = await supabase
        .from('game_invitations')
        .select('*')
        .eq('game_id', gameId)
        .eq('invited_email', email)
        .is('used_at', null)
        .maybeSingle();

      if (existingInvitation) {
        toast({
          title: t('error.title'),
          description: 'Запрошення вже надіслано на цю пошту',
          variant: 'destructive',
        });
        return;
      }

      const { data, error } = await supabase
        .from('game_invitations')
        .insert({
          game_id: gameId,
          invited_by: user.id,
          invited_email: email,
          role: role,
        })
        .select()
        .single();

      if (error) throw error;

      setInvitations(prev => [...prev, data as GameInvitation]);
      toast({
        title: t('success.title'),
        description: t('success.invitationSent'),
      });

      return data;
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: t('error.title'),
        description: t('error.invitationFailed'),
        variant: 'destructive',
      });
    }
  };

  const deleteInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('game_invitations')
        .delete()
        .eq('id', invitationId);

      if (error) throw error;

      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      toast({
        title: t('success.title'),
        description: t('success.invitationDeleted'),
      });
    } catch (error) {
      console.error('Error deleting invitation:', error);
    }
  };

  const removeMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('game_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      setMembers(prev => prev.filter(member => member.id !== memberId));
      toast({
        title: t('success.title'),
        description: t('success.memberRemoved'),
      });
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const updateMemberRole = async (memberId: string, newRole: 'owner' | 'editor' | 'viewer') => {
    try {
      const { error } = await supabase
        .from('game_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      setMembers(prev => prev.map(member => 
        member.id === memberId ? { ...member, role: newRole } : member
      ));

      toast({
        title: t('success.title'),
        description: t('success.roleUpdated'),
      });
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const generateInviteLink = (token: string) => {
    return `${window.location.origin}/invite/${token}`;
  };

  useEffect(() => {
    if (gameId) {
      setLoading(true);
      Promise.all([fetchMembers(), fetchInvitations()]).finally(() => {
        setLoading(false);
      });
    }
  }, [gameId]);

  return {
    members,
    invitations,
    loading,
    sendInvitation,
    deleteInvitation,
    removeMember,
    updateMemberRole,
    generateInviteLink,
    refetch: () => Promise.all([fetchMembers(), fetchInvitations()]),
  };
};
