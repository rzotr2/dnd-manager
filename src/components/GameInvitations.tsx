
import React, { useState } from 'react';
import { Users, Mail, Copy, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
      case 'owner': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'editor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'viewer': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <Users className="w-8 h-8 text-muted-foreground mx-auto animate-pulse" />
          <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1">
      {/* Game Members */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4 space-y-2">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-primary" />
              {t('games.gameMembers')}
            </CardTitle>
            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 shrink-0">
                  <Mail className="w-4 h-4" />
                  {t('games.invitePlayer')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader className="space-y-3">
                  <DialogTitle>{t('invitations.title')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-3">
                    <Label htmlFor="inviteEmail" className="text-sm font-medium">
                      {t('invitations.inviteEmail')}
                    </Label>
                    <Input
                      id="inviteEmail"
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder={t('invitations.emailPlaceholder')}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="inviteRole" className="text-sm font-medium">
                      {t('invitations.role')}
                    </Label>
                    <Select 
                      value={inviteForm.role} 
                      onValueChange={(value: 'owner' | 'editor' | 'viewer') => 
                        setInviteForm(prev => ({ ...prev, role: value }))
                      }
                    >
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
                  <Button onClick={handleSendInvitation} className="w-full mt-6">
                    {t('invitations.sendInvitation')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {members.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{t('games.noMembers')}</p>
            </div>
          ) : (
            members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm flex items-center gap-2">
                      <span className="truncate">
                        {member.profiles?.full_name || member.profiles?.username || t('common.loading')}
                      </span>
                      {member.user_id === user?.id && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          {t('members.you')}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(member.joined_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge className={`${getRoleBadgeColor(member.role)} text-xs`}>
                    {t(`members.${member.role}`)}
                  </Badge>
                  {member.user_id !== user?.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMember(member.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-4 space-y-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="w-5 h-5 text-primary" />
              {t('invitations.pendingInvitations')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {invitations.map((invitation) => (
              <div key={invitation.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm truncate">{invitation.invited_email}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span className="truncate">
                        {t('invitations.expires')}: {new Date(invitation.expires_at).toLocaleDateString()}
                      </span>
                      {isExpired(invitation.expires_at) && (
                        <Badge variant="destructive" className="text-xs ml-2">
                          {t('invitations.expired')}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className={`${getRoleBadgeColor(invitation.role)} text-xs`}>
                    {t(`invitations.role${invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}`)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyInviteLink(invitation.token)}
                    className="h-8 w-8 p-0 hover:bg-muted"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteInvitation(invitation.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
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
