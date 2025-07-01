
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sword, Dices, Users, Palette, Shield, Scroll, User } from 'lucide-react';
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
  const { isAuthenticated, loading } = useAuth();
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
        <Sidebar className="border-r border-border/20 w-48">
          <SidebarHeader className="p-2 space-y-2">
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-primary" />
                <span className="font-bold text-sm">DnD Manager</span>
              </div>
              <div className="flex items-center gap-2">
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
                  className="h-6 w-6 p-0"
                >
                  <User className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <GameManager 
              currentGame={currentGame}
              onGameChange={setCurrentGame}
              onThemeChange={setCurrentTheme}
            />
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 overflow-auto min-w-0">
          <div className="max-w-5xl mx-auto p-2 space-y-2">
            {/* Header */}
            <Card className="glass-effect border border-border/20">
              <CardHeader className="text-center py-2">
                <div className="flex items-center justify-between mb-1">
                  <SidebarTrigger />
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="theme-gradient bg-clip-text text-transparent font-bold text-lg">
                      {t('app.title')}
                    </span>
                    <Scroll className="w-4 h-4 text-primary" />
                  </div>
                  <div></div>
                </div>
                <p className="text-muted-foreground text-xs max-w-lg mx-auto">
                  {t('app.subtitle')}
                </p>
              </CardHeader>
            </Card>

            {/* Main Content */}
            <Tabs defaultValue="characters" className="space-y-3">
              <div className="px-4 md:px-0">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-20 md:h-10 p-1 bg-card/60 backdrop-blur gap-1">
                  <TabsTrigger value="characters" className="flex items-center gap-1 py-6 md:py-2 px-4 md:px-3 text-sm flex-col md:flex-row">
                    <Users className="w-4 h-4" />
                    <span className="text-xs md:text-sm">{t('tabs.characters')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="dice" className="flex items-center gap-1 py-6 md:py-2 px-4 md:px-3 text-sm flex-col md:flex-row">
                    <Dices className="w-4 h-4" />
                    <span className="text-xs md:text-sm">{t('tabs.dice')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="combat" className="flex items-center gap-1 py-6 md:py-2 px-4 md:px-3 text-sm flex-col md:flex-row">
                    <Sword className="w-4 h-4" />
                    <span className="text-xs md:text-sm">{t('tabs.combat')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="themes" className="flex items-center gap-1 py-6 md:py-2 px-4 md:px-3 text-sm flex-col md:flex-row">
                    <Palette className="w-4 h-4" />
                    <span className="text-xs md:text-sm">{t('tabs.themes')}</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="characters" className="animate-fade-in">
                <div className="space-y-2">
                  {currentGame ? (
                    <CharacterSheet currentGameId={currentGame} />
                  ) : (
                    <Card className="border border-border/20">
                      <CardContent className="p-3 text-center">
                        <Users className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {t('characters.noGameSelected')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t('characters.selectGame')}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="dice" className="animate-fade-in">
                <div className="space-y-2">
                  <DiceRoller />
                </div>
              </TabsContent>

              <TabsContent value="combat" className="animate-fade-in">
                <div className="space-y-2">
                  <CombatSystem />
                </div>
              </TabsContent>

              <TabsContent value="themes" className="animate-fade-in">
                <div className="space-y-2">
                  <ThemeSelector 
                    currentTheme={currentTheme}
                    onThemeChange={setCurrentTheme}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Footer */}
            <Card className="glass-effect border border-border/20">
              <CardContent className="p-2 text-center">
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
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
