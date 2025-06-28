
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface CharacterField {
  id: string;
  name: string;
  value: string;
  type: 'text' | 'number' | 'textarea';
  category: 'stats' | 'skills' | 'abilities' | 'equipment' | 'other';
  isBonus?: boolean;
}

export interface Character {
  id: string;
  game_id: string;
  name: string;
  photo?: string;
  fields: CharacterField[];
}

export const useCharacters = (gameId: string | null) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCharacters = async () => {
    if (!gameId) {
      setCharacters([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('game_id', gameId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCharacters(data || []);
    } catch (error) {
      console.error('Error fetching characters:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити персонажів',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createCharacter = async (characterData: Omit<Character, 'id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('characters')
        .insert([{
          ...characterData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      setCharacters(prev => [data, ...prev]);
      toast({
        title: 'Успіх',
        description: 'Персонажа створено успішно',
      });
      
      return data;
    } catch (error) {
      console.error('Error creating character:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося створити персонажа',
        variant: 'destructive',
      });
    }
  };

  const updateCharacter = async (characterId: string, updates: Partial<Character>) => {
    try {
      const { data, error } = await supabase
        .from('characters')
        .update(updates)
        .eq('id', characterId)
        .select()
        .single();

      if (error) throw error;
      
      setCharacters(prev => prev.map(char => char.id === characterId ? data : char));
    } catch (error) {
      console.error('Error updating character:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося оновити персонажа',
        variant: 'destructive',
      });
    }
  };

  const deleteCharacter = async (characterId: string) => {
    try {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', characterId);

      if (error) throw error;
      
      setCharacters(prev => prev.filter(char => char.id !== characterId));
      toast({
        title: 'Успіх',
        description: 'Персонажа видалено успішно',
      });
    } catch (error) {
      console.error('Error deleting character:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося видалити персонажа',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, [gameId]);

  return {
    characters,
    loading,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    refetch: fetchCharacters,
  };
};
