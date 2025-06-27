
import React, { useState } from 'react';
import { Plus, Play, Edit3, Trash2, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Game {
  id: string;
  name: string;
  description: string;
  theme: string;
  players: string[];
  createdAt: string;
  lastPlayed: string;
}

interface GameManagerProps {
  currentGame: string | null;
  onGameChange: (gameId: string) => void;
}

const GameManager: React.FC<GameManagerProps> = ({ currentGame, onGameChange }) => {
  const [games, setGames] = useState<Game[]>([
    {
      id: '1',
      name: 'Подорож у Темний Ліс',
      description: 'Класична фентезі кампанія з драконами та магією',
      theme: 'theme-fantasy',
      players: ['Іван', 'Марія', 'Олексій'],
      createdAt: '2024-01-15',
      lastPlayed: '2024-01-20'
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGame, setNewGame] = useState({
    name: '',
    description: '',
    theme: 'theme-fantasy',
    players: ''
  });

  const createGame = () => {
    if (!newGame.name.trim()) return;

    const game: Game = {
      id: Date.now().toString(),
      name: newGame.name,
      description: newGame.description,
      theme: newGame.theme,
      players: newGame.players.split(',').map(p => p.trim()).filter(p => p),
      createdAt: new Date().toISOString().split('T')[0],
      lastPlayed: new Date().toISOString().split('T')[0]
    };

    setGames(prev => [...prev, game]);
    setNewGame({ name: '', description: '', theme: 'theme-fantasy', players: '' });
    setIsCreateDialogOpen(false);
  };

  const deleteGame = (gameId: string) => {
    setGames(prev => prev.filter(g => g.id !== gameId));
    if (currentGame === gameId) {
      onGameChange(games[0]?.id || '');
    }
  };

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
                <Label htmlFor="gamePlayers">Гравці (через кому)</Label>
                <Input
                  id="gamePlayers"
                  value={newGame.players}
                  onChange={(e) => setNewGame(prev => ({ ...prev, players: e.target.value }))}
                  placeholder="Іван, Марія, Олексій"
                />
              </div>
              <Button onClick={createGame} className="w-full">
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
                <div className="flex-1" onClick={() => onGameChange(game.id)}>
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
                      {game.lastPlayed}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onGameChange(game.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Play className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteGame(game.id);
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
