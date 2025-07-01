
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sword, Dices, Users, Palette, Shield, Scroll, Globe } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import ThemeSelector from '@/components/ThemeSelector';
import DiceRoller from '@/components/DiceRoller';
import CharacterSheet from '@/components/CharacterSheet';
import GameManager from '@/components/GameManager';
import CombatSystem from '@/components/CombatSystem';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const [currentTheme, setCurrentTheme] = useState('theme-fantasy');
  const [currentGame, setCurrentGame] = useState<string | null>(null);
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-accent/5">
        <Sidebar className="border-r border-border/20 w-48">
          <SidebarHeader className="p-2 space-y-2">
            <div className="flex items-center gap-1 mb-1">
              <Shield className="w-3 h-3 text-primary" />
              <span className="font-bold text-sm">DnD Manager</span>
            </div>
            <div className="space-y-2">
              <AuthForm />
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">{t('app.language')}</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full h-7 text-xs">
                    <Globe className="w-3 h-3 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uk">🇺🇦 Українська</SelectItem>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                  </SelectContent>
                </Select>
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
                  <div className="flex-1" />
                </div>
                <CardTitle className="flex items-center justify-center gap-2 text-lg font-bold mb-1">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="theme-gradient bg-clip-text text-transparent">
                    {t('app.title')}
                  </span>
                  <Scroll className="w-4 h-4 text-primary" />
                </CardTitle>
                <p className="text-muted-foreground text-xs max-w-lg mx-auto">
                  {t('app.subtitle')}
                </p>
              </CardHeader>
            </Card>

            {/* Main Content */}
            <Tabs defaultValue="characters" className="space-y-2">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-8 p-1 bg-card/60 backdrop-blur gap-1">
                <TabsTrigger value="characters" className="flex items-center gap-1 py-1 px-2 text-xs">
                  <Users className="w-3 h-3" />
                  <span className="hidden sm:inline">{t('tabs.characters')}</span>
                </TabsTrigger>
                <TabsTrigger value="dice" className="flex items-center gap-1 py-1 px-2 text-xs">
                  <Dices className="w-3 h-3" />
                  <span className="hidden sm:inline">{t('tabs.dice')}</span>
                </TabsTrigger>
                <TabsTrigger value="combat" className="flex items-center gap-1 py-1 px-2 text-xs">
                  <Sword className="w-3 h-3" />
                  <span className="hidden sm:inline">{t('tabs.combat')}</span>
                </TabsTrigger>
                <TabsTrigger value="themes" className="flex items-center gap-1 py-1 px-2 text-xs">
                  <Palette className="w-3 h-3" />
                  <span className="hidden sm:inline">{t('tabs.themes')}</span>
                </TabsTrigger>
              </TabsList>

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
