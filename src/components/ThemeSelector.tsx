
import React from 'react';
import { Palette, Sword, Zap, ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Theme {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  className: string;
}

const themes: Theme[] = [
  {
    id: 'fantasy',
    name: 'Фентезі',
    icon: <Sword className="w-6 h-6" />,
    description: 'Темний магічний світ з золотими акцентами',
    className: 'theme-fantasy'
  },
  {
    id: 'cyberpunk',
    name: 'Кіберпанк',
    icon: <Zap className="w-6 h-6" />,
    description: 'Неонові кольори футуристичного світу',
    className: 'theme-cyberpunk'
  },
  {
    id: 'classic',
    name: 'Класичний',
    icon: <ScrollText className="w-6 h-6" />,
    description: 'Традиційний D&D стиль з пергаментом',
    className: 'theme-classic'
  }
];

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Palette className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Оберіть тему оформлення</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <Card 
            key={theme.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              currentTheme === theme.className ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onThemeChange(theme.className)}
          >
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4 text-primary">
                {theme.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{theme.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{theme.description}</p>
              <Button 
                variant={currentTheme === theme.className ? "default" : "outline"}
                size="sm"
                className="w-full"
              >
                {currentTheme === theme.className ? 'Активна' : 'Обрати'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
