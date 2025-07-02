import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, Camera, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCharacters } from '@/hooks/useCharacters';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { generateBlankCharacter } from '@/utils/characterGenerator';

interface CharacterField {
  id: string;
  name: string;
  value: string;
  type: 'text' | 'textarea' | 'number';
}

interface CharacterSheetProps {
  gameId: string;
  theme: string;
}

// Поля для теми Сталкер
const STALKER_FIELDS = [
  { id: 'visual_description', name: 'Візуальний опис', type: 'textarea' as const },
  { id: 'special_feature', name: 'Особлива прикмета', type: 'textarea' as const },
  { id: 'background', name: 'Минуле та характер', type: 'textarea' as const },
  { id: 'habits', name: 'Звички та захоплення', type: 'textarea' as const },
  { id: 'strength', name: 'Сила', type: 'number' as const },
  { id: 'agility', name: 'Спритність', type: 'number' as const },
  { id: 'perception', name: 'Сприйняття', type: 'number' as const },
  { id: 'charisma', name: 'Харизма', type: 'number' as const },
  { id: 'intelligence', name: 'Інтелект', type: 'number' as const },
  { id: 'health_points', name: 'Очки Здоров\'я (ОЗ)', type: 'number' as const },
  { id: 'armor_class', name: 'Клас Броні (КБ)', type: 'number' as const },
  { id: 'survival', name: 'Виживання', type: 'text' as const },
  { id: 'search_hidden', name: 'Пошук прихованого', type: 'text' as const },
  { id: 'knowledge', name: 'Знання', type: 'text' as const },
  { id: 'athletics', name: 'Атлетизм', type: 'text' as const },
  { id: 'endurance', name: 'Витривалість', type: 'text' as const },
  { id: 'positive_perk', name: 'Позитивний перк', type: 'textarea' as const },
  { id: 'negative_perk', name: 'Негативний перк', type: 'textarea' as const },
  { id: 'clothing', name: 'Одяг', type: 'textarea' as const },
  { id: 'equipment', name: 'Спорядження', type: 'textarea' as const },
  { id: 'food', name: 'Їжа', type: 'textarea' as const },
  { id: 'documents_money', name: 'Документи та гроші', type: 'textarea' as const },
];

const CharacterSheet: React.FC<CharacterSheetProps> = ({ gameId, theme }) => {
  const { characters, loading, createCharacter, updateCharacter, deleteCharacter } = useCharacters(gameId);
  const { t } = useLanguage();
  const { user } = useAuth();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<string | null>(null);
  const [newCharacterData, setNewCharacterData] = useState({
    name: '',
    photo: '',
    fields: [] as CharacterField[],
  });

  // Генерація полів для різних тем
  const getFieldsForTheme = (selectedTheme: string): CharacterField[] => {
    if (selectedTheme === 'theme-stalker') {
      return STALKER_FIELDS.map(field => ({
        id: field.id,
        name: field.name,
        value: '',
        type: field.type,
      }));
    }
    return [];
  };

  const handleCreateCharacter = async () => {
    if (!newCharacterData.name.trim()) return;

    const themeFields = getFieldsForTheme(theme);
    const allFields = [...themeFields, ...newCharacterData.fields];

    const characterData = {
      game_id: gameId,
      name: newCharacterData.name,
      photo: newCharacterData.photo,
      theme: theme,
      fields: allFields,
    };

    const created = await createCharacter(characterData);
    if (created) {
      setIsCreateDialogOpen(false);
      setNewCharacterData({ name: '', photo: '', fields: [] });
    }
  };

  const handleGenerateCharacter = () => {
    const generated = generateBlankCharacter('Сталкер', theme);
    const themeFields = getFieldsForTheme(theme);
    
    // Заповнюємо базову інформацію
    setNewCharacterData({
      name: generated.name,
      photo: '',
      fields: [...themeFields, ...generated.fields.map(field => ({
        id: Date.now().toString() + Math.random(),
        name: field.name,
        value: field.value,
        type: 'text' as const,
      }))],
    });
  };

  const handleAddCustomField = () => {
    const newField: CharacterField = {
      id: Date.now().toString() + Math.random(),
      name: '',
      value: '',
      type: 'text',
    };
    setNewCharacterData(prev => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
  };

  const handleRemoveCustomField = (fieldId: string) => {
    setNewCharacterData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId),
    }));
  };

  const handleCustomFieldChange = (fieldId: string, key: keyof CharacterField, value: string) => {
    setNewCharacterData(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, [key]: value } : field
      ),
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setNewCharacterData(prev => ({ ...prev, photo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateField = async (characterId: string, fieldId: string, value: string) => {
    const character = characters.find(c => c.id === characterId);
    if (!character) return;

    const updatedFields = character.fields.map((field: any) =>
      field.id === fieldId ? { ...field, value } : field
    );

    await updateCharacter(characterId, { fields: updatedFields });
  };

  const getAllFields = (character: any): CharacterField[] => {
    const themeFields = getFieldsForTheme(character.theme || theme);
    const customFields = character.fields || [];
    
    // Об'єднуємо поля теми з збереженими полями
    const allFields = [...themeFields];
    
    // Додаємо кастомні поля, які не є полями теми
    customFields.forEach((field: any) => {
      if (!themeFields.find(tf => tf.id === field.id)) {
        allFields.push(field);
      } else {
        // Оновлюємо значення для полів теми
        const themeField = allFields.find(tf => tf.id === field.id);
        if (themeField) {
          themeField.value = field.value;
        }
      }
    });

    return allFields;
  };

  if (loading) {
    return <div className="p-4 text-center">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t('characters.title')}</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              {t('characters.create')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('characters.create')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="characterName">{t('common.name')}</Label>
                  <Input
                    id="characterName"
                    value={newCharacterData.name}
                    onChange={(e) => setNewCharacterData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={t('characters.namePlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('characters.photo')}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photoUpload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('photoUpload')?.click()}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {t('characters.uploadPhoto')}
                    </Button>
                  </div>
                  {newCharacterData.photo && (
                    <div className="relative">
                      <img
                        src={newCharacterData.photo}
                        alt="Character"
                        className="w-full h-32 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setNewCharacterData(prev => ({ ...prev, photo: '' }))}
                        className="absolute top-1 right-1"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Поля для теми */}
              {theme === 'theme-stalker' && (
                <div className="space-y-4">
                  <h4 className="font-medium">Поля для теми Сталкер:</h4>
                  {getFieldsForTheme(theme).map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label>{field.name}</Label>
                      {field.type === 'textarea' ? (
                        <Textarea
                          value={field.value}
                          onChange={(e) => handleCustomFieldChange(field.id, 'value', e.target.value)}
                          placeholder={`Введіть ${field.name.toLowerCase()}`}
                          className="min-h-[80px]"
                        />
                      ) : (
                        <Input
                          type={field.type}
                          value={field.value}
                          onChange={(e) => handleCustomFieldChange(field.id, 'value', e.target.value)}
                          placeholder={`Введіть ${field.name.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Кастомні поля */}
              {newCharacterData.fields.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Додаткові поля:</h4>
                  {newCharacterData.fields.map((field) => (
                    <div key={field.id} className="space-y-2 p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <Input
                          value={field.name}
                          onChange={(e) => handleCustomFieldChange(field.id, 'name', e.target.value)}
                          placeholder="Назва поля"
                          className="flex-1"
                        />
                        <Select
                          value={field.type}
                          onValueChange={(value: 'text' | 'textarea' | 'number') => 
                            handleCustomFieldChange(field.id, 'type', value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Текст</SelectItem>
                            <SelectItem value="textarea">Великий текст</SelectItem>
                            <SelectItem value="number">Число</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveCustomField(field.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {field.type === 'textarea' ? (
                        <Textarea
                          value={field.value}
                          onChange={(e) => handleCustomFieldChange(field.id, 'value', e.target.value)}
                          placeholder="Значення поля"
                        />
                      ) : (
                        <Input
                          type={field.type}
                          value={field.value}
                          onChange={(e) => handleCustomFieldChange(field.id, 'value', e.target.value)}
                          placeholder="Значення поля"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button type="button" onClick={handleAddCustomField} variant="outline" className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Додати поле
                </Button>
                <Button type="button" onClick={handleGenerateCharacter} variant="outline" className="flex-1">
                  Згенерувати
                </Button>
              </div>

              <Button onClick={handleCreateCharacter} className="w-full">
                {t('common.create')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {characters.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>{t('characters.noCharacters')}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {characters.map((character) => (
            <Card key={character.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{character.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingCharacter(editingCharacter === character.id ? null : character.id)}
                    >
                      {editingCharacter === character.id ? 'Завершити' : 'Редагувати'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteCharacter(character.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {character.photo && (
                  <div className="mb-4">
                    <img
                      src={character.photo}
                      alt={character.name}
                      className="w-full max-w-xs h-48 object-cover rounded border mx-auto"
                    />
                  </div>
                )}
                <div className="grid gap-4">
                  {getAllFields(character).map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label className="font-medium">{field.name}</Label>
                      {editingCharacter === character.id ? (
                        field.type === 'textarea' ? (
                          <Textarea
                            value={field.value}
                            onChange={(e) => handleUpdateField(character.id, field.id, e.target.value)}
                            className="min-h-[80px]"
                          />
                        ) : (
                          <Input
                            type={field.type}
                            value={field.value}
                            onChange={(e) => handleUpdateField(character.id, field.id, e.target.value)}
                          />
                        )
                      ) : (
                        <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {field.value || 'Не заповнено'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterSheet;
