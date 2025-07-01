
import React, { useState } from 'react';
import { Plus, Play, Edit3, Trash2, Users, Calendar, Palette, Settings, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGames } from '@/hooks/useGames';
import { useLanguage } from '@/contexts/LanguageContext';
import GameInvitations from '@/components/GameInvitations';

const themes = [
  { id: 'theme-fantasy', key: 'themes.fantasy' },
  { id: 'theme-cyberpunk', key: 'themes.cyberpunk' },
  { id: 'theme-classic', key: 'themes.classic' },
  { id: 'theme-stalker', key: 'themes.stalker' },
  { id: 'theme-minimalist', key: 'themes.minimalist' },
  { id: 'theme-retro', key: 'themes.retro' },
  { id: 'theme-space', key: 'themes.space' },
  { id: 'theme-western', key: 'themes.western' },
  { id: 'theme-apocalypse', key: 'themes.apocalypse' }
];

interface GameManagerProps {
  currentGame: string | null;
  onGameChange: (gameId: string) => void;
  onThemeChange: (theme: string) => void;
}

const GameManager: React.FC<GameManagerProps> = ({ currentGame, onGameChange, onThemeChange }) => {
  const { games, loading, createGame, deleteGame } = useGames();
  const { t } = useLanguage();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [newGame, setNewGame] = useState({
    name: '',
    description: '',
    theme: 'theme-fantasy',
    mode: 'simple' as 'simple' | 'advanced',
    players: ''
  });

  const handleCreateGame = async () => {
    if (!newGame.name.trim()) return;

    const gameData = {
      name: newGame.name,
      description: newGame.description,
      theme: newGame.theme,
      mode: newGame.mode,
      players: newGame.players.split(',').map(p => p.trim()).filter(p => p)
    };

    const createdGame = await createGame(gameData);
    if (createdGame) {
      onGameChange(createdGame.id);
      onThemeChange(createdGame.theme);
      setNewGame({ name: '', description: '', theme: 'theme-fantasy', mode: 'simple', players: '' });
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

  const canManageInvitations = currentGame && games.length > 0;

  if (loading) {
    return (
      <div className="text-center p-6">
        <div className="space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">{t('games.loadingGames')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t('games.myGames')}</h3>
        <div className="flex gap-2">
          <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-2"
                disabled={!canManageInvitations}
              >
                <Settings className="w-4 h-4" />
                {t('games.manageInvitations')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t('games.manageInvitations')}</DialogTitle>
              </DialogHeader>
              {currentGame && <GameInvitations gameId={currentGame} />}
            </DialogContent>
          </Dialog>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                {t('games.newGame')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{t('games.createNewGame')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="gameName">{t('games.gameName')}</Label>
                  <Input
                    id="gameName"
                    value={newGame.name}
                    onChange={(e) => setNewGame(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={t('games.gameNamePlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gameDescription">{t('games.description')}</Label>
                  <Textarea
                    id="gameDescription"
                    value={newGame.description}
                    onChange={(e) => setNewGame(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={t('games.descriptionPlaceholder')}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gameMode">{t('games.mode')}</Label>
                  <Select 
                    value={newGame.mode} 
                    onValueChange={(value: 'simple' | 'advanced') => setNewGame(prev => ({ ...prev, mode: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">{t('games.modeSimple')}</SelectItem>
                      <SelectItem value="advanced">{t('games.modeAdvanced')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gameTheme">{t('games.theme')}</Label>
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
                          {t(theme.key)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateGame} className="w-full">
                  {t('games.createGame')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-3">
        {games.map((game) => (
          <Card 
            key={game.id}
            className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${
              currentGame === game.id ? 'ring-2 ring-primary shadow-md' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3" onClick={() => handleGameSelect(game.id)}>
                  <div>
                    <h4 className="font-semibold text-base mb-1">{game.name}</h4>
                    {game.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {game.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {game.players?.length || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(game.last_played).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Palette className="w-3 h-3" />
                      {t(themes.find(t => t.id === game.theme)?.key || 'themes.fantasy')}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 ml-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleGameSelect(game.id)}
                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
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
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
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
