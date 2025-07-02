
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  theme?: string;
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
      
      // Transform data to match our Character interface
      const transformedData = (data || []).map(char => ({
        id: char.id,
        game_id: char.game_id,
        name: char.name,
        photo: char.photo || undefined,
        theme: char.theme || 'theme-fantasy',
        fields: Array.isArray(char.fields) ? char.fields as unknown as CharacterField[] : []
      }));
      
      setCharacters(transformedData);
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
          game_id: characterData.game_id,
          name: characterData.name,
          photo: characterData.photo || null,
          theme: characterData.theme || 'theme-fantasy',
          fields: characterData.fields as any, // Cast to any for JSONB insertion
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Transform the returned data
      const transformedCharacter: Character = {
        id: data.id,
        game_id: data.game_id,
        name: data.name,
        photo: data.photo || undefined,
        theme: data.theme || 'theme-fantasy',
        fields: Array.isArray(data.fields) ? data.fields as unknown as CharacterField[] : []
      };
      
      setCharacters(prev => [transformedCharacter, ...prev]);
      toast({
        title: 'Успіх',
        description: 'Персонажа створено успішно',
      });
      
      return transformedCharacter;
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
      // Prepare updates for Supabase
      const supabaseUpdates: any = {};
      if (updates.name !== undefined) supabaseUpdates.name = updates.name;
      if (updates.photo !== undefined) supabaseUpdates.photo = updates.photo;
      if (updates.theme !== undefined) supabaseUpdates.theme = updates.theme;
      if (updates.fields !== undefined) supabaseUpdates.fields = updates.fields as any;

      const { data, error } = await supabase
        .from('characters')
        .update(supabaseUpdates)
        .eq('id', characterId)
        .select()
        .single();

      if (error) throw error;
      
      // Transform the returned data
      const transformedCharacter: Character = {
        id: data.id,
        game_id: data.game_id,
        name: data.name,
        photo: data.photo || undefined,
        theme: data.theme || 'theme-fantasy',
        fields: Array.isArray(data.fields) ? data.fields as unknown as CharacterField[] : []
      };
      
      setCharacters(prev => prev.map(char => char.id === characterId ? transformedCharacter : char));
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
