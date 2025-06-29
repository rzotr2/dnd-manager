
import React, { useState } from 'react';
import { Users, Mail, Copy, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useGameMembers } from '@/hooks/useGameMembers';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

interface GameInvitationsProps {
  gameId: string;
}

const GameInvitations: React.FC<GameInvitationsProps> = ({ gameId }) => {
  const { members, invitations, loading, sendInvitation, deleteInvitation, removeMember, updateMemberRole, generateInviteLink } = useGameMembers(gameId);
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'viewer' as 'owner' | 'editor' | 'viewer'
  });

  const handleSendInvitation = async () => {
    if (!inviteForm.email.trim()) return;

    await sendInvitation(inviteForm.email, inviteForm.role);
    setInviteForm({ email: '', role: 'viewer' });
    setIsInviteDialogOpen(false);
  };

  const copyInviteLink = (token: string) => {
    const link = generateInviteLink(token);
    navigator.clipboard.writeText(link);
    toast({
      title: t('success.title'),
      description: t('invitations.linkCopied'),
    });
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-red-100 text-red-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-2">
          <Users className="w-8 h-8 text-muted-foreground mx-auto animate-pulse" />
          <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Game Members */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5" />
              {t('games.gameMembers')}
            </CardTitle>
            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Mail className="w-4 h-4" />
                  {t('games.invitePlayer')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t('invitations.title')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="inviteEmail">{t('invitations.inviteEmail')}</Label>
                    <Input
                      id="inviteEmail"
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder={t('invitations.emailPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inviteRole">{t('invitations.role')}</Label>
                    <Select 
                      value={inviteForm.role} 
                      onValueChange={(value: 'owner' | 'editor' | 'viewer') => 
                        setInviteForm(prev => ({ ...prev, role: value }))
                      }
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
                  <Button onClick={handleSendInvitation} className="w-full">
                    {t('invitations.sendInvitation')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm">
                    {member.profiles?.full_name || member.profiles?.username || t('common.loading')}
                    {member.user_id === user?.id && (
                      <span className="text-xs text-muted-foreground ml-1">{t('members.you')}</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(member.joined_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getRoleBadgeColor(member.role)}>
                  {t(`members.${member.role}`)}
                </Badge>
                {member.user_id !== user?.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMember(member.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="w-5 h-5" />
              {t('invitations.pendingInvitations')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {invitations.map((invitation) => (
              <div key={invitation.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{invitation.invited_email}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {t('invitations.expires')}: {new Date(invitation.expires_at).toLocaleDateString()}
                      {isExpired(invitation.expires_at) && (
                        <Badge variant="destructive" className="text-xs">
                          {t('invitations.expired')}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getRoleBadgeColor(invitation.role)}>
                    {t(`invitations.role${invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}`)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyInviteLink(invitation.token)}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteInvitation(invitation.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GameInvitations;
