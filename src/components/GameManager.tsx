
import React, { useState, useEffect } from 'react';
import { Plus, Users, Settings, Calendar, Trash2, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useGames } from '@/hooks/useGames';
import { useLanguage } from '@/contexts/LanguageContext';
import GameInvitations from './GameInvitations';

const THEMES = [
  { id: 'theme-fantasy', name: 'Фентезі', description: 'Класичне фентезі з магією та драконами' },
  { id: 'theme-cyberpunk', name: 'Кіберпанк', description: 'Високі технології та низький рівень життя' },
  { id: 'theme-stalker', name: 'Сталкер', description: 'Пост-апокаліпсис в Зоні відчуження' },
  { id: 'theme-scifi', name: 'Наукова фантастика', description: 'Космос, роботи та майбутнє' }
];

const GAME_MODES = [
  { id: 'simple', name: 'Спрощений', description: 'Для швидких ігор' },
  { id: 'standard', name: 'Стандартний', description: 'Повний набір правил' }
];

interface GameManagerProps {
  currentGame: string | null;
  onGameChange: (gameId: string | null) => void;
  onThemeChange: (theme: string) => void;
}

const GameManager: React.FC<GameManagerProps> = ({ 
  currentGame, 
  onGameChange, 
  onThemeChange 
}) => {
  const { games, loading, createGame, updateGame, deleteGame } = useGames();
  const { t } = useLanguage();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [newGameData, setNewGameData] = useState({
    name: '',
    description: '',
    theme: 'theme-fantasy',
    mode: 'simple'
  });

  // Вибрати першу гру автоматично, якщо немає поточної
  useEffect(() => {
    if (games.length > 0 && !currentGame) {
      const firstGame = games[0];
      onGameChange(firstGame.id);
      onThemeChange(firstGame.theme);
    }
  }, [games, currentGame, onGameChange, onThemeChange]);

  // Оновити тему при зміні поточної гри
  useEffect(() => {
    if (currentGame) {
      const game = games.find(g => g.id === currentGame);
      if (game) {
        onThemeChange(game.theme);
      }
    }
  }, [currentGame, games, onThemeChange]);

  const handleCreateGame = async () => {
    if (!newGameData.name.trim()) return;

    const gameData = {
      name: newGameData.name,
      description: newGameData.description,
      theme: newGameData.theme,
      mode: newGameData.mode,
      players: [], // Порожній масив, оскільки імена не використовуються
    };

    const createdGame = await createGame(gameData);
    if (createdGame) {
      onGameChange(createdGame.id);
      onThemeChange(createdGame.theme);
      setIsCreateDialogOpen(false);
      setNewGameData({
        name: '',
        description: '',
        theme: 'theme-fantasy',
        mode: 'simple'
      });
    }
  };

  const handleGameSelect = (gameId: string) => {
    onGameChange(gameId);
    const game = games.find(g => g.id === gameId);
    if (game) {
      onThemeChange(game.theme);
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    await deleteGame(gameId);
    if (currentGame === gameId) {
      const remainingGames = games.filter(g => g.id !== gameId);
      if (remainingGames.length > 0) {
        onGameChange(remainingGames[0].id);
        onThemeChange(remainingGames[0].theme);
      } else {
        onGameChange(null);
        onThemeChange('theme-fantasy');
      }
    }
  };

  const currentGameData = games.find(g => g.id === currentGame);

  if (loading) {
    return <div className="p-2 text-xs text-muted-foreground">Завантаження...</div>;
  }

  return (
    <div className="space-y-3">
      {/* Поточна гра */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm">Поточна гра</h3>
        {games.length === 0 ? (
          <p className="text-xs text-muted-foreground">{t('games.noGames')}</p>
        ) : (
          <Select value={currentGame || ''} onValueChange={handleGameSelect}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Оберіть гру" />
            </SelectTrigger>
            <SelectContent>
              {games.map(game => (
                <SelectItem key={game.id} value={game.id}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{game.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {THEMES.find(t => t.id === game.theme)?.name}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Інформація про поточну гру */}
      {currentGameData && (
        <Card className="bg-muted/20">
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">{currentGameData.name}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteGame(currentGameData.id)}
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            {currentGameData.description && (
              <p className="text-xs text-muted-foreground">{currentGameData.description}</p>
            )}
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="secondary">
                {THEMES.find(t => t.id === currentGameData.theme)?.name}
              </Badge>
              <Badge variant="outline">
                {GAME_MODES.find(m => m.id === currentGameData.mode)?.name}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Кнопки керування */}
      <div className="space-y-2">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full justify-start text-xs h-8">
              <Plus className="w-3 h-3 mr-2" />
              {t('games.create')}
            </Button>
          </DialogTrigger>
          <DialogContent className="space-y-6">
            <DialogHeader>
              <DialogTitle>{t('games.create')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="gameName">{t('common.name')}</Label>
                <Input
                  id="gameName"
                  value={newGameData.name}
                  onChange={(e) => setNewGameData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Назва гри"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="gameDescription">{t('common.description')}</Label>
                <Textarea
                  id="gameDescription"
                  value={newGameData.description}
                  onChange={(e) => setNewGameData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Опис гри (необов'язково)"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-3">
                <Label>Тема</Label>
                <Select 
                  value={newGameData.theme} 
                  onValueChange={(value) => setNewGameData(prev => ({ ...prev, theme: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {THEMES.map(theme => (
                      <SelectItem key={theme.id} value={theme.id}>
                        <div>
                          <div className="font-semibold">{theme.name}</div>
                          <div className="text-xs text-muted-foreground">{theme.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Режим гри</Label>
                <Select 
                  value={newGameData.mode} 
                  onValueChange={(value) => setNewGameData(prev => ({ ...prev, mode: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GAME_MODES.map(mode => (
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

              <Button onClick={handleCreateGame} className="w-full">
                {t('common.create')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full justify-start text-xs h-8"
              disabled={!currentGame}
            >
              <Share2 className="w-3 h-3 mr-2" />
              {t('invitations.manage')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('invitations.manage')}</DialogTitle>
            </DialogHeader>
            {currentGame && <GameInvitations gameId={currentGame} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GameManager;
