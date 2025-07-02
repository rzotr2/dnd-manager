
import React, { useState } from 'react';
import { User, Plus, Edit3, Trash2, Upload, Camera, Shuffle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useCharacters, CharacterField } from '@/hooks/useCharacters';
import { generateRandomCharacter, generateBlankCharacter, gameModes } from '@/utils/characterGenerator';
import { useGames } from '@/hooks/useGames';

interface NewFieldState {
  name: string;
  type: 'text' | 'number' | 'textarea';
  category: 'stats' | 'skills' | 'abilities' | 'equipment' | 'other';
}

interface CharacterSheetProps {
  currentGameId: string | null;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ currentGameId }) => {
  const { characters, loading, createCharacter, updateCharacter, deleteCharacter } = useCharacters(currentGameId);
  const { games } = useGames();
  const [activeCharacter, setActiveCharacter] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBlankDialogOpen, setIsBlankDialogOpen] = useState(false);
  const [gameMode, setGameMode] = useState<'simple' | 'standard'>('simple');
  const [newField, setNewField] = useState<NewFieldState>({ 
    name: '', 
    type: 'text', 
    category: 'other' 
  });

  const currentGame = games.find(g => g.id === currentGameId);
  const currentGameTheme = currentGame?.theme || 'theme-fantasy';

  React.useEffect(() => {
    if (characters.length > 0 && !activeCharacter) {
      setActiveCharacter(characters[0].id);
    }
  }, [characters, activeCharacter]);

  const currentCharacter = characters.find(c => c.id === activeCharacter);

  const updateField = (fieldId: string, value: string) => {
    if (!currentCharacter) return;
    
    const updatedFields = currentCharacter.fields.map(field => 
      field.id === fieldId ? { ...field, value } : field
    );
    
    updateCharacter(currentCharacter.id, { fields: updatedFields });
  };

  const addNewField = () => {
    if (!newField.name.trim() || !currentCharacter) return;
    
    const field: CharacterField = {
      id: Date.now().toString(),
      name: newField.name,
      value: '',
      type: newField.type,
      category: newField.category
    };

    const updatedFields = [...currentCharacter.fields, field];
    updateCharacter(currentCharacter.id, { fields: updatedFields });
    
    setNewField({ name: '', type: 'text', category: 'other' });
  };

  const deleteField = (fieldId: string) => {
    if (!currentCharacter) return;
    
    const updatedFields = currentCharacter.fields.filter(field => field.id !== fieldId);
    updateCharacter(currentCharacter.id, { fields: updatedFields });
  };

  const handleCreateRandomCharacter = async () => {
    if (!currentGameId) return;
    
    const randomCharacter = generateRandomCharacter(gameMode, currentGameId, currentGameTheme);
    const createdCharacter = await createCharacter(randomCharacter);
    
    if (createdCharacter) {
      setActiveCharacter(createdCharacter.id);
      setIsCreateDialogOpen(false);
    }
  };

  const handleCreateBlankCharacter = async (withFields: boolean) => {
    if (!currentGameId) return;
    
    let blankCharacter;
    if (withFields) {
      blankCharacter = generateBlankCharacter(currentGameId, currentGameTheme, gameMode);
    } else {
      blankCharacter = {
        game_id: currentGameId,
        name: 'Новий персонаж',
        theme: currentGameTheme,
        fields: []
      };
    }
    
    const createdCharacter = await createCharacter(blankCharacter);
    
    if (createdCharacter) {
      setActiveCharacter(createdCharacter.id);
      setIsBlankDialogOpen(false);
      setIsCreateDialogOpen(false);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && currentCharacter) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e.target?.result as string;
        updateCharacter(currentCharacter.id, { photo: photoUrl });
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
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map(field => (
            <div key={field.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor={field.id} className="flex items-center gap-2">
                  {field.name}
                  {field.isBonus && (
                    <Badge variant="secondary" className="text-xs">
                      Бонус
                    </Badge>
                  )}
                </Label>
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
                  className={`min-h-[120px] ${field.isBonus ? 'border-yellow-300 bg-yellow-50' : ''}`}
                />
              ) : (
                <Input
                  id={field.id}
                  type={field.type}
                  value={field.value}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  placeholder={`Введіть ${field.name.toLowerCase()}`}
                  className={field.isBonus ? 'border-yellow-300 bg-yellow-50' : ''}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center p-4">Завантаження персонажів...</div>;
  }

  if (!currentGameId) {
    return (
      <Card className="glass-effect">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Оберіть гру для роботи з персонажами</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-6 h-6 text-primary" />
              Аркуші персонажів
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Новий персонаж
                </Button>
              </DialogTrigger>
              <DialogContent className="space-y-6">
                <DialogHeader>
                  <DialogTitle>Створити персонажа</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label>Режим гри</Label>
                    <Select value={gameMode} onValueChange={(value: 'simple' | 'standard') => setGameMode(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {gameModes.map(mode => (
                          <SelectItem key={mode.id} value={mode.id}>
                            <div>
                              <div className="font-semibold">{mode.name}</div>
                              <div className="text-xs text-muted-foreground">{mode.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <Button onClick={handleCreateRandomCharacter} className="w-full">
                      <Shuffle className="w-4 h-4 mr-2" />
                      Випадковий персонаж
                    </Button>
                    <Dialog open={isBlankDialogOpen} onOpenChange={setIsBlankDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Settings className="w-4 h-4 mr-2" />
                          Пустий персонаж
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="space-y-6">
                        <DialogHeader>
                          <DialogTitle>Тип пустого персонажа</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Оберіть, як створити пустого персонажа:
                          </p>
                          <div className="flex flex-col gap-3">
                            <Button onClick={() => handleCreateBlankCharacter(true)} className="w-full">
                              З пустими полями (під тему)
                            </Button>
                            <Button onClick={() => handleCreateBlankCharacter(false)} variant="outline" className="w-full">
                              Повністю пустий
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {characters.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">У цій грі ще немає персонажів</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Створити першого персонажа
              </Button>
            </div>
          ) : (
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
                  <div className="space-y-8">
                    {/* Character Info & Photo */}
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1 space-y-3">
                        <Label htmlFor="characterName">Ім'я персонажа</Label>
                        <Input
                          id="characterName"
                          value={character.name}
                          onChange={(e) => updateCharacter(character.id, { name: e.target.value })}
                          className="text-lg font-semibold"
                        />
                      </div>
                      
                      <div className="flex flex-col items-center space-y-4">
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
                        <CardContent className="p-6">
                          <div className="flex flex-col gap-4">
                            <Input
                              placeholder="Назва нового поля"
                              value={newField.name}
                              onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                            />
                            <div className="flex flex-col sm:flex-row gap-4">
                              <Select 
                                value={newField.type} 
                                onValueChange={(value: 'text' | 'number' | 'textarea') => 
                                  setNewField(prev => ({ ...prev, type: value }))
                                }
                              >
                                <SelectTrigger className="w-full sm:w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">Текст</SelectItem>
                                  <SelectItem value="number">Число</SelectItem>
                                  <SelectItem value="textarea">Опис</SelectItem>
                                </SelectContent>
                              </Select>
                              <Select 
                                value={newField.category} 
                                onValueChange={(value: 'stats' | 'skills' | 'abilities' | 'equipment' | 'other') => 
                                  setNewField(prev => ({ ...prev, category: value }))
                                }
                              >
                                <SelectTrigger className="w-full sm:w-48">
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
                              <Button onClick={addNewField} className="w-full sm:w-auto">
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Edit Toggle */}
                    <div className="flex justify-between items-center pt-6 border-t space-y-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        {isEditing ? 'Завершити редагування' : 'Редагувати поля'}
                      </Button>
                      
                      <Button
                        variant="destructive"
                        onClick={() => {
                          deleteCharacter(character.id);
                          if (characters.length > 1) {
                            const remainingChars = characters.filter(c => c.id !== character.id);
                            setActiveCharacter(remainingChars[0]?.id || '');
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Видалити персонажа
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CharacterSheet;
