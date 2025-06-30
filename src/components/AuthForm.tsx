
import React, { useState } from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';
import VerificationForm from './auth/VerificationForm';
import LanguageSelector from './auth/LanguageSelector';

const AuthForm: React.FC = () => {
  const { user, signOut, loading } = useAuth();
  const { t } = useLanguage();
  
  const [verificationStep, setVerificationStep] = useState<'register' | 'verify'>('register');
  const [pendingEmail, setPendingEmail] = useState('');
  const [registerData, setRegisterData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '', 
    username: '', 
    fullName: '' 
  });

  const handleCodeSent = (email: string) => {
    setPendingEmail(email);
    setVerificationStep('verify');
  };

  const handleVerificationSuccess = () => {
    setVerificationStep('register');
    setPendingEmail('');
    setRegisterData({ 
      email: '', 
      password: '', 
      confirmPassword: '', 
      username: '', 
      fullName: '' 
    });
  };

  const handleBackToRegister = () => {
    setVerificationStep('register');
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
            <LanguageSelector />
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
          <LanguageSelector />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-9">
            <TabsTrigger value="login" className="text-sm">{t('auth.login')}</TabsTrigger>
            <TabsTrigger value="register" className="text-sm">{t('auth.register')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-4">
            <LoginForm loading={loading} />
          </TabsContent>
          
          <TabsContent value="register" className="mt-4">
            {verificationStep === 'register' ? (
              <RegisterForm 
                loading={loading} 
                onCodeSent={handleCodeSent}
              />
            ) : (
              <VerificationForm
                loading={loading}
                pendingEmail={pendingEmail}
                registerData={registerData}
                onBack={handleBackToRegister}
                onSuccess={handleVerificationSuccess}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
