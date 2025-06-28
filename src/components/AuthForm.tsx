
import React, { useState } from 'react';
import { User, Lock, UserPlus, LogIn, Mail, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

const AuthForm: React.FC = () => {
  const { user, signIn, signUp, signOut, loading } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '', 
    username: '', 
    fullName: '' 
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      return;
    }
    await signIn(loginData.email, loginData.password);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.email || !registerData.password || !registerData.username || !registerData.fullName) {
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      return;
    }
    
    await signUp(registerData.email, registerData.password, registerData.username, registerData.fullName);
  };

  if (user) {
    return (
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              {t('auth.welcome')}, {user.user_metadata?.username || user.email}!
            </CardTitle>
            <Select value={language} onValueChange={(value: 'uk' | 'en') => setLanguage(value)}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uk">🇺🇦 UK</SelectItem>
                <SelectItem value="en">🇺🇸 EN</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Button onClick={signOut} variant="outline" className="w-full" disabled={loading}>
            {t('auth.logout')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-center flex-1">
            <div className="flex items-center justify-center gap-2 mb-2">
              <User className="w-6 h-6 text-primary" />
              {t('app.title')}
            </div>
          </CardTitle>
          <Select value={language} onValueChange={(value: 'uk' | 'en') => setLanguage(value)}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="uk">🇺🇦 UK</SelectItem>
              <SelectItem value="en">🇺🇸 EN</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
            <TabsTrigger value="register">{t('auth.register')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email">{t('auth.email')}</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder={t('auth.email')}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="login-password">{t('auth.password')}</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder={t('auth.password')}
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                <LogIn className="w-4 h-4 mr-2" />
                {t('auth.loginButton')}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="reg-email">{t('auth.email')}</Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder={t('auth.email')}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="reg-username">{t('auth.username')}</Label>
                <Input
                  id="reg-username"
                  type="text"
                  value={registerData.username}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder={t('auth.username')}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="reg-fullname">{t('auth.fullName')}</Label>
                <Input
                  id="reg-fullname"
                  type="text"
                  value={registerData.fullName}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder={t('auth.fullName')}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="reg-password">{t('auth.password')}</Label>
                <Input
                  id="reg-password"
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder={t('auth.password')}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="reg-confirm">{t('auth.confirmPassword')}</Label>
                <Input
                  id="reg-confirm"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder={t('auth.confirmPassword')}
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                <UserPlus className="w-4 h-4 mr-2" />
                {t('auth.registerButton')}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
