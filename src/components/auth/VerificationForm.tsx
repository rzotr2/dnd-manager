
import React, { useState } from 'react';
import { UserPlus, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VerificationFormProps {
  loading: boolean;
  pendingEmail: string;
  registerData: {
    password: string;
    username: string;
    fullName: string;
  };
  onBack: () => void;
  onSuccess: () => void;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ 
  loading, 
  pendingEmail, 
  registerData, 
  onBack, 
  onSuccess 
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [verificationCode, setVerificationCode] = useState('');

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
      const { data, error } = await supabase.functions.invoke('verify-code', {
        body: {
          email: pendingEmail,
          code: verificationCode,
          password: registerData.password,
          username: registerData.username,
          fullName: registerData.fullName,
        },
      });

      if (error) throw error;

      toast({
        title: t('success.title'),
        description: t('success.registerSuccess'),
      });

      onSuccess();
    } catch (error) {
      console.error('Error verifying code:', error);
      toast({
        title: t('error.title'),
        description: t('error.codeVerifyFailed'),
        variant: 'destructive',
      });
    }
  };

  return (
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
            onClick={onBack}
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
  );
};

export default VerificationForm;
