
import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';

interface LoginFormProps {
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ loading }) => {
  const { signIn } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });

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

  return (
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
  );
};

export default LoginForm;
