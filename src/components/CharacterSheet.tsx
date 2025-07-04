
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, User, Dice6, X } from 'lucide-react';
import { useCharacters, type Character, type CharacterField } from '@/hooks/useCharacters';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateRandomCharacter, getBasicCharacterFields, getAllThemes } from '@/utils/characterGenerator';
import CharacterImageUpload from './CharacterImageUpload';

interface CharacterSheetProps {
  gameId: string;
  theme?: string;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ gameId, theme = 'theme-fantasy' }) => {
  const { characters, loading, createCharacter, updateCharacter, deleteCharacter } = useCharacters(gameId);
  const { t } = useLanguage();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [newCharacterName, setNewCharacterName] = useState('');
  const [newCharacterTheme, setNewCharacterTheme] = useState(theme);
  const [newCharacterFields, setNewCharacterFields] = useState<CharacterField[]>(getBasicCharacterFields());
  const [newFieldName, setNewFieldName] = useState('');

  const allThemes = getAllThemes();

  useEffect(() => {
    setNewCharacterTheme(theme);
  }, [theme]);

  const handleCreateCharacter = async () => {
    if (!newCharacterName.trim()) return;

    await createCharacter({
      game_id: gameId,
      name: newCharacterName,
      theme: newCharacterTheme,
      fields: newCharacterFields,
    });

    setNewCharacterName('');
    setNewCharacterFields(getBasicCharacterFields());
    setIsCreateDialogOpen(false);
  };

  const handleGenerateRandom = () => {
    const randomCharacterData = generateRandomCharacter(newCharacterTheme as any);
    setNewCharacterName(randomCharacterData.name);
    setNewCharacterFields(randomCharacterData.fields);
  };

  const handleEditCharacter = (character: Character) => {
    setEditingCharacter(character);
    setNewCharacterName(character.name);
    setNewCharacterTheme(character.theme || theme);
    // Ensure fields is always an array
    const characterFields = Array.isArray(character.fields) 
      ? character.fields 
      : getBasicCharacterFields();
    setNewCharacterFields(characterFields);
  };

  const handleUpdateCharacter = async () => {
    if (!editingCharacter || !newCharacterName.trim()) return;

    await updateCharacter(editingCharacter.id, {
      name: newCharacterName,
      theme: newCharacterTheme,
      fields: newCharacterFields,
    });

    setEditingCharacter(null);
    setNewCharacterName('');
    setNewCharacterFields(getBasicCharacterFields());
  };

  const handleDeleteCharacter = async (characterId: string) => {
    if (window.confirm(t('characters.deleteConfirm'))) {
      await deleteCharacter(characterId);
    }
  };

  const addNewField = () => {
    if (newFieldName.trim()) {
      setNewCharacterFields([...newCharacterFields, { name: newFieldName, value: '' }]);
      setNewFieldName('');
    }
  };

  const updateField = (index: number, key: 'name' | 'value', value: string) => {
    const updatedFields = [...newCharacterFields];
    updatedFields[index][key] = value;
    setNewCharacterFields(updatedFields);
  };

  const removeField = (index: number) => {
    const updatedFields = newCharacterFields.filter((_, i) => i !== index);
    setNewCharacterFields(updatedFields);
  };

  const resetForm = () => {
    setNewCharacterName('');
    setNewCharacterTheme(theme);
    setNewCharacterFields(getBasicCharacterFields());
    setNewFieldName('');
    setEditingCharacter(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <User className="w-8 h-8 text-muted-foreground mx-auto animate-pulse" />
          <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Character Creation/Edit Dialog */}
      <Dialog 
        open={isCreateDialogOpen || !!editingCharacter} 
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            resetForm();
          }
        }}
      >
        <DialogTrigger asChild>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="mb-4">
            <Plus className="w-4 h-4 mr-2" />
            {t('characters.createNew')}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {editingCharacter ? t('characters.editCharacter') : t('characters.createNew')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Character Name */}
            <div className="space-y-2">
              <Label htmlFor="character-name">{t('characters.name')}</Label>
              <div className="flex gap-2">
                <Input
                  id="character-name"
                  placeholder={t('characters.namePlaceholder')}
                  value={newCharacterName}
                  onChange={(e) => setNewCharacterName(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateRandom}
                  className="px-3"
                  title={t('characters.generateRandom')}
                >
                  <Dice6 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Character Theme */}
            <div className="space-y-2">
              <Label htmlFor="character-theme">{t('characters.theme')}</Label>
              <Select value={newCharacterTheme} onValueChange={setNewCharacterTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allThemes.map((themeOption) => (
                    <SelectItem key={themeOption.key} value={themeOption.key}>
                      {themeOption.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Character Fields */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">{t('characters.characteristics')}</Label>
              </div>
              
              {newCharacterFields.map((field, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">{t('characters.fieldName')}</Label>
                    <Input
                      placeholder={t('characters.fieldName')}
                      value={field.name}
                      onChange={(e) => updateField(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">{t('characters.fieldValue')}</Label>
                    <Input
                      placeholder={t('characters.fieldValue')}
                      value={field.value}
                      onChange={(e) => updateField(index, 'value', e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeField(index)}
                    className="px-2"
                    title={t('characters.removeField')}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {/* Add New Field */}
              <div className="flex gap-2 pt-2 border-t">
                <Input
                  placeholder={t('characters.addField')}
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addNewField()}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addNewField}
                  disabled={!newFieldName.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={editingCharacter ? handleUpdateCharacter : handleCreateCharacter}
                disabled={!newCharacterName.trim()}
                className="flex-1"
              >
                {editingCharacter ? t('common.save') : t('common.create')}
              </Button>
              <Button
                variant="outline"
                onClick={resetForm}
                className="flex-1"
              >
                {t('common.cancel')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Characters List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {characters.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <User className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              {t('characters.noCharacters')}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('characters.createFirstCharacter')}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t('characters.createNew')}
            </Button>
          </div>
        ) : (
          characters.map((character) => (
            <Card key={character.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{character.name}</CardTitle>
                    {character.theme && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {getAllThemes().find(t => t.key === character.theme)?.name || character.theme}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditCharacter(character)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCharacter(character.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Character Image */}
                <CharacterImageUpload
                  characterId={character.id}
                  currentImage={character.photo}
                  onImageChange={(url) => {
                    // Оновлення відбудеться автоматично через хук
                  }}
                />

                {/* Character Fields */}
                {character.fields && character.fields.length > 0 && (
                  <div className="space-y-2">
                    <Separator />
                    <div className="grid gap-2">
                      {character.fields.map((field, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{field.name}:</span>
                          <span className="text-sm text-muted-foreground">{field.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CharacterSheet;
