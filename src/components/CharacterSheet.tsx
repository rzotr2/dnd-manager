
import React, { useState } from 'react';
import { User, Plus, Edit3, Trash2, Save, Upload, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CharacterField {
  id: string;
  name: string;
  value: string;
  type: 'text' | 'number' | 'textarea';
  category: 'stats' | 'skills' | 'abilities' | 'equipment' | 'other';
}

interface Character {
  id: string;
  name: string;
  photo?: string;
  fields: CharacterField[];
}

const CharacterSheet: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([
    {
      id: '1',
      name: 'Мій персонаж',
      photo: undefined,
      fields: [
        { id: 'strength', name: 'Сила', value: '10', type: 'number', category: 'stats' },
        { id: 'dexterity', name: 'Спритність', value: '12', type: 'number', category: 'stats' },
        { id: 'constitution', name: 'Витривалість', value: '14', type: 'number', category: 'stats' },
        { id: 'intelligence', name: 'Інтелект', value: '13', type: 'number', category: 'stats' },
        { id: 'wisdom', name: 'Мудрість', value: '15', type: 'number', category: 'stats' },
        { id: 'charisma', name: 'Харизма', value: '11', type: 'number', category: 'stats' },
        { id: 'acrobatics', name: 'Акробатика', value: '5', type: 'number', category: 'skills' },
        { id: 'athletics', name: 'Атлетика', value: '3', type: 'number', category: 'skills' },
        { id: 'stealth', name: 'Скритність', value: '7', type: 'number', category: 'skills' },
        { id: 'fireball', name: 'Вогняна Куля', value: 'Заклинання 3 рівня', type: 'text', category: 'abilities' },
        { id: 'sword', name: 'Меч', value: '1д8+3', type: 'text', category: 'equipment' },
        { id: 'notes', name: 'Нотатки', value: '', type: 'textarea', category: 'other' }
      ]
    }
  ]);
  
  const [activeCharacter, setActiveCharacter] = useState('1');
  const [isEditing, setIsEditing] = useState(false);
  const [newField, setNewField] = useState({ name: '', type: 'text' as const, category: 'other' as const });

  const currentCharacter = characters.find(c => c.id === activeCharacter);

  const updateField = (fieldId: string, value: string) => {
    setCharacters(prev => prev.map(char => 
      char.id === activeCharacter 
        ? {
            ...char,
            fields: char.fields.map(field => 
              field.id === fieldId ? { ...field, value } : field
            )
          }
        : char
    ));
  };

  const addNewField = () => {
    if (!newField.name.trim()) return;
    
    const field: CharacterField = {
      id: Date.now().toString(),
      name: newField.name,
      value: '',
      type: newField.type,
      category: newField.category
    };

    setCharacters(prev => prev.map(char => 
      char.id === activeCharacter 
        ? { ...char, fields: [...char.fields, field] }
        : char
    ));
    
    setNewField({ name: '', type: 'text', category: 'other' });
  };

  const deleteField = (fieldId: string) => {
    setCharacters(prev => prev.map(char => 
      char.id === activeCharacter 
        ? { ...char, fields: char.fields.filter(field => field.id !== fieldId) }
        : char
    ));
  };

  const addNewCharacter = () => {
    const newCharacter: Character = {
      id: Date.now().toString(),
      name: 'Новий персонаж',
      fields: [
        { id: 'strength', name: 'Сила', value: '10', type: 'number', category: 'stats' },
        { id: 'dexterity', name: 'Спритність', value: '10', type: 'number', category: 'stats' },
        { id: 'constitution', name: 'Витривалість', value: '10', type: 'number', category: 'stats' }
      ]
    };
    
    setCharacters(prev => [...prev, newCharacter]);
    setActiveCharacter(newCharacter.id);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e.target?.result as string;
        setCharacters(prev => prev.map(char => 
          char.id === activeCharacter 
            ? { ...char, photo: photoUrl }
            : char
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const getFieldsByCategory = (category: string) => {
    return currentCharacter?.fields.filter(field => field.category === category) || [];
  };

  const CategorySection = ({ title, category }: { title: string; category: string }) => {
    const fields = getFieldsByCategory(category);
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.map(field => (
            <div key={field.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={field.id}>{field.name}</Label>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteField(field.id)}
                    className="text-destructive hover:text-destructive h-6 w-6 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.id}
                  value={field.value}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  placeholder={`Введіть ${field.name.toLowerCase()}`}
                />
              ) : (
                <Input
                  id={field.id}
                  type={field.type}
                  value={field.value}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  placeholder={`Введіть ${field.name.toLowerCase()}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-6 h-6 text-primary" />
              Аркуші персонажів
            </div>
            <Button onClick={addNewCharacter} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Новий персонаж
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCharacter} onValueChange={setActiveCharacter}>
            <TabsList className="mb-6">
              {characters.map(character => (
                <TabsTrigger key={character.id} value={character.id}>
                  {character.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {characters.map(character => (
              <TabsContent key={character.id} value={character.id}>
                <div className="space-y-6">
                  {/* Character Info & Photo */}
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <Label htmlFor="characterName">Ім'я персонажа</Label>
                      <Input
                        id="characterName"
                        value={character.name}
                        onChange={(e) => {
                          setCharacters(prev => prev.map(char => 
                            char.id === character.id 
                              ? { ...char, name: e.target.value }
                              : char
                          ));
                        }}
                        className="text-lg font-semibold"
                      />
                    </div>
                    
                    <div className="flex flex-col items-center space-y-2">
                      <Label>Фото персонажа</Label>
                      <div className="relative">
                        {character.photo ? (
                          <img 
                            src={character.photo} 
                            alt={character.name}
                            className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground">
                            <Camera className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        <label className="absolute bottom-0 right-0 cursor-pointer">
                          <div className="bg-primary text-primary-foreground rounded-full p-1 shadow-md hover:bg-primary/90">
                            <Upload className="w-3 h-3" />
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Character Fields by Category */}
                  <CategorySection title="Основні характеристики" category="stats" />
                  <CategorySection title="Навички" category="skills" />
                  <CategorySection title="Здібності" category="abilities" />
                  <CategorySection title="Спорядження" category="equipment" />
                  <CategorySection title="Інше" category="other" />

                  {/* Add New Field */}
                  {isEditing && (
                    <Card className="border-dashed border-2 border-muted-foreground/25">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Input
                            placeholder="Назва нового поля"
                            value={newField.name}
                            onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                          />
                          <Select value={newField.type} onValueChange={(value: 'text' | 'number' | 'textarea') => setNewField(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Текст</SelectItem>
                              <SelectItem value="number">Число</SelectItem>
                              <SelectItem value="textarea">Опис</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select value={newField.category} onValueChange={(value: 'stats' | 'skills' | 'abilities' | 'equipment' | 'other') => setNewField(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="stats">Характеристики</SelectItem>
                              <SelectItem value="skills">Навички</SelectItem>
                              <SelectItem value="abilities">Здібності</SelectItem>
                              <SelectItem value="equipment">Спорядження</SelectItem>
                              <SelectItem value="other">Інше</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button onClick={addNewField}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Edit Toggle */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      {isEditing ? 'Завершити редагування' : 'Редагувати поля'}
                    </Button>
                    
                    <Button>
                      <Save className="w-4 h-4 mr-2" />
                      Зберегти
                    </Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CharacterSheet;
