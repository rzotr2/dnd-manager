
import React, { useState } from 'react';
import { Bell, Check, X, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useInvitations } from '@/hooks/useInvitations';
import { useLanguage } from '@/contexts/LanguageContext';

const NotificationBell: React.FC = () => {
  const { invitations, loading, unreadCount, acceptInvitation, declineInvitation } = useInvitations();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleAccept = async (invitationId: string) => {
    const success = await acceptInvitation(invitationId);
    if (success) {
      setIsOpen(false);
    }
  };

  const handleDecline = async (invitationId: string) => {
    await declineInvitation(invitationId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 p-0"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Запрошення до ігор
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Завантаження...
              </div>
            ) : invitations.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Немає нових запрошень
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="p-4 border-b border-border/50 last:border-b-0">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="h-4 w-4 text-primary flex-shrink-0" />
                            <p className="font-medium text-sm truncate">
                              {invitation.games?.name || 'Невідома гра'}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Від: {invitation.profiles?.username || 'Невідомий користувач'}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(invitation.created_at)}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {invitation.role === 'owner' ? 'Власник' : 
                           invitation.role === 'editor' ? 'Редактор' : 'Глядач'}
                        </Badge>
                      </div>
                      
                      {invitation.games?.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {invitation.games.description}
                        </p>
                      )}
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAccept(invitation.id)}
                          className="flex-1 h-8 text-xs"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Прийняти
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDecline(invitation.id)}
                          className="flex-1 h-8 text-xs"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Відхилити
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
