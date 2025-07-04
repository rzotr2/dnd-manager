
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ListChecks, Plus, Users } from 'lucide-react';
import { useGames } from '@/hooks/useGames';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getAllThemes } from '@/utils/characterGenerator';
import InviteUserDialog from '@/components/InviteUserDialog';

interface GameManagerProps {
  currentGame: string | null;
  onGameChange: (gameId: string | null) => void;
  onThemeChange: (theme: string) => void;
}

const GameManager: React.FC<GameManagerProps> = ({ currentGame, onGameChange, onThemeChange }) => {
  const { games, loading, createGame } = useGames();
  const { t } = useLanguage();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGameName, setNewGameName] = useState('');
  const [newGameDescription, setNewGameDescription] = useState('');
  const [newGameTheme, setNewGameTheme] = useState('theme-fantasy');
  const [newGameMode, setNewGameMode] = useState<'simple' | 'advanced'>('simple');

  const allThemes = getAllThemes();

  const handleGameSelect = (gameId: string) => {
    const selectedGame = games.find(game => game.id === gameId);
    if (selectedGame) {
      onGameChange(gameId);
      onThemeChange(selectedGame.theme);
    } else {
      onGameChange(null);
    }
  };

  const handleCreateGame = async () => {
    if (!newGameName.trim()) return;

    const gameData = {
      name: newGameName,
      description: newGameDescription,
      theme: newGameTheme,
      mode: newGameMode,
      players: [],
    };

    await createGame(gameData);
    setNewGameName('');
    setNewGameDescription('');
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Game Selection */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-primary" />
            {t('games.selectGame')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={currentGame || 'default'} onValueChange={handleGameSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('games.noGameSelected')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">{t('games.noGame')}</SelectItem>
              {loading ? (
                <SelectItem value="loading" disabled>{t('common.loading')}</SelectItem>
              ) : (
                games.map((game) => (
                  <SelectItem key={game.id} value={game.id}>
                    {game.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Current Game Actions */}
      {currentGame && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              {t('games.gameMembers')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InviteUserDialog gameId={currentGame} />
          </CardContent>
        </Card>
      )}

      {/* Create Game Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            {t('games.createNew')}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('games.createNew')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="game-name">{t('games.name')}</Label>
              <Input
                id="game-name"
                placeholder={t('games.namePlaceholder')}
                value={newGameName}
                onChange={(e) => setNewGameName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="game-description">{t('games.description')}</Label>
              <Input
                id="game-description"
                placeholder={t('games.descriptionPlaceholder')}
                value={newGameDescription}
                onChange={(e) => setNewGameDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="game-theme">{t('games.theme')}</Label>
              <Select value={newGameTheme} onValueChange={setNewGameTheme}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('games.themePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {allThemes.map((theme) => (
                    <SelectItem key={theme.key} value={theme.key}>
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="game-mode">{t('games.mode')}</Label>
              <Select value={newGameMode} onValueChange={(value: 'simple' | 'advanced') => setNewGameMode(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('games.modePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">{t('modes.simple')}</SelectItem>
                  <SelectItem value="advanced">{t('modes.advanced')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreateGame}>{t('common.create')}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Games List */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-primary" />
            {t('games.yourGames')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
          ) : games.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('games.noGames')}</p>
          ) : (
            <ul className="list-none pl-0 space-y-2">
              {games.map((game) => (
                <li key={game.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <span className="text-sm font-medium">{game.name}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GameManager;
