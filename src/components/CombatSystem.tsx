
import React, { useState } from 'react';
import { Sword, Shield, Heart, Dices, Info, Plus, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CombatParticipant {
  id: string;
  name: string;
  initiative: number;
  hp: number;
  maxHp: number;
  ac: number;
  isPlayer: boolean;
}

const CombatSystem: React.FC = () => {
  const [participants, setParticipants] = useState<CombatParticipant[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [round, setRound] = useState(1);
  const [combatStarted, setCombatStarted] = useState(false);
  const [newParticipant, setNewParticipant] = useState({
    name: '',
    initiative: '',
    hp: '',
    ac: '',
    isPlayer: true
  });

  const addParticipant = () => {
    if (!newParticipant.name || !newParticipant.hp) return;

    const participant: CombatParticipant = {
      id: Date.now().toString(),
      name: newParticipant.name,
      initiative: parseInt(newParticipant.initiative) || 0,
      hp: parseInt(newParticipant.hp),
      maxHp: parseInt(newParticipant.hp),
      ac: parseInt(newParticipant.ac) || 10,
      isPlayer: newParticipant.isPlayer
    };

    setParticipants(prev => [...prev, participant]);
    setNewParticipant({ name: '', initiative: '', hp: '', ac: '', isPlayer: true });
  };

  const removeParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const startCombat = () => {
    const sortedParticipants = [...participants].sort((a, b) => b.initiative - a.initiative);
    setParticipants(sortedParticipants);
    setCombatStarted(true);
    setCurrentTurn(0);
    setRound(1);
  };

  const nextTurn = () => {
    if (currentTurn < participants.length - 1) {
      setCurrentTurn(currentTurn + 1);
    } else {
      setCurrentTurn(0);
      setRound(round + 1);
    }
  };

  const updateHp = (id: string, newHp: number) => {
    setParticipants(prev => prev.map(p => 
      p.id === id ? { ...p, hp: Math.max(0, Math.min(newHp, p.maxHp)) } : p
    ));
  };

  const resetCombat = () => {
    setCombatStarted(false);
    setCurrentTurn(0);
    setRound(1);
    setParticipants(prev => prev.map(p => ({ ...p, hp: p.maxHp })));
  };

  const rollInitiative = () => {
    setParticipants(prev => prev.map(p => ({
      ...p,
      initiative: Math.floor(Math.random() * 20) + 1
    })));
  };

  return (
    <div className="space-y-6">
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sword className="w-6 h-6 text-primary" />
            Система бою D&D
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="setup">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="setup">Підготовка</TabsTrigger>
              <TabsTrigger value="combat">Бій</TabsTrigger>
              <TabsTrigger value="help">Підказки</TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                <div>
                  <Label htmlFor="participantName">Ім'я</Label>
                  <Input
                    id="participantName"
                    value={newParticipant.name}
                    onChange={(e) => setNewParticipant(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ім'я учасника"
                  />
                </div>
                <div>
                  <Label htmlFor="initiative">Ініціатива</Label>
                  <Input
                    id="initiative"
                    type="number"
                    value={newParticipant.initiative}
                    onChange={(e) => setNewParticipant(prev => ({ ...prev, initiative: e.target.value }))}
                    placeholder="0-20"
                  />
                </div>
                <div>
                  <Label htmlFor="hp">HP</Label>
                  <Input
                    id="hp"
                    type="number"
                    value={newParticipant.hp}
                    onChange={(e) => setNewParticipant(prev => ({ ...prev, hp: e.target.value }))}
                    placeholder="Очки здоров'я"
                  />
                </div>
                <div>
                  <Label htmlFor="ac">AC</Label>
                  <Input
                    id="ac"
                    type="number"
                    value={newParticipant.ac}
                    onChange={(e) => setNewParticipant(prev => ({ ...prev, ac: e.target.value }))}
                    placeholder="Клас броні"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addParticipant} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Додати
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={rollInitiative} variant="outline">
                  <Dices className="w-4 h-4 mr-2" />
                  Кинути ініціативу
                </Button>
                <Button onClick={startCombat} disabled={participants.length === 0}>
                  <Sword className="w-4 h-4 mr-2" />
                  Почати бій
                </Button>
              </div>

              <div className="space-y-2">
                {participants.map((participant) => (
                  <Card key={participant.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">{participant.name}</span>
                        <span className="text-sm text-muted-foreground">
                          Ініціатива: {participant.initiative}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          HP: {participant.hp}/{participant.maxHp}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          AC: {participant.ac}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          participant.isPlayer ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {participant.isPlayer ? 'Гравець' : 'Ворог'}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeParticipant(participant.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="combat" className="space-y-4">
              {!combatStarted ? (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Додайте учасників та почніть бій на вкладці "Підготовка"
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold">Раунд {round}</h3>
                    {participants[currentTurn] && (
                      <p className="text-lg text-primary">
                        Хід: {participants[currentTurn].name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    {participants.map((participant, index) => (
                      <Card 
                        key={participant.id} 
                        className={`p-4 ${index === currentTurn ? 'ring-2 ring-primary' : ''} ${
                          participant.hp <= 0 ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-lg">{participant.name}</span>
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-red-500" />
                              <span className="text-sm">
                                {participant.hp}/{participant.maxHp}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-blue-500" />
                              <span className="text-sm">AC {participant.ac}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateHp(participant.id, participant.hp - 1)}
                            >
                              -1
                            </Button>
                            <Input
                              type="number"
                              value={participant.hp}
                              onChange={(e) => updateHp(participant.id, parseInt(e.target.value) || 0)}
                              className="w-16 text-center"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateHp(participant.id, participant.hp + 1)}
                            >
                              +1
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-center gap-2">
                    <Button onClick={nextTurn}>
                      Наступний хід
                    </Button>
                    <Button onClick={resetCombat} variant="outline">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Скинути бій
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="help" className="space-y-4">
              <div className="space-y-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Ця система бою допоможе вам організувати та відстежувати бої в D&D
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Як користуватися:</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-semibold">1. Підготовка бою:</h4>
                      <p className="text-sm text-muted-foreground">
                        Додайте всіх учасників бою (гравців та ворогів), вказавши їх ім'я, ініціативу, HP та AC.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">2. Ініціатива:</h4>
                      <p className="text-sm text-muted-foreground">
                        Кожен учасник кидає д20 + модифікатор спритності. Або скористайтеся кнопкою "Кинути ініціативу".
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">3. Порядок ходів:</h4>
                      <p className="text-sm text-muted-foreground">
                        Учасники ходять в порядку зменшення ініціативи. Поточний гравець виділений кольором.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">4. Урон та лікування:</h4>
                      <p className="text-sm text-muted-foreground">
                        Використовуйте кнопки +1/-1 або вводьте HP напряму для зміни здоров'я персонажів.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Важливі правила D&D:</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm"><strong>AC (Клас Броні):</strong> Число, яке треба перевищити для влучного удару</p>
                    <p className="text-sm"><strong>HP (Очки Здоров'я):</strong> При 0 HP персонаж падає без свідомості</p>
                    <p className="text-sm"><strong>Ініціатива:</strong> д20 + модифікатор Спритності</p>
                    <p className="text-sm"><strong>Дії в хід:</strong> Рух, Дія, Бонусна дія, Реакція</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CombatSystem;
