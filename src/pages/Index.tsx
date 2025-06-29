
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <Shield className="w-12 h-12 text-primary mx-auto animate-spin" />
          <p className="text-lg font-medium">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-accent/10">
        <Sidebar className="border-r border-border w-80">
          <SidebarHeader className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">DnD Manager</span>
            </div>
            <div className="space-y-4">
              <AuthForm />
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('app.language')}</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full">
                    <Globe className="w-4 h-4 mr-2" />
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
          <SidebarContent className="p-6">
            <GameManager 
              currentGame={currentGame}
              onGameChange={setCurrentGame}
              onThemeChange={setCurrentTheme}
            />
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <Card className="glass-effect border-2 border-primary/20">
              <CardHeader className="text-center py-6">
                <div className="flex items-center justify-between mb-4">
                  <SidebarTrigger />
                  <div className="flex-1" />
                </div>
                <CardTitle className="flex items-center justify-center gap-4 text-2xl md:text-3xl font-bold mb-3">
                  <Shield className="w-8 h-8 text-primary" />
                  <span className="theme-gradient bg-clip-text text-transparent">
                    {t('app.title')}
                  </span>
                  <Scroll className="w-8 h-8 text-primary" />
                </CardTitle>
                <p className="text-muted-foreground text-base max-w-2xl mx-auto">
                  {t('app.subtitle')}
                </p>
              </CardHeader>
            </Card>

            {/* Main Content */}
            <Tabs defaultValue="characters" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-2 bg-card/80 backdrop-blur gap-1">
                <TabsTrigger value="characters" className="flex items-center gap-2 py-3 px-4">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('tabs.characters')}</span>
                </TabsTrigger>
                <TabsTrigger value="dice" className="flex items-center gap-2 py-3 px-4">
                  <Dices className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('tabs.dice')}</span>
                </TabsTrigger>
                <TabsTrigger value="combat" className="flex items-center gap-2 py-3 px-4">
                  <Sword className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('tabs.combat')}</span>
                </TabsTrigger>
                <TabsTrigger value="themes" className="flex items-center gap-2 py-3 px-4">
                  <Palette className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('tabs.themes')}</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="characters" className="animate-fade-in">
                <div className="space-y-4">
                  {currentGame ? (
                    <CharacterSheet currentGameId={currentGame} />
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-medium text-muted-foreground mb-2">
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
            <Card className="glass-effect">
              <CardContent className="p-4 text-center">
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
