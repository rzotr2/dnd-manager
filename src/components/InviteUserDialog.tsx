
import React, { useState } from 'react';
import { UserPlus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProfile } from '@/hooks/useProfile';
import { useLanguage } from '@/contexts/LanguageContext';

interface InviteUserDialogProps {
  gameId: string;
  trigger?: React.ReactNode;
}

const InviteUserDialog: React.FC<InviteUserDialogProps> = ({ gameId, trigger }) => {
  const { sendGameInvitation, loading } = useProfile();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [role, setRole] = useState<'viewer' | 'editor' | 'owner'>('viewer');

  const handleInvite = async () => {
    if (!userQuery.trim()) return;

    const result = await sendGameInvitation(gameId, userQuery.trim(), role);
    if (result.success) {
      setUserQuery('');
      setRole('viewer');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="gap-2">
            <UserPlus className="w-4 h-4" />
            {t('invitations.inviteUser')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            {t('invitations.inviteUser')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="userQuery" className="text-sm font-medium">
              {t('invitations.userEmailOrUsername')}
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="userQuery"
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder={t('invitations.userQueryPlaceholder')}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              {t('invitations.role')}
            </Label>
            <Select 
              value={role} 
              onValueChange={(value: 'viewer' | 'editor' | 'owner') => setRole(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">{t('invitations.roleViewer')}</SelectItem>
                <SelectItem value="editor">{t('invitations.roleEditor')}</SelectItem>
                <SelectItem value="owner">{t('invitations.roleOwner')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleInvite} 
            className="w-full" 
            disabled={loading || !userQuery.trim()}
          >
            {loading ? t('common.loading') : t('invitations.sendInvitation')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserDialog;
