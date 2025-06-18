import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Check,
  CheckCheck,
  Coins,
  Star,
  AlertCircle,
  X,
} from "lucide-react";
import {
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type Notification,
} from "@/lib/storage";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface NotificationsPanelProps {
  children: React.ReactNode;
}

export function NotificationsPanel({ children }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const refreshNotifications = () => {
    setNotifications(getUserNotifications());
    setUnreadCount(getUnreadNotificationCount());
  };

  useEffect(() => {
    refreshNotifications();
    // Refresh every 5 seconds to simulate real-time updates
    const interval = setInterval(refreshNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    refreshNotifications();
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    refreshNotifications();
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "trade":
        return <Coins className="h-4 w-4 text-trading-primary" />;
      case "review":
        return <Star className="h-4 w-4 text-trading-warning" />;
      case "system":
        return <AlertCircle className="h-4 w-4 text-trading-accent" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge className="bg-trading-accent text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs"
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
          </SheetTitle>
          <SheetDescription>
            Stay updated with your trading activity
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        <ScrollArea className="h-[calc(100vh-120px)]">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No notifications</h3>
              <p className="text-muted-foreground">
                You're all caught up! New notifications will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 rounded-lg border transition-all hover:shadow-md",
                    notification.isRead
                      ? "bg-muted/30 border-border"
                      : "bg-card border-trading-primary/20 shadow-sm",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        {getNotificationIcon(notification.type)}
                        <h4
                          className={cn(
                            "font-medium text-sm",
                            !notification.isRead &&
                              "text-trading-primary font-semibold",
                          )}
                        >
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-trading-accent rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(notification.createdAt, {
                            addSuffix: true,
                          })}
                        </span>
                        {notification.actionUrl && (
                          <Button variant="outline" size="sm" className="h-7">
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-2"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
