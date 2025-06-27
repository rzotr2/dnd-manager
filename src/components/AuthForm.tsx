
import React, { useState } from 'react';
import { User, Lock, UserPlus, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AuthFormProps {
  onAuthenticated: (username: string) => void;
  isAuthenticated: boolean;
  currentUser: string | null;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthenticated, isAuthenticated, currentUser }) => {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '', confirmPassword: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.username && loginData.password) {
      // Проста симуляція логіну (в реальному додатку тут буде API)
      localStorage.setItem('dnd_user', loginData.username);
      onAuthenticated(loginData.username);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.username && registerData.password && registerData.password === registerData.confirmPassword) {
      // Проста симуляція реєстрації
      localStorage.setItem('dnd_user', registerData.username);
      onAuthenticated(registerData.username);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dnd_user');
    onAuthenticated('');
  };

  if (isAuthenticated) {
    return (
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Вітаємо, {currentUser}!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogout} variant="outline" className="w-full">
            Вийти
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <User className="w-6 h-6 text-primary" />
            DnD Character Manager
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вхід</TabsTrigger>
            <TabsTrigger value="register">Реєстрація</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-username">Ім'я користувача</Label>
                <Input
                  id="login-username"
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Введіть ім'я користувача"
                  required
                />
              </div>
              <div>
                <Label htmlFor="login-password">Пароль</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Введіть пароль"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <LogIn className="w-4 h-4 mr-2" />
                Увійти
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="reg-username">Ім'я користувача</Label>
                <Input
                  id="reg-username"
                  type="text"
                  value={registerData.username}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Введіть ім'я користувача"
                  required
                />
              </div>
              <div>
                <Label htmlFor="reg-password">Пароль</Label>
                <Input
                  id="reg-password"
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Введіть пароль"
                  required
                />
              </div>
              <div>
                <Label htmlFor="reg-confirm">Підтвердіть пароль</Label>
                <Input
                  id="reg-confirm"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Підтвердіть пароль"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <UserPlus className="w-4 h-4 mr-2" />
                Зареєструватися
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
