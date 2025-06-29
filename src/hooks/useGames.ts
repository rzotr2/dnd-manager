
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
      // Fetch games where user is a member
      const { data: userGames, error: gamesError } = await supabase
        .from('games')
        .select(`
          *,
          game_members!inner(*)
        `)
        .eq('game_members.user_id', (await supabase.auth.getUser()).data.user?.id)
        .order('last_played', { ascending: false }) as any;

      if (gamesError) {
        // Fallback to user's own games if game_members table doesn't exist yet
        const { data: fallbackGames, error: fallbackError } = await supabase
          .from('games')
          .select('*')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .order('last_played', { ascending: false });

        if (fallbackError) throw fallbackError;
        setGames(fallbackGames || []);
        return;
      }

      // Map the data to remove the nested game_members
      const mappedGames = userGames?.map((game: any) => ({
        id: game.id,
        name: game.name,
        description: game.description,
        theme: game.theme,
        mode: game.mode || 'simple',
        players: game.players || [],
        created_at: game.created_at,
        last_played: game.last_played,
      })) || [];

      setGames(mappedGames);
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
      
      setGames(prev => [data, ...prev]);
      toast({
        title: t('success.title'),
        description: t('success.gameCreated'),
      });
      
      return data;
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
      
      setGames(prev => prev.map(game => game.id === gameId ? data : game));
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
