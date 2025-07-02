
import React, { useState } from 'react';
import { Bell, Check, X, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useProfile } from '@/hooks/useProfile';
import { useLanguage } from '@/contexts/LanguageContext';

const NotificationBell: React.FC = () => {
  const { invitations, acceptInvitation, rejectInvitation, unreadInvitationsCount } = useProfile();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleAccept = async (invitationId: string) => {
    const result = await acceptInvitation(invitationId);
    if (result.success) {
      setIsOpen(false);
    }
  };

  const handleReject = async (invitationId: string) => {
    await rejectInvitation(invitationId);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'editor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'viewer': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getThemeName = (theme: string) => {
    const themes: { [key: string]: string } = {
      'theme-fantasy': 'Фентезі',
      'theme-cyberpunk': 'Кіберпанк',
      'theme-stalker': 'Сталкер',
      'theme-scifi': 'Наукова фантастика'
    };
    return themes[theme] || theme;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadInvitationsCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadInvitationsCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4" />
              {t('notifications.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {invitations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t('notifications.noInvitations')}</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="p-4 border-b border-border/50 last:border-b-0">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="w-4 h-4 text-primary shrink-0" />
                            <span className="font-medium text-sm truncate">
                              {invitation.games?.name}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {t('notifications.invitedBy')} {invitation.inviter_profile?.username || invitation.inviter_profile?.email}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {getThemeName(invitation.games?.theme || '')}
                            </Badge>
                            <Badge className={`${getRoleBadgeColor(invitation.role)} text-xs`}>
                              {t(`invitations.role${invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}`)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAccept(invitation.id)}
                          className="flex-1 h-8 text-xs"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          {t('notifications.accept')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(invitation.id)}
                          className="flex-1 h-8 text-xs"
                        >
                          <X className="w-3 h-3 mr-1" />
                          {t('notifications.reject')}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
