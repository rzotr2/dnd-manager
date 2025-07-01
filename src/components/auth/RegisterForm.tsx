
import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';

interface RegisterFormProps {
  loading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ loading }) => {
  const { signUp } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [registerData, setRegisterData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '', 
    username: '', 
    fullName: '' 
  });

  const handleRegister = async (e: React.FormEvent) => {
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

    await signUp(registerData.email, registerData.password, {
      username: registerData.username,
      full_name: registerData.fullName
    });
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
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
        <UserPlus className="w-4 h-4 mr-2" />
        {t('auth.registerButton')}
      </Button>
    </form>
  );
};

export default RegisterForm;
