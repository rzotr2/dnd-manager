
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import AuthForm from '@/components/AuthForm';
import GameManager from '@/components/GameManager';
import CharacterSheet from '@/components/CharacterSheet';
import NotificationBell from '@/components/NotificationBell';

const themes = {
  'theme-fantasy': {
    background: 'bg-fantasy-light dark:bg-fantasy-dark',
    text: 'text-gray-800 dark:text-gray-100',
  },
  'theme-cyberpunk': {
    background: 'bg-cyberpunk-light dark:bg-cyberpunk-dark',
    text: 'text-gray-800 dark:text-gray-100',
  },
  'theme-stalker': {
    background: 'bg-stalker-light dark:bg-stalker-dark',
    text: 'text-gray-800 dark:text-gray-100',
  },
  'theme-scifi': {
    background: 'bg-scifi-light dark:bg-scifi-dark',
    text: 'text-gray-800 dark:text-gray-100',
  },
};

const Index = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<string>('theme-fantasy');

  const handleGameChange = (gameId: string | null) => {
    setCurrentGame(gameId);
  };

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
  };

  return (
    <div className={`min-h-screen ${themes[currentTheme].background} ${themes[currentTheme].text} transition-colors duration-300`}>
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">GM Helper</h1>
          <div className="flex items-center gap-4">
            {user && <NotificationBell />}
            {user && <AuthForm />}
            {!user && <AuthForm />}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Panel: Game Management */}
          <div className="md:col-span-1">
            <GameManager
              currentGame={currentGame}
              onGameChange={handleGameChange}
              onThemeChange={handleThemeChange}
            />
          </div>

          {/* Right Panel: Character Sheet */}
          <div className="md:col-span-3">
            {currentGame ? (
              <CharacterSheet gameId={currentGame} theme={currentTheme} />
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">{t('games.noGameSelected')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
