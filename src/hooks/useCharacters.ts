
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

export interface CharacterField {
  name: string;
  value: string;
}

export interface Character {
  id: string;
  game_id: string;
  name: string;
  photo?: string;
  theme?: string;
  fields: CharacterField[];
  created_at: string;
  updated_at: string;
}

// Helper function to safely convert Json to CharacterField[]
const safeJsonToFields = (json: Json): CharacterField[] => {
  if (Array.isArray(json)) {
    return json.map(item => ({
      name: typeof item === 'object' && item !== null && 'name' in item ? String(item.name) : '',
      value: typeof item === 'object' && item !== null && 'value' in item ? String(item.value) : ''
    }));
  }
  return [];
};

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
        fields: safeJsonToFields(char.fields),
        created_at: char.created_at,
        updated_at: char.updated_at,
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

  const createCharacter = async (characterData: Omit<Character, 'id' | 'created_at' | 'updated_at'>) => {
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
          fields: characterData.fields || [],
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
        fields: safeJsonToFields(data.fields),
        created_at: data.created_at,
        updated_at: data.updated_at,
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
      return null;
    }
  };

  const updateCharacter = async (characterId: string, updates: Partial<Character>) => {
    try {
      // Prepare updates for Supabase
      const supabaseUpdates: any = {};
      if (updates.name !== undefined) supabaseUpdates.name = updates.name;
      if (updates.photo !== undefined) supabaseUpdates.photo = updates.photo;
      if (updates.theme !== undefined) supabaseUpdates.theme = updates.theme;
      if (updates.fields !== undefined) supabaseUpdates.fields = updates.fields;

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
        fields: safeJsonToFields(data.fields),
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
      
      setCharacters(prev => prev.map(char => char.id === characterId ? transformedCharacter : char));
      return transformedCharacter;
    } catch (error) {
      console.error('Error updating character:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося оновити персонажа',
        variant: 'destructive',
      });
      return null;
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
