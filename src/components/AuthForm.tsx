
import React, { useState } from 'react';
import { User, Lock, UserPlus, LogIn, Mail, Globe, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AuthForm: React.FC = () => {
  const { user, signIn, signOut, loading } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '', 
    username: '', 
    fullName: '' 
  });
  const [verificationStep, setVerificationStep] = useState<'register' | 'verify'>('register');
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast({
        title: t('error.title'),
        description: t('error.fillAllFields'),
        variant: 'destructive',
      });
      return;
    }
    await signIn(loginData.email, loginData.password);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.email || !registerData.password || !registerData.username || !registerData.fullName) {
      toast({
        title: t('error.title'),
        description: t('error.fillAllFields'),
        variant: 'destructive',
      });
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: t('error.title'),
        description: t('error.passwordMismatch'),
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/send-verification-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`,
        },
        body: JSON.stringify({
          email: registerData.email,
        }),
      });

      if (!response.ok) throw new Error('Failed to send code');

      setPendingEmail(registerData.email);
      setVerificationStep('verify');
      toast({
        title: t('success.title'),
        description: t('success.codeSent'),
      });
    } catch (error) {
      toast({
        title: t('error.title'),
        description: t('error.codeSendFailed'),
        variant: 'destructive',
      });
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: t('error.title'),
        description: t('error.invalidCode'),
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`,
        },
        body: JSON.stringify({
          email: pendingEmail,
          code: verificationCode,
          password: registerData.password,
          username: registerData.username,
          fullName: registerData.fullName,
        }),
      });

      if (!response.ok) throw new Error('Verification failed');

      toast({
        title: t('success.title'),
        description: t('success.registerSuccess'),
      });

      // Reset form
      setVerificationStep('register');
      setVerificationCode('');
      setPendingEmail('');
      setRegisterData({ 
        email: '', 
        password: '', 
        confirmPassword: '', 
        username: '', 
        fullName: '' 
      });
    } catch (error) {
      toast({
        title: t('error.title'),
        description: t('error.codeVerifyFailed'),
        variant: 'destructive',
      });
    }
  };

  if (user) {
    return (
      <Card className="glass-effect border border-border/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-primary" />
              {t('auth.welcome')}, {user.user_metadata?.username || user.email}!
            </CardTitle>
            <Select value={language} onValueChange={(value: 'uk' | 'en') => setLanguage(value)}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uk">🇺🇦</SelectItem>
                <SelectItem value="en">🇺🇸</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Button 
            onClick={signOut} 
            variant="outline" 
            className="w-full h-9" 
            disabled={loading}
          >
            {t('auth.logout')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border border-border/20 w-full max-w-md mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-center flex-1">
            <div className="flex items-center justify-center gap-2 mb-2">
              <User className="w-6 h-6 text-primary" />
              {t('app.title')}
            </div>
          </CardTitle>
          <Select value={language} onValueChange={(value: 'uk' | 'en') => setLanguage(value)}>
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="uk">🇺🇦</SelectItem>
              <SelectItem value="en">🇺🇸</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-9">
            <TabsTrigger value="login" className="text-sm">{t('auth.login')}</TabsTrigger>
            <TabsTrigger value="register" className="text-sm">{t('auth.register')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-sm">{t('auth.email')}</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder={t('auth.emailPlaceholder')}
                  required
                  disabled={loading}
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-sm">{t('auth.password')}</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder={t('auth.passwordPlaceholder')}
                  required
                  disabled={loading}
                  className="h-9"
                />
              </div>
              <Button type="submit" className="w-full h-9" disabled={loading}>
                <LogIn className="w-4 h-4 mr-2" />
                {t('auth.loginButton')}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register" className="mt-4">
            {verificationStep === 'register' ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-sm">{t('auth.email')}</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder={t('auth.emailPlaceholder')}
                    required
                    disabled={loading}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-username" className="text-sm">{t('auth.username')}</Label>
                  <Input
                    id="reg-username"
                    type="text"
                    value={registerData.username}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder={t('auth.usernamePlaceholder')}
                    required
                    disabled={loading}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-fullname" className="text-sm">{t('auth.fullName')}</Label>
                  <Input
                    id="reg-fullname"
                    type="text"
                    value={registerData.fullName}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder={t('auth.fullNamePlaceholder')}
                    required
                    disabled={loading}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="text-sm">{t('auth.password')}</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder={t('auth.passwordPlaceholder')}
                    required
                    disabled={loading}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-confirm" className="text-sm">{t('auth.confirmPassword')}</Label>
                  <Input
                    id="reg-confirm"
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder={t('auth.confirmPassword')}
                    required
                    disabled={loading}
                    className="h-9"
                  />
                </div>
                <Button type="submit" className="w-full h-9" disabled={loading}>
                  <Mail className="w-4 h-4 mr-2" />
                  {t('auth.sendCode')}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                  <h3 className="text-lg font-medium">{t('auth.codeStep')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('auth.enterCode')} <strong>{pendingEmail}</strong>
                  </p>
                </div>
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verification-code" className="text-sm">{t('auth.verificationCode')}</Label>
                    <Input
                      id="verification-code"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder={t('auth.codePlaceholder')}
                      required
                      disabled={loading}
                      className="h-9 text-center text-lg tracking-widest"
                      maxLength={6}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setVerificationStep('register')}
                      className="flex-1 h-9"
                    >
                      {t('common.back')}
                    </Button>
                    <Button type="submit" className="flex-1 h-9" disabled={loading || verificationCode.length !== 6}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      {t('auth.verifyAndRegister')}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
