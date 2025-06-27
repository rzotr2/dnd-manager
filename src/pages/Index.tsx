
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sword, Dices, Users, Palette, Shield, Scroll } from 'lucide-react';
import ThemeSelector from '@/components/ThemeSelector';
import DiceRoller from '@/components/DiceRoller';
import CharacterSheet from '@/components/CharacterSheet';

const Index = () => {
  const [currentTheme, setCurrentTheme] = useState('theme-fantasy');

  useEffect(() => {
    document.body.className = currentTheme;
  }, [currentTheme]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <Card className="glass-effect border-2 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3 text-3xl md:text-4xl font-bold">
              <Shield className="w-10 h-10 text-primary" />
              <span className="theme-gradient bg-clip-text text-transparent">
                DnD Character Manager
              </span>
              <Scroll className="w-10 h-10 text-primary" />
            </CardTitle>
            <p className="text-muted-foreground text-lg">
              Створюйте персонажів, кидайте кубики та керуйте своїми пригодами в світі D&D
            </p>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="characters" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-card/80 backdrop-blur">
            <TabsTrigger value="characters" className="flex items-center gap-2 py-3">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Персонажі</span>
            </TabsTrigger>
            <TabsTrigger value="dice" className="flex items-center gap-2 py-3">
              <Dices className="w-4 h-4" />
              <span className="hidden sm:inline">Кубики</span>
            </TabsTrigger>
            <TabsTrigger value="combat" className="flex items-center gap-2 py-3">
              <Sword className="w-4 h-4" />
              <span className="hidden sm:inline">Бій</span>
            </TabsTrigger>
            <TabsTrigger value="themes" className="flex items-center gap-2 py-3">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Теми</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="characters" className="animate-fade-in">
            <CharacterSheet />
          </TabsContent>

          <TabsContent value="dice" className="animate-fade-in">
            <DiceRoller />
          </TabsContent>

          <TabsContent value="combat" className="animate-fade-in">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sword className="w-6 h-6 text-primary" />
                  Система бою
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-12">
                <p className="text-xl text-muted-foreground mb-4">
                  Система бою в розробці
                </p>
                <p className="text-muted-foreground">
                  Тут буде ініціатива, трекер HP та інші бойові механіки
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="themes" className="animate-fade-in">
            <ThemeSelector 
              currentTheme={currentTheme}
              onThemeChange={setCurrentTheme}
            />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card className="glass-effect">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              🎲 Для повної функціональності (реєстрація, база даних, чат) підключіть Supabase інтеграцію
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
