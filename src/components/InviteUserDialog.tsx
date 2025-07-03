
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
  const [identifier, setIdentifier] = useState('');
  const [role, setRole] = useState('viewer');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendInvitation = async () => {
    if (!identifier.trim()) return;

    setIsLoading(true);
    const success = await sendInvitation(gameId, identifier.trim(), role);
    setIsLoading(false);

    if (success) {
      setIdentifier('');
      setRole('viewer');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <UserPlus className="w-4 h-4" />
          Запросити користувача
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Запросити користувача до гри
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="user-identifier">
              Email або ім'я користувача
            </Label>
            <Input
              id="user-identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="user@example.com або username"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Введіть email або ім'я користувача існуючого акаунту
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="user-role">
              Роль у грі
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Глядач</SelectItem>
                <SelectItem value="editor">Редактор</SelectItem>
                <SelectItem value="owner">Власник</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleSendInvitation} 
            disabled={!identifier.trim() || isLoading}
            className="w-full mt-6"
          >
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? 'Надсилання...' : 'Надіслати запрошення'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserDialog;
