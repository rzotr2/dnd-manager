
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import AuthForm from '@/components/AuthForm';
import GameManager from '@/components/GameManager';
import CharacterSheet from '@/components/CharacterSheet';
import NotificationBell from '@/components/NotificationBell';
import LanguageSelector from '@/components/auth/LanguageSelector';

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
    document.documentElement.className = theme;
  };

  // Apply theme to document
  React.useEffect(() => {
    document.documentElement.className = currentTheme;
  }, [currentTheme]);

  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-300`}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">GM Helper</h1>
            <LanguageSelector />
          </div>
          
          <div className="flex items-center gap-4">
            {user && <NotificationBell />}
            <AuthForm />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {/* Left Sidebar - Game Management */}
        <aside className="w-80 border-r bg-muted/10 p-6">
          <GameManager
            currentGame={currentGame}
            onGameChange={handleGameChange}
            onThemeChange={handleThemeChange}
          />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {currentGame ? (
            <CharacterSheet gameId={currentGame} theme={currentTheme} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mb-4 text-4xl">🎲</div>
                <h2 className="mb-2 text-2xl font-bold">{t('games.selectGame')}</h2>
                <p className="text-muted-foreground">{t('games.noGameSelected')}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
