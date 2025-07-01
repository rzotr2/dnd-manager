
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Lock, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

interface AccountManagementProps {
  onBack: () => void;
}

const AccountManagement: React.FC<AccountManagementProps> = ({ onBack }) => {
  const { updatePassword, deleteAccount, loading } = useAuth();
  const { t } = useLanguage();
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      return;
    }

    const { error } = await updatePassword(passwordForm.oldPassword, passwordForm.newPassword);
    
    if (!error) {
      setPasswordForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    }
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    onBack();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <CardTitle className="text-lg">{t('account.title')}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Change Password Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">{t('account.changePassword')}</h3>
          </div>
          
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">{t('account.oldPassword')}</Label>
              <Input
                id="oldPassword"
                type="password"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, oldPassword: e.target.value }))}
                placeholder={t('auth.passwordPlaceholder')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t('account.newPassword')}</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder={t('auth.passwordPlaceholder')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">{t('account.confirmNewPassword')}</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={passwordForm.confirmNewPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmNewPassword: e.target.value }))}
                placeholder={t('auth.passwordPlaceholder')}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading || !passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword || passwordForm.newPassword !== passwordForm.confirmNewPassword}
            >
              {t('account.updatePassword')}
            </Button>
          </form>
        </div>

        {/* Delete Account Section */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-destructive" />
            <h3 className="font-semibold text-destructive">{t('account.deleteAccount')}</h3>
          </div>
          
          {!showDeleteConfirm ? (
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full"
            >
              {t('account.deleteAccount')}
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {t('account.confirmDelete')}
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="flex-1"
                >
                  {t('account.deleteConfirm')}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1"
                >
                  {t('account.back')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountManagement;
