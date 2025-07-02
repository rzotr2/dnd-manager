
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sword, Dices, Users, Palette, Shield, Scroll, User, LogOut } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import ThemeSelector from '@/components/ThemeSelector';
import DiceRoller from '@/components/DiceRoller';
import CharacterSheet from '@/components/CharacterSheet';
import GameManager from '@/components/GameManager';
import CombatSystem from '@/components/CombatSystem';
import AuthForm from '@/components/AuthForm';
import AccountManagement from '@/components/AccountManagement';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const [currentTheme, setCurrentTheme] = useState('theme-fantasy');
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [showAccountManagement, setShowAccountManagement] = useState(false);
  const { isAuthenticated, loading, signOut, user } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    document.body.className = currentTheme;
  }, [currentTheme]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <Shield className="w-8 h-8 text-primary mx-auto animate-spin" />
          <p className="text-sm font-medium">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <AuthForm />
        </div>
      </div>
    );
  }

  if (showAccountManagement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AccountManagement onBack={() => setShowAccountManagement(false)} />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-accent/5">
        <Sidebar className="border-r border-border/20 w-80 data-[state=collapsed]:w-16 transition-all duration-300 ease-in-out">
          <SidebarHeader className="p-4 space-y-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="font-bold text-base truncate">DnD Manager</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value as 'uk' | 'en')}
                  className="text-xs bg-transparent border border-border/50 rounded px-2 py-1"
                >
                  <option value="uk">🇺🇦</option>
                  <option value="en">🇺🇸</option>
                </select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAccountManagement(true)}
                  className="h-7 w-7 p-0"
                >
                  <User className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="h-7 w-7 p-0"
                  title={t('auth.logout')}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {user && (
              <div className="text-xs text-muted-foreground mb-2 truncate">
                {t('auth.welcome')}, {user.user_metadata?.username || user.email}!
              </div>
            )}
          </SidebarHeader>
          <SidebarContent className="p-4">
            <GameManager 
              currentGame={currentGame}
              onGameChange={setCurrentGame}
              onThemeChange={setCurrentTheme}
            />
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 overflow-auto min-w-0">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <Card className="glass-effect border border-border/20">
              <CardHeader className="text-center py-4">
                <div className="flex items-center justify-between mb-2">
                  <SidebarTrigger className="flex-shrink-0" />
                  <div className="flex items-center gap-2 flex-1 justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="theme-gradient bg-clip-text text-transparent font-bold text-xl">
                      {t('app.title')}
                    </span>
                    <Scroll className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-shrink-0 w-10"></div>
                </div>
                <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
                  {t('app.subtitle')}
                </p>
              </CardHeader>
            </Card>

            {/* Main Content */}
            <Tabs defaultValue="characters" className="space-y-6">
              <div className="px-4 md:px-0">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 h-auto p-2 bg-card/60 backdrop-blur">
                  <TabsTrigger value="characters" className="flex items-center gap-2 py-3 px-4 text-sm flex-col md:flex-row min-h-[60px] md:min-h-[40px]">
                    <Users className="w-4 h-4" />
                    <span className="text-xs md:text-sm">{t('tabs.characters')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="dice" className="flex items-center gap-2 py-3 px-4 text-sm flex-col md:flex-row min-h-[60px] md:min-h-[40px]">
                    <Dices className="w-4 h-4" />
                    <span className="text-xs md:text-sm">{t('tabs.dice')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="combat" className="flex items-center gap-2 py-3 px-4 text-sm flex-col md:flex-row min-h-[60px] md:min-h-[40px]">
                    <Sword className="w-4 h-4" />
                    <span className="text-xs md:text-sm">{t('tabs.combat')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="themes" className="flex items-center gap-2 py-3 px-4 text-sm flex-col md:flex-row min-h-[60px] md:min-h-[40px]">
                    <Palette className="w-4 h-4" />
                    <span className="text-xs md:text-sm">{t('tabs.themes')}</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="characters" className="animate-fade-in">
                <div className="space-y-4">
                  {currentGame ? (
                    <CharacterSheet currentGameId={currentGame} />
                  ) : (
                    <Card className="border border-border/20">
                      <CardContent className="p-6 text-center">
                        <Users className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                        <p className="text-base font-medium text-muted-foreground mb-2">
                          {t('characters.noGameSelected')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t('characters.selectGame')}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="dice" className="animate-fade-in">
                <div className="space-y-4">
                  <DiceRoller />
                </div>
              </TabsContent>

              <TabsContent value="combat" className="animate-fade-in">
                <div className="space-y-4">
                  <CombatSystem />
                </div>
              </TabsContent>

              <TabsContent value="themes" className="animate-fade-in">
                <div className="space-y-4">
                  <ThemeSelector 
                    currentTheme={currentTheme}
                    onThemeChange={setCurrentTheme}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Footer */}
            <Card className="glass-effect border border-border/20">
              <CardContent className="p-3 text-center">
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1">
                    🎲 {t('app.currentGame')}: {currentGame ? t('app.active') : t('app.notSelected')}
                  </span>
                  <span className="flex items-center gap-1">
                    🎨 {t('app.theme')}: {currentTheme}
                  </span>
                  <span className="flex items-center gap-1">
                    🌐 {t('app.language')}: {language === 'uk' ? 'Українська' : 'English'}
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
