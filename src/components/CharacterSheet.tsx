import React, { useState, useEffect } from 'react';
import { Users, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCharacters, Character } from '@/hooks/useCharacters';
import { useLanguage } from '@/contexts/LanguageContext';
import CharacterImageUpload from '@/components/CharacterImageUpload';

interface CharacterSheetProps {
  currentGameId: string;
}

const themes = [
  'theme-fantasy',
  'theme-cyberpunk',
  'theme-steampunk',
  'theme-horror',
  'theme-sci-fi',
];

const getFieldTemplate = (theme: string) => {
  switch (theme) {
    case 'theme-fantasy':
      return {
        Strength: 10,
        Dexterity: 10,
        Constitution: 10,
        Intelligence: 10,
        Wisdom: 10,
        Charisma: 10,
      };
    case 'theme-cyberpunk':
      return {
        Reflexes: 10,
        Intelligence: 10,
        Cool: 10,
        TechnicalAbility: 10,
        Luck: 10,
        MovementAllowance: 10,
      };
    case 'theme-steampunk':
      return {
        Mechanics: 10,
        Alchemy: 10,
        Endurance: 10,
        Perception: 10,
        Charisma: 10,
      };
    case 'theme-horror':
      return {
        Sanity: 10,
        Strength: 10,
        Dexterity: 10,
        Intelligence: 10,
        Luck: 10,
      };
    case 'theme-sci-fi':
      return {
        Strength: 10,
        Agility: 10,
        Endurance: 10,
        Intelligence: 10,
        Perception: 10,
        Charisma: 10,
      };
    default:
      return {};
  }
};

const CharacterSheet: React.FC<CharacterSheetProps> = ({ currentGameId }) => {
  const { characters, loading, createCharacter, updateCharacter, deleteCharacter } = useCharacters(currentGameId);
  const { t } = useLanguage();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [characterName, setCharacterName] = useState('');
  const [characterFields, setCharacterFields] = useState<Record<string, any>>({});
  const [selectedTheme, setSelectedTheme] = useState('theme-fantasy');
  const [characterPhoto, setCharacterPhoto] = useState<string | null>(null);

  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

  useEffect(() => {
    setCharacterFields(getFieldTemplate(selectedTheme));
  }, [selectedTheme]);

  const handleCreateCharacter = async () => {
    if (!characterName.trim()) return;
    
    const characterData = {
      name: characterName,
      game_id: currentGameId,
      fields: characterFields,
      theme: selectedTheme,
      photo: characterPhoto
    };
    
    const newCharacter = await createCharacter(characterData);
    if (newCharacter) {
      setCharacterName('');
      setCharacterFields(getFieldTemplate(selectedTheme));
      setCharacterPhoto(null);
      setIsCreateDialogOpen(false);
    }
  };

  const handleEditCharacter = (character: Character) => {
    setEditingCharacter(character);
  };

  const handleSaveCharacter = async () => {
    if (!editingCharacter) return;

    const updated = await updateCharacter(editingCharacter.id, {
      name: editingCharacter.name,
      fields: editingCharacter.fields,
      theme: editingCharacter.theme,
      photo: editingCharacter.photo,
    });

    if (updated) {
      setEditingCharacter(null);
    }
  };

  const handleDeleteCharacter = async (characterId: string) => {
    if (window.confirm(t('characters.confirmDelete') || 'Are you sure you want to delete this character?')) {
      await deleteCharacter(characterId);
    }
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setCharacterFields(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleEditFieldChange = (fieldName: string, value: any) => {
    if (!editingCharacter) return;
    setEditingCharacter({
      ...editingCharacter,
      fields: {
        ...editingCharacter.fields,
        [fieldName]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Character Creation Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">
            <UserPlus className="w-4 h-4 mr-2" />
            {t('characters.createNew')}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('characters.createNew')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Character Photo Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Фото персонажа</Label>
              <CharacterImageUpload
                currentImage={characterPhoto}
                onImageChange={setCharacterPhoto}
              />
            </div>

            {/* Character Name */}
            <div className="space-y-2">
              <Label htmlFor="character-name" className="text-sm font-medium">
                {t('characters.name')}
              </Label>
              <Input
                id="character-name"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder={t('characters.namePlaceholder')}
              />
            </div>

            {/* Theme Selection */}
            <div className="space-y-2">
              <Label htmlFor="theme-select" className="text-sm font-medium">
                {t('characters.theme')}
              </Label>
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger id="theme-select" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {themes.map(theme => (
                    <SelectItem key={theme} value={theme}>
                      {theme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Character Fields */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('characters.fields')}</Label>
              <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                {Object.entries(characterFields).map(([fieldName, value]) => (
                  <div key={fieldName} className="space-y-1">
                    <Label className="text-xs">{fieldName}</Label>
                    <Input
                      type="text"
                      value={value}
                      onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleCreateCharacter} className="w-full">
              {t('common.create')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Characters List */}
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <Users className="w-8 h-8 text-muted-foreground mx-auto animate-pulse" />
            <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
          </div>
        </div>
      ) : characters.length === 0 ? (
        <Card className="border border-border/20">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
            <p className="text-base font-medium text-muted-foreground mb-2">
              {t('characters.noCharacters')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('characters.createFirst')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {characters.map((character) => (
            <Card key={character.id} className={`character-card ${character.theme || 'theme-fantasy'} border border-border/20 hover:shadow-md transition-shadow`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {character.photo ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                        <img 
                          src={character.photo} 
                          alt={character.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg truncate">{character.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {character.created_at ? new Date(character.created_at).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
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
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(character.fields).map(([fieldName, value]) => (
                    <div key={fieldName} className="space-y-1">
                      <Label className="text-xs">{fieldName}</Label>
                      <p className="text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Character Dialog */}
      {editingCharacter && (
        <Dialog open={!!editingCharacter} onOpenChange={() => setEditingCharacter(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Редагувати персонажа</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Character Photo Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Фото персонажа</Label>
                <CharacterImageUpload
                  currentImage={editingCharacter.photo}
                  onImageChange={(photo) => setEditingCharacter({...editingCharacter, photo})}
                  characterId={editingCharacter.id}
                />
              </div>

              {/* Character Name */}
              <div className="space-y-2">
                <Label htmlFor="edit-character-name" className="text-sm font-medium">
                  {t('characters.name')}
                </Label>
                <Input
                  id="edit-character-name"
                  value={editingCharacter.name}
                  onChange={(e) => setEditingCharacter({...editingCharacter, name: e.target.value})}
                  placeholder={t('characters.namePlaceholder')}
                />
              </div>

              {/* Theme Selection */}
              <div className="space-y-2">
                <Label htmlFor="edit-theme-select" className="text-sm font-medium">
                  {t('characters.theme')}
                </Label>
                <Select
                  value={editingCharacter.theme || 'theme-fantasy'}
                  onValueChange={(value) => setEditingCharacter({...editingCharacter, theme: value})}
                >
                  <SelectTrigger id="edit-theme-select" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map(theme => (
                      <SelectItem key={theme} value={theme}>
                        {theme}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Character Fields */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('characters.fields')}</Label>
                <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                  {Object.entries(editingCharacter.fields).map(([fieldName, value]) => (
                    <div key={fieldName} className="space-y-1">
                      <Label className="text-xs">{fieldName}</Label>
                      <Input
                        type="text"
                        value={value}
                        onChange={(e) => handleEditFieldChange(fieldName, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSaveCharacter} className="flex-1">
                  {t('common.save')}
                </Button>
                <Button variant="outline" onClick={() => setEditingCharacter(null)} className="flex-1">
                  {t('common.cancel')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CharacterSheet;
