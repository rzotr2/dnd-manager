
import React, { useState } from 'react';
import { Dices, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DiceType {
  sides: number;
  name: string;
}

const diceTypes: DiceType[] = [
  { sides: 4, name: 'D4' },
  { sides: 6, name: 'D6' },
  { sides: 8, name: 'D8' },
  { sides: 10, name: 'D10' },
  { sides: 12, name: 'D12' },
  { sides: 20, name: 'D20' },
  { sides: 100, name: 'D100' }
];

interface RollResult {
  dice: string;
  rolls: number[];
  modifier: number;
  total: number;
  timestamp: Date;
}

const DiceRoller: React.FC = () => {
  const [selectedDice, setSelectedDice] = useState<DiceType>(diceTypes[5]); // D20 default
  const [diceCount, setDiceCount] = useState(1);
  const [modifier, setModifier] = useState(0);
  const [rollHistory, setRollHistory] = useState<RollResult[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = () => {
    setIsRolling(true);
    
    const rolls: number[] = [];
    for (let i = 0; i < diceCount; i++) {
      rolls.push(Math.floor(Math.random() * selectedDice.sides) + 1);
    }
    
    const rollSum = rolls.reduce((sum, roll) => sum + roll, 0);
    const total = rollSum + modifier;
    
    const result: RollResult = {
      dice: `${diceCount}${selectedDice.name}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ''}`,
      rolls,
      modifier,
      total,
      timestamp: new Date()
    };
    
    setTimeout(() => {
      setRollHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 rolls
      setIsRolling(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dices className="w-6 h-6 text-primary" />
            Генератор кубиків
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dice Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Тип кубика</Label>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
              {diceTypes.map((dice) => (
                <Button
                  key={dice.sides}
                  variant={selectedDice.sides === dice.sides ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDice(dice)}
                  className="aspect-square"
                >
                  {dice.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Dice Count and Modifier */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="diceCount" className="text-sm font-medium">Кількість кубиків</Label>
              <div className="flex items-center gap-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDiceCount(Math.max(1, diceCount - 1))}
                  disabled={diceCount <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  id="diceCount"
                  type="number"
                  value={diceCount}
                  onChange={(e) => setDiceCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="text-center"
                  min="1"
                  max="10"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDiceCount(Math.min(10, diceCount + 1))}
                  disabled={diceCount >= 10}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="modifier" className="text-sm font-medium">Модифікатор</Label>
              <Input
                id="modifier"
                type="number"
                value={modifier}
                onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
                className="mt-1"
                placeholder="0"
              />
            </div>
          </div>

          {/* Roll Button */}
          <Button
            onClick={rollDice}
            disabled={isRolling}
            className={`w-full py-4 text-lg font-bold transition-all duration-300 ${
              isRolling ? 'animate-dice-roll dice-glow' : 'hover:scale-105'
            }`}
            size="lg"
          >
            <Dices className={`w-6 h-6 mr-2 ${isRolling ? 'animate-spin' : ''}`} />
            {isRolling ? 'Кидаю...' : `Кинути ${diceCount}${selectedDice.name}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ''}`}
          </Button>
        </CardContent>
      </Card>

      {/* Roll History */}
      {rollHistory.length > 0 && (
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-lg">Історія кидків</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rollHistory.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border transition-all duration-300 ${
                    index === 0 ? 'animate-fade-in bg-primary/10 border-primary' : 'bg-muted/50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-muted-foreground">
                        {result.dice}
                      </span>
                      <span className="text-sm">
                        [{result.rolls.join(', ')}]
                        {result.modifier !== 0 && (
                          <span className="text-muted-foreground">
                            {result.modifier > 0 ? ' + ' : ' - '}
                            {Math.abs(result.modifier)}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="text-xl font-bold text-primary">
                      {result.total}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DiceRoller;
