
import React, { useState } from 'react';
import { Plus, Play, Edit3, Trash2, Users, Calendar, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGames } from '@/hooks/useGames';

const themes = [
  { id: 'theme-fantasy', name: 'Фентезі' },
  { id: 'theme-cyberpunk', name: 'Кіберпанк' },
  { id: 'theme-classic', name: 'Класичний' },
  { id: 'theme-stalker', name: 'Сталкер' },
  { id: 'theme-minimalist', name: 'Мінімалізм' },
  { id: 'theme-retro', name: 'Ретро' },
  { id: 'theme-space', name: 'Космос' },
  { id: 'theme-western', name: 'Вестерн' },
  { id: 'theme-apocalypse', name: 'Постапокаліпсис' }
];

interface GameManagerProps {
  currentGame: string | null;
  onGameChange: (gameId: string) => void;
  onThemeChange: (theme: string) => void;
}

const GameManager: React.FC<GameManagerProps> = ({ currentGame, onGameChange, onThemeChange }) => {
  const { games, loading, createGame, deleteGame } = useGames();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGame, setNewGame] = useState({
    name: '',
    description: '',
    theme: 'theme-fantasy',
    players: ''
  });

  const handleCreateGame = async () => {
    if (!newGame.name.trim()) return;

    const gameData = {
      name: newGame.name,
      description: newGame.description,
      theme: newGame.theme,
      players: newGame.players.split(',').map(p => p.trim()).filter(p => p)
    };

    const createdGame = await createGame(gameData);
    if (createdGame) {
      onGameChange(createdGame.id);
      onThemeChange(createdGame.theme);
      setNewGame({ name: '', description: '', theme: 'theme-fantasy', players: '' });
      setIsCreateDialogOpen(false);
    }
  };

  const handleGameSelect = (gameId: string) => {
    onGameChange(gameId);
    const selectedGame = games.find(g => g.id === gameId);
    if (selectedGame) {
      onThemeChange(selectedGame.theme);
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    await deleteGame(gameId);
    if (currentGame === gameId && games.length > 1) {
      const remainingGames = games.filter(g => g.id !== gameId);
      if (remainingGames.length > 0) {
        handleGameSelect(remainingGames[0].id);
      }
    }
  };

  if (loading) {
    return <div className="text-center p-4">Завантаження ігор...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Мої Ігри</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Нова гра
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Створити нову гру</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="gameName">Назва гри</Label>
                <Input
                  id="gameName"
                  value={newGame.name}
                  onChange={(e) => setNewGame(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Введіть назву гри"
                />
              </div>
              <div>
                <Label htmlFor="gameDescription">Опис</Label>
                <Textarea
                  id="gameDescription"
                  value={newGame.description}
                  onChange={(e) => setNewGame(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Опишіть вашу гру"
                />
              </div>
              <div>
                <Label htmlFor="gameTheme">Тема оформлення</Label>
                <Select 
                  value={newGame.theme} 
                  onValueChange={(value) => setNewGame(prev => ({ ...prev, theme: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map(theme => (
                      <SelectItem key={theme.id} value={theme.id}>
                        {theme.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="gamePlayers">Гравці (через кому)</Label>
                <Input
                  id="gamePlayers"
                  value={newGame.players}
                  onChange={(e) => setNewGame(prev => ({ ...prev, players: e.target.value }))}
                  placeholder="Іван, Марія, Олексій"
                />
              </div>
              <Button onClick={handleCreateGame} className="w-full">
                Створити гру
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {games.map((game) => (
          <Card 
            key={game.id}
            className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
              currentGame === game.id ? 'ring-2 ring-primary' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1" onClick={() => handleGameSelect(game.id)}>
                  <h4 className="font-semibold text-sm mb-1">{game.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {game.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {game.players.length}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(game.last_played).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Palette className="w-3 h-3" />
                      {themes.find(t => t.id === game.theme)?.name}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleGameSelect(game.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Play className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGame(game.id);
                    }}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GameManager;
