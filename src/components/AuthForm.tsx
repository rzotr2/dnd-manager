
import React from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';
import LanguageSelector from './auth/LanguageSelector';

const AuthForm: React.FC = () => {
  const { user, signOut, loading } = useAuth();
  const { t } = useLanguage();

  if (user) {
    return (
      <Card className="glass-effect border border-border/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-4 h-4 text-primary" />
              {t('auth.welcome')}, {user.user_metadata?.username || user.email}!
            </CardTitle>
            <LanguageSelector />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Button 
            onClick={signOut} 
            variant="outline" 
            className="w-full h-8 text-sm" 
            disabled={loading}
          >
            {t('auth.logout')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border border-border/20 w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-center flex-1">
            <div className="flex items-center justify-center gap-2 mb-1">
              <User className="w-5 h-5 text-primary" />
              <span className="text-base">{t('app.title')}</span>
            </div>
          </CardTitle>
          <LanguageSelector />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-8 p-1 bg-card/60 backdrop-blur">
            <TabsTrigger value="login" className="text-xs">{t('auth.login')}</TabsTrigger>
            <TabsTrigger value="register" className="text-xs">{t('auth.register')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-3">
            <LoginForm loading={loading} />
          </TabsContent>
          
          <TabsContent value="register" className="mt-3">
            <RegisterForm loading={loading} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
