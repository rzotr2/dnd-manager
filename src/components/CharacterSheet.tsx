
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCharacters, Character } from '@/hooks/useCharacters';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateRandomCharacter } from '@/utils/characterGenerator';

interface CharacterSheetProps {
  currentGameId: string;
}

interface CustomField {
  name: string;
  type: 'text' | 'textarea';
  value: string;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ currentGameId }) => {
  const { characters, loading, createCharacter, updateCharacter, deleteCharacter } = useCharacters(currentGameId);
  const { t } = useLanguage();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  
  const [newCharacterData, setNewCharacterData] = useState({
    name: '',
    photo: '',
    fields: {} as Record<string, any>
  });

  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [characterType, setCharacterType] = useState<'random' | 'blank-themed' | 'blank-empty'>('random');
  const [selectedTheme, setSelectedTheme] = useState<string>('theme-fantasy');

  // Оновити форму при зміні типу персонажа
  useEffect(() => {
    if (characterType === 'random') {
      const randomChar = generateRandomCharacter(selectedTheme, false);
      setNewCharacterData({
        name: randomChar.name,
        photo: '',
        fields: randomChar.fields
      });
      setCustomFields([]);
    } else if (characterType === 'blank-themed') {
      const emptyChar = generateRandomCharacter(selectedTheme, true);
      setNewCharacterData({
        name: '',
        photo: '',
        fields: emptyChar.fields
      });
      setCustomFields([]);
    } else {
      setNewCharacterData({
        name: '',
        photo: '',
        fields: {}
      });
      setCustomFields([]);
    }
  }, [characterType, selectedTheme]);

  const addCustomField = () => {
    setCustomFields(prev => [...prev, { name: '', type: 'text', value: '' }]);
  };

  const updateCustomField = (index: number, field: Partial<CustomField>) => {
    setCustomFields(prev => prev.map((f, i) => i === index ? { ...f, ...field } : f));
  };

  const removeCustomField = (index: number) => {
    setCustomFields(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateCharacter = async () => {
    if (!newCharacterData.name.trim() && characterType !== 'blank-empty') return;

    // Combine generated fields with custom fields
    const allFields = { ...newCharacterData.fields };
    customFields.forEach(field => {
      if (field.name.trim()) {
        allFields[field.name] = field.value;
      }
    });

    const characterData = {
      game_id: currentGameId,
      name: newCharacterData.name || 'Новий персонаж',
      photo: newCharacterData.photo,
      theme: selectedTheme,
      fields: allFields
    };

    const created = await createCharacter(characterData);
    if (created) {
      setIsCreateDialogOpen(false);
      resetForm();
    }
  };

  const handleUpdateCharacter = async () => {
    if (!editingCharacter) return;

    const updated = await updateCharacter(editingCharacter.id, {
      name: editingCharacter.name,
      photo: editingCharacter.photo,
      fields: editingCharacter.fields
    });

    if (updated) {
      setEditingCharacter(null);
      if (selectedCharacter?.id === editingCharacter.id) {
        setSelectedCharacter(updated);
      }
    }
  };

  const resetForm = () => {
    setNewCharacterData({
      name: '',
      photo: '',
      fields: {}
    });
    setCustomFields([]);
    setCharacterType('random');
    setSelectedTheme('theme-fantasy');
  };

  const renderField = (key: string, value: any, isEditing: boolean = false) => {
    const character = isEditing ? editingCharacter : selectedCharacter;
    if (!character) return null;

    const isTextarea = key.includes('ability') || key.includes('description') || key.includes('background') || key.includes('traits') || key.includes('hobbies') || key.includes('історія') || key.includes('опис');

    if (isEditing) {
      return isTextarea ? (
        <Textarea
          value={value || ''}
          onChange={(e) => setEditingCharacter({
            ...character,
            fields: { ...character.fields, [key]: e.target.value }
          })}
          placeholder={key}
          className="w-full"
        />
      ) : (
        <Input
          value={value || ''}
          onChange={(e) => setEditingCharacter({
            ...character,
            fields: { ...character.fields, [key]: e.target.value }
          })}
          placeholder={key}
          className="w-full"
        />
      );
    }

    return isTextarea ? (
      <Textarea
        value={value || ''}
        readOnly
        className="w-full"
      />
    ) : (
      <Input
        value={value || ''}
        readOnly
        className="w-full"
      />
    );
  };

  if (loading) {
    return <div className="p-4 text-center">Завантаження...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Список персонажів */}
      <Card className="border border-border/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Персонажі</CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Створити персонажа
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Створення персонажа</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Тип персонажа */}
                  <div className="space-y-4">
                    <Label>Тип персонажа</Label>
                    <Select value={characterType} onValueChange={(value: any) => setCharacterType(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="random">Випадковий персонаж</SelectItem>
                        <SelectItem value="blank-themed">Пустий персонаж з полями теми</SelectItem>
                        <SelectItem value="blank-empty">Повністю пустий персонаж</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Тема */}
                  {characterType !== 'blank-empty' && (
                    <div className="space-y-4">
                      <Label>Тема</Label>
                      <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="theme-fantasy">Фентезі</SelectItem>
                          <SelectItem value="theme-cyberpunk">Кіберпанк</SelectItem>
                          <SelectItem value="theme-stalker">Сталкер</SelectItem>
                          <SelectItem value="theme-scifi">Наукова фантастика</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Базові поля */}
                  <div className="space-y-4">
                    <Label htmlFor="characterName">Ім'я персонажа</Label>
                    <Input
                      id="characterName"
                      value={newCharacterData.name}
                      onChange={(e) => setNewCharacterData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Введіть ім'я персонажа"
                      className="w-full"
                    />
                  </div>

                  {/* Кастомні поля */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Додаткові поля</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addCustomField}>
                        <Plus className="w-4 h-4 mr-2" />
                        Додати поле
                      </Button>
                    </div>
                    
                    {customFields.map((field, index) => (
                      <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Label className="text-xs">Назва поля</Label>
                          <Input
                            value={field.name}
                            onChange={(e) => updateCustomField(index, { name: e.target.value })}
                            placeholder="Назва поля"
                            className="w-full"
                          />
                        </div>
                        <div className="w-32">
                          <Label className="text-xs">Тип</Label>
                          <Select value={field.type} onValueChange={(value: 'text' | 'textarea') => updateCustomField(index, { type: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Текст</SelectItem>
                              <SelectItem value="textarea">Текстова область</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1">
                          <Label className="text-xs">Значення</Label>
                          {field.type === 'textarea' ? (
                            <Textarea
                              value={field.value}
                              onChange={(e) => updateCustomField(index, { value: e.target.value })}
                              placeholder="Значення"
                              className="w-full"
                            />
                          ) : (
                            <Input
                              value={field.value}
                              onChange={(e) => updateCustomField(index, { value: e.target.value })}
                              placeholder="Значення"
                              className="w-full"
                            />
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeCustomField(index)}
                          className="h-10 w-10 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Поля персонажа */}
                  {Object.keys(newCharacterData.fields).length > 0 && (
                    <div className="space-y-4">
                      <Label>Поля персонажа</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(newCharacterData.fields).map(([key, value]) => (
                          <div key={key} className="space-y-2">
                            <Label className="text-sm font-medium">{key}</Label>
                            {key.includes('ability') || key.includes('description') || key.includes('background') || key.includes('traits') || key.includes('hobbies') || key.includes('історія') || key.includes('опис') ? (
                              <Textarea
                                value={value || ''}
                                onChange={(e) => setNewCharacterData(prev => ({
                                  ...prev,
                                  fields: { ...prev.fields, [key]: e.target.value }
                                }))}
                                placeholder={key}
                                className="w-full"
                              />
                            ) : (
                              <Input
                                value={value || ''}
                                onChange={(e) => setNewCharacterData(prev => ({
                                  ...prev,
                                  fields: { ...prev.fields, [key]: e.target.value }
                                }))}
                                placeholder={key}
                                className="w-full"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button onClick={handleCreateCharacter} className="w-full">
                    Створити персонажа
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {characters.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Немає персонажів. Створіть свого першого персонажа!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {characters.map(character => (
                <Card key={character.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedCharacter(character)}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        {character.photo ? (
                          <img src={character.photo} alt={character.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{character.name}</h3>
                        <p className="text-sm text-muted-foreground">{character.theme}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCharacter(character);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCharacter(character.id);
                          }}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Деталі персонажа */}
      {selectedCharacter && (
        <Card className="border border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                {selectedCharacter.photo ? (
                  <img src={selectedCharacter.photo} alt={selectedCharacter.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">{selectedCharacter.name}</h2>
                <p className="text-muted-foreground">{selectedCharacter.theme}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.keys(selectedCharacter.fields).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(selectedCharacter.fields).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-sm font-medium">{key}</Label>
                    {renderField(key, value)}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Цей персонаж не має додаткових полів
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Діалог редагування */}
      {editingCharacter && (
        <Dialog open={!!editingCharacter} onOpenChange={() => setEditingCharacter(null)}>
          <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Редагування персонажа</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="editName">Ім'я персонажа</Label>
                <Input
                  id="editName"
                  value={editingCharacter.name}
                  onChange={(e) => setEditingCharacter({
                    ...editingCharacter,
                    name: e.target.value
                  })}
                  className="w-full"
                />
              </div>

              {Object.keys(editingCharacter.fields).length > 0 && (
                <div className="space-y-4">
                  <Label>Поля персонажа</Label>
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(editingCharacter.fields).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label className="text-sm font-medium">{key}</Label>
                        {renderField(key, value, true)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleUpdateCharacter} className="flex-1">
                  Зберегти зміни
                </Button>
                <Button variant="outline" onClick={() => setEditingCharacter(null)} className="flex-1">
                  Скасувати
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
