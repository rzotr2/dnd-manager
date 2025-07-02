
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCharacters } from '@/hooks/useCharacters';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import DiceRoller from '@/components/DiceRoller';
import CombatSystem from '@/components/CombatSystem';
import { generateBlankCharacter } from '@/utils/characterGenerator';

interface CharacterField {
  name: string;
  value: string | number;
  type: 'text' | 'number' | 'textarea';
  category: 'basic' | 'stats' | 'skills' | 'equipment' | 'notes';
}

interface CharacterSheetProps {
  gameId: string;
  theme: string;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ gameId, theme }) => {
  const { characters, loading, createCharacter, updateCharacter, deleteCharacter } = useCharacters(gameId);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [characterName, setCharacterName] = useState('');
  const [characterPhoto, setCharacterPhoto] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const currentCharacter = characters.find(char => char.id === selectedCharacter);

  useEffect(() => {
    if (currentCharacter && currentCharacter.fields) {
      setFieldValues(currentCharacter.fields);
      setCharacterName(currentCharacter.name);
      setCharacterPhoto(currentCharacter.photo || '');
    }
  }, [currentCharacter]);

  const handleCreateCharacter = async () => {
    if (!characterName.trim()) {
      toast({
        title: t('error.title'),
        description: t('character.nameRequired'),
        variant: 'destructive',
      });
      return;
    }

    try {
      const blankCharacter = generateBlankCharacter(theme);
      const newCharacter = await createCharacter({
        game_id: gameId,
        name: characterName,
        photo: characterPhoto,
        theme: theme,
        fields: blankCharacter.fields,
      });

      if (newCharacter) {
        setSelectedCharacter(newCharacter.id);
        setShowCreateForm(false);
        setCharacterName('');
        setCharacterPhoto('');
        toast({
          title: t('success.title'),
          description: t('character.created'),
        });
      }
    } catch (error) {
      console.error('Error creating character:', error);
      toast({
        title: t('error.title'),
        description: t('character.createError'),
        variant: 'destructive',
      });
    }
  };

  const handleUpdateField = async (fieldName: string, value: any) => {
    if (!currentCharacter) return;

    const updatedFields = {
      ...fieldValues,
      [fieldName]: value,
    };

    setFieldValues(updatedFields);

    try {
      await updateCharacter(currentCharacter.id, {
        fields: updatedFields,
      });
    } catch (error) {
      console.error('Error updating field:', error);
      toast({
        title: t('error.title'),
        description: t('character.updateError'),
        variant: 'destructive',
      });
    }
  };

  const handleUpdateCharacterInfo = async () => {
    if (!currentCharacter) return;

    try {
      await updateCharacter(currentCharacter.id, {
        name: characterName,
        photo: characterPhoto,
      });
      setIsEditing(false);
      toast({
        title: t('success.title'),
        description: t('character.updated'),
      });
    } catch (error) {
      console.error('Error updating character:', error);
      toast({
        title: t('error.title'),
        description: t('character.updateError'),
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCharacter = async () => {
    if (!currentCharacter) return;

    try {
      await deleteCharacter(currentCharacter.id);
      setSelectedCharacter(null);
      toast({
        title: t('success.title'),
        description: t('character.deleted'),
      });
    } catch (error) {
      console.error('Error deleting character:', error);
      toast({
        title: t('error.title'),
        description: t('character.deleteError'),
        variant: 'destructive',
      });
    }
  };

  const renderField = (field: CharacterField) => {
    const isCurrentlyEditing = editingField === field.name;
    const value = fieldValues[field.name] || field.value || '';

    return (
      <div key={field.name} className="space-y-2">
        <Label htmlFor={field.name} className="text-sm font-medium">
          {field.name}
        </Label>
        {isCurrentlyEditing ? (
          <div className="flex gap-2">
            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                value={value}
                onChange={(e) => setFieldValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                className="flex-1 min-h-[100px] p-2 border rounded-md"
                autoFocus
              />
            ) : (
              <Input
                id={field.name}
                type={field.type}
                value={value}
                onChange={(e) => setFieldValues(prev => ({ 
                  ...prev, 
                  [field.name]: field.type === 'number' ? Number(e.target.value) : e.target.value 
                }))}
                className="flex-1"
                autoFocus
              />
            )}
            <Button
              size="sm"
              onClick={() => {
                handleUpdateField(field.name, fieldValues[field.name]);
                setEditingField(null);
              }}
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditingField(null);
                setFieldValues(prev => ({ ...prev, [field.name]: currentCharacter?.fields[field.name] || field.value }));
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div
            className="p-2 border rounded-md cursor-pointer hover:bg-gray-50 min-h-[40px] flex items-center"
            onClick={() => setEditingField(field.name)}
          >
            {value || 'Click to edit'}
          </div>
        )}
      </div>
    );
  };

  const getAllFields = (): CharacterField[] => {
    if (!currentCharacter) return [];

    const blankCharacter = generateBlankCharacter(theme);
    const baseFields = blankCharacter.fields || [];
    
    // Get custom fields from the character's stored fields
    const customFields = Object.entries(currentCharacter.fields || {})
      .filter(([key]) => !baseFields.some(field => field.name === key))
      .map(([key, value]) => ({
        name: key,
        value: value,
        type: 'text' as const,
        category: 'notes' as const,
      }));

    return [...baseFields, ...customFields];
  };

  const getFieldsByCategory = (category: string): CharacterField[] => {
    return getAllFields().filter(field => field.category === category);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  if (!currentCharacter && !showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t('character.title')}</h2>
          <Button onClick={() => setShowCreateForm(true)}>
            {t('character.create')}
          </Button>
        </div>

        {characters.length > 0 ? (
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold">{t('character.selectExisting')}</h3>
            <div className="grid gap-2">
              {characters.map((character) => (
                <Card
                  key={character.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedCharacter(character.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {character.photo && (
                        <img
                          src={character.photo}
                          alt={character.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h4 className="font-semibold">{character.name}</h4>
                        <Badge variant="secondary">{character.theme}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">{t('character.noCharacters')}</p>
            <Button onClick={() => setShowCreateForm(true)}>
              {t('character.createFirst')}
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t('character.create')}</h2>
          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
            {t('common.cancel')}
          </Button>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="characterName">{t('character.name')}</Label>
              <Input
                id="characterName"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder={t('character.namePlaceholder')}
              />
            </div>

            <div>
              <Label htmlFor="characterPhoto">{t('character.photo')}</Label>
              <Input
                id="characterPhoto"
                value={characterPhoto}
                onChange={(e) => setCharacterPhoto(e.target.value)}
                placeholder={t('character.photoPlaceholder')}
              />
            </div>

            <Button onClick={handleCreateCharacter} className="w-full">
              {t('character.create')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {currentCharacter?.photo && (
            <img
              src={currentCharacter.photo}
              alt={currentCharacter.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div>
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  className="text-2xl font-bold"
                />
                <Input
                  value={characterPhoto}
                  onChange={(e) => setCharacterPhoto(e.target.value)}
                  placeholder={t('character.photoPlaceholder')}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleUpdateCharacterInfo}>
                    {t('common.save')}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    {t('common.cancel')}
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold">{currentCharacter?.name}</h2>
                <Badge variant="secondary">{currentCharacter?.theme}</Badge>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setSelectedCharacter(null)}
          >
            {t('character.back')}
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? t('common.cancel') : t('common.edit')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteCharacter}
          >
            {t('common.delete')}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">{t('character.basic')}</TabsTrigger>
          <TabsTrigger value="stats">{t('character.stats')}</TabsTrigger>
          <TabsTrigger value="skills">{t('character.skills')}</TabsTrigger>
          <TabsTrigger value="equipment">{t('character.equipment')}</TabsTrigger>
          <TabsTrigger value="notes">{t('character.notes')}</TabsTrigger>
          <TabsTrigger value="tools">{t('character.tools')}</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('character.basicInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {getFieldsByCategory('basic').map(renderField)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('character.statistics')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {getFieldsByCategory('stats').map(renderField)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('character.skills')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {getFieldsByCategory('skills').map(renderField)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('character.equipment')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {getFieldsByCategory('equipment').map(renderField)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('character.notes')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {getFieldsByCategory('notes').map(renderField)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('dice.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <DiceRoller />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('combat.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CombatSystem />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CharacterSheet;
