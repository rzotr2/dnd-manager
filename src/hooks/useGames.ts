
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface Game {
  id: string;
  name: string;
  description: string;
  theme: string;
  mode: 'simple' | 'advanced';
  players: string[];
  created_at: string;
  last_played: string;
}

export const useGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

  const fetchGames = async () => {
    try {
      // Try to fetch games where user is a member first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // First try to get games via game_members
      const { data: memberGames, error: memberError } = await supabase
        .from('game_members' as any)
        .select(`
          game_id,
          games:game_id (*)
        `)
        .eq('user_id', user.id);

      if (!memberError && memberGames && memberGames.length > 0) {
        const mappedGames = memberGames
          .filter(item => item.games)
          .map((item: any) => ({
            ...item.games,
            mode: item.games.mode || 'simple' as 'simple' | 'advanced',
          }));
        setGames(mappedGames);
        return;
      }

      // Fallback to direct games query
      const { data: directGames, error: directError } = await supabase
        .from('games')
        .select('*')
        .eq('user_id', user.id)
        .order('last_played', { ascending: false });

      if (directError) throw directError;

      const mappedDirectGames = (directGames || []).map(game => ({
        ...game,
        mode: (game as any).mode || 'simple' as 'simple' | 'advanced',
      }));

      setGames(mappedDirectGames);
    } catch (error) {
      console.error('Error fetching games:', error);
      toast({
        title: t('error.title'),
        description: t('error.gameCreateFailed'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createGame = async (gameData: { 
    name: string; 
    description: string; 
    theme: string; 
    mode: 'simple' | 'advanced';
    players: string[] 
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('games')
        .insert([{
          ...gameData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      const mappedGame = {
        ...data,
        mode: data.mode || 'simple' as 'simple' | 'advanced',
      };
      
      setGames(prev => [mappedGame, ...prev]);
      toast({
        title: t('success.title'),
        description: t('success.gameCreated'),
      });
      
      return mappedGame;
    } catch (error) {
      console.error('Error creating game:', error);
      toast({
        title: t('error.title'),
        description: t('error.gameCreateFailed'),
        variant: 'destructive',
      });
    }
  };

  const updateGame = async (gameId: string, updates: Partial<Game>) => {
    try {
      const { data, error } = await supabase
        .from('games')
        .update(updates)
        .eq('id', gameId)
        .select()
        .single();

      if (error) throw error;
      
      const mappedGame = {
        ...data,
        mode: data.mode || 'simple' as 'simple' | 'advanced',
      };
      
      setGames(prev => prev.map(game => game.id === gameId ? mappedGame : game));
      toast({
        title: t('success.title'),
        description: t('success.gameUpdated'),
      });
    } catch (error) {
      console.error('Error updating game:', error);
      toast({
        title: t('error.title'),
        description: t('error.gameUpdateFailed'),
        variant: 'destructive',
      });
    }
  };

  const deleteGame = async (gameId: string) => {
    try {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', gameId);

      if (error) throw error;
      
      setGames(prev => prev.filter(game => game.id !== gameId));
      toast({
        title: t('success.title'),
        description: t('success.gameDeleted'),
      });
    } catch (error) {
      console.error('Error deleting game:', error);
      toast({
        title: t('error.title'),
        description: t('error.gameDeleteFailed'),
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return {
    games,
    loading,
    createGame,
    updateGame,
    deleteGame,
    refetch: fetchGames,
  };
};
