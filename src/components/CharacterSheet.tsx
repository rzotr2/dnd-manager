
import React, { useState, useEffect } from 'react';
import { useCharacters } from '@/hooks/useCharacters';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Save, Trash2, Users, Shield, Sword, Backpack, FileText, Dice6 } from 'lucide-react';
import { CharacterFieldsData } from '@/types/character';
import { getCharacterFieldsTemplate } from '@/utils/characterGenerator';
import { useToast } from '@/hooks/use-toast';

interface CharacterSheetProps {
  gameId: string;
  theme: string;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ gameId, theme }) => {
  const { characters, createCharacter, updateCharacter, deleteCharacter } = useCharacters(gameId);
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFields, setEditingFields] = useState<CharacterFieldsData>({});
  const [characterName, setCharacterName] = useState('');

  const currentCharacter = characters.find(c => c.id === selectedCharacter);

  // Get field template based on theme
  const fieldTemplate = getCharacterFieldsTemplate(theme);

  // Initialize editing fields when character is selected
  useEffect(() => {
    if (currentCharacter) {
      setCharacterName(currentCharacter.name);
      
      // Safely parse character fields
      let characterFields: CharacterFieldsData = {};
      if (currentCharacter.fields) {
        if (typeof currentCharacter.fields === 'object' && !Array.isArray(currentCharacter.fields)) {
          characterFields = currentCharacter.fields as CharacterFieldsData;
        }
      }

      // Merge with template to ensure all fields exist
      const mergedFields = { ...fieldTemplate, ...characterFields };
      setEditingFields(mergedFields);
    } else {
      setEditingFields(fieldTemplate);
      setCharacterName('');
    }
  }, [currentCharacter, fieldTemplate]);

  const handleCreateCharacter = async () => {
    if (!characterName.trim()) {
      toast({
        title: t('character.error'),
        description: t('character.nameRequired'),
        variant: 'destructive',
      });
      return;
    }

    try {
      await createCharacter({
        name: characterName,
        fields: editingFields,
        theme,
      });
      
      toast({
        title: t('character.success'),
        description: t('character.created'),
      });
      
      setCharacterName('');
      setEditingFields(fieldTemplate);
      setIsEditing(false);
    } catch (error) {
      toast({
        title: t('character.error'),
        description: t('character.createError'),
        variant: 'destructive',
      });
    }
  };

  const handleUpdateCharacter = async () => {
    if (!selectedCharacter || !characterName.trim()) return;

    try {
      await updateCharacter(selectedCharacter, {
        name: characterName,
        fields: editingFields,
      });
      
      toast({
        title: t('character.success'),
        description: t('character.updated'),
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: t('character.error'),
        description: t('character.updateError'),
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCharacter = async (characterId: string) => {
    try {
      await deleteCharacter(characterId);
      toast({
        title: t('character.success'),
        description: t('character.deleted'),
      });
      
      if (selectedCharacter === characterId) {
        setSelectedCharacter(null);
        setIsEditing(false);
      }
    } catch (error) {
      toast({
        title: t('character.error'),
        description: t('character.deleteError'),
        variant: 'destructive',
      });
    }
  };

  const handleFieldChange = (fieldName: string, value: string | number) => {
    setEditingFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const getFieldsByCategory = (category: string) => {
    return Object.entries(fieldTemplate).filter(([_, field]) => 
      typeof field === 'object' && field.category === category
    );
  };

  const renderField = (fieldName: string, fieldValue: any) => {
    const fieldConfig = fieldTemplate[fieldName];
    if (!fieldConfig || typeof fieldConfig !== 'object') return null;

    const currentValue = editingFields[fieldName] || '';

    return (
      <div key={fieldName} className="space-y-2">
        <Label htmlFor={fieldName} className="text-sm font-medium">
          {fieldConfig.label || fieldName}
        </Label>
        {fieldConfig.type === 'textarea' ? (
          <Textarea
            id={fieldName}
            value={currentValue}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            disabled={!isEditing}
            className="min-h-[100px] resize-none"
            placeholder={fieldConfig.placeholder || ''}
          />
        ) : fieldConfig.type === 'number' ? (
          <Input
            id={fieldName}
            type="number"
            value={currentValue}
            onChange={(e) => handleFieldChange(fieldName, parseInt(e.target.value) || 0)}
            disabled={!isEditing}
            placeholder={fieldConfig.placeholder || '0'}
          />
        ) : (
          <Input
            id={fieldName}
            type="text"
            value={currentValue}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            disabled={!isEditing}
            placeholder={fieldConfig.placeholder || ''}
          />
        )}
      </div>
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'basic': return <Users className="w-4 h-4" />;
      case 'stats': return <Shield className="w-4 h-4" />;
      case 'skills': return <Sword className="w-4 h-4" />;
      case 'equipment': return <Backpack className="w-4 h-4" />;
      case 'notes': return <FileText className="w-4 h-4" />;
      default: return <Dice6 className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">{t('character.title')}</h2>
          <Badge variant="outline" className="capitalize">
            {theme?.replace('theme-', '') || 'fantasy'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {!selectedCharacter && (
            <Button onClick={handleCreateCharacter} className="gap-2">
              <Plus className="w-4 h-4" />
              {t('character.create')}
            </Button>
          )}
          
          {selectedCharacter && (
            <>
              {isEditing ? (
                <Button onClick={handleUpdateCharacter} className="gap-2">
                  <Save className="w-4 h-4" />
                  {t('character.save')}
                </Button>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  {t('character.edit')}
                </Button>
              )}
              
              <Button
                onClick={() => handleDeleteCharacter(selectedCharacter)}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Characters List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                {t('character.characters')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {characters.map((character) => (
                <div
                  key={character.id}
                  onClick={() => {
                    setSelectedCharacter(character.id);
                    setIsEditing(false);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedCharacter === character.id
                      ? 'bg-accent border-accent-foreground/20'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="font-medium">{character.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(character.updated_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
              
              {characters.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{t('character.noCharacters')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Character Details */}
        <div className="lg:col-span-3">
          {selectedCharacter || isEditing ? (
            <Card className="h-full">
              <CardHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">
                      {selectedCharacter ? currentCharacter?.name : t('character.newCharacter')}
                    </CardTitle>
                  </div>
                  
                  {(isEditing || !selectedCharacter) && (
                    <div className="space-y-2">
                      <Label htmlFor="characterName">{t('character.name')}</Label>
                      <Input
                        id="characterName"
                        value={characterName}
                        onChange={(e) => setCharacterName(e.target.value)}
                        placeholder={t('character.enterName')}
                      />
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="basic" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {t('character.basic')}
                    </TabsTrigger>
                    <TabsTrigger value="stats" className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      {t('character.stats')}
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="flex items-center gap-2">
                      <Sword className="w-4 h-4" />
                      {t('character.skills')}
                    </TabsTrigger>
                    <TabsTrigger value="equipment" className="flex items-center gap-2">
                      <Backpack className="w-4 h-4" />
                      {t('character.equipment')}
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {t('character.notes')}
                    </TabsTrigger>
                  </TabsList>

                  {['basic', 'stats', 'skills', 'equipment', 'notes'].map((category) => (
                    <TabsContent key={category} value={category} className="mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getFieldsByCategory(category).map(([fieldName, fieldValue]) =>
                          renderField(fieldName, fieldValue)
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full">
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">{t('character.selectCharacter')}</h3>
                  <p className="text-muted-foreground">{t('character.selectCharacterDescription')}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;
