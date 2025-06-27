
import React, { useState } from 'react';
import { User, Plus, Edit3, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CharacterField {
  id: string;
  name: string;
  value: string;
  type: 'text' | 'number' | 'textarea';
}

interface Character {
  id: string;
  name: string;
  fields: CharacterField[];
}

const CharacterSheet: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([
    {
      id: '1',
      name: 'Мій персонаж',
      fields: [
        { id: 'strength', name: 'Сила', value: '10', type: 'number' },
        { id: 'dexterity', name: 'Спритність', value: '12', type: 'number' },
        { id: 'constitution', name: 'Витривалість', value: '14', type: 'number' },
        { id: 'intelligence', name: 'Інтелект', value: '13', type: 'number' },
        { id: 'wisdom', name: 'Мудрість', value: '15', type: 'number' },
        { id: 'charisma', name: 'Харизма', value: '11', type: 'number' },
        { id: 'notes', name: 'Нотатки', value: '', type: 'textarea' }
      ]
    }
  ]);
  
  const [activeCharacter, setActiveCharacter] = useState('1');
  const [isEditing, setIsEditing] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');

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
    if (!newFieldName.trim()) return;
    
    const newField: CharacterField = {
      id: Date.now().toString(),
      name: newFieldName,
      value: '',
      type: 'text'
    };

    setCharacters(prev => prev.map(char => 
      char.id === activeCharacter 
        ? { ...char, fields: [...char.fields, newField] }
        : char
    ));
    
    setNewFieldName('');
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
        { id: 'strength', name: 'Сила', value: '10', type: 'number' },
        { id: 'dexterity', name: 'Спритність', value: '10', type: 'number' },
        { id: 'constitution', name: 'Витривалість', value: '10', type: 'number' }
      ]
    };
    
    setCharacters(prev => [...prev, newCharacter]);
    setActiveCharacter(newCharacter.id);
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
                  {/* Character Name */}
                  <div>
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

                  {/* Character Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {character.fields.map(field => (
                      <div key={field.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={field.id}>{field.name}</Label>
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteField(field.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
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

                  {/* Add New Field */}
                  {isEditing && (
                    <Card className="border-dashed border-2 border-muted-foreground/25">
                      <CardContent className="p-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Назва нового поля"
                            value={newFieldName}
                            onChange={(e) => setNewFieldName(e.target.value)}
                          />
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
