
import React, { useState } from 'react';
import { UserPlus, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useInvitations } from '@/hooks/useInvitations';
import { useLanguage } from '@/contexts/LanguageContext';

interface InviteUserDialogProps {
  gameId: string;
}

const InviteUserDialog: React.FC<InviteUserDialogProps> = ({ gameId }) => {
  const { sendInvitation } = useInvitations();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendInvitation = async () => {
    if (!email.trim()) return;

    setIsLoading(true);
    const success = await sendInvitation(gameId, email.trim(), role);
    setIsLoading(false);

    if (success) {
      setEmail('');
      setRole('viewer');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <UserPlus className="w-4 h-4" />
          {t('invitations.inviteUser')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            {t('invitations.inviteUserToGame')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="user-email">
              {t('invitations.inviteEmail')}
            </Label>
            <Input
              id="user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('invitations.emailPlaceholder')}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              {t('invitations.emailDescription')}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="user-role">
              {t('invitations.role')}
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full">
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
            onClick={handleSendInvitation} 
            disabled={!email.trim() || isLoading}
            className="w-full mt-6"
          >
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? t('invitations.sending') : t('invitations.sendInvitation')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserDialog;
