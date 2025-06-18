import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users } from "lucide-react";
import { mockUsers } from "@/lib/mock-data";
import { login } from "@/lib/storage";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: () => void;
}

export function LoginModal({ open, onOpenChange, onLogin }: LoginModalProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleLogin = (userId: string) => {
    const user = login(userId);
    if (user) {
      onLogin();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-trading-primary to-trading-secondary bg-clip-text text-transparent">
            Welcome to TradeHub
          </DialogTitle>
          <DialogDescription>
            Choose a demo account to start trading. In a real app, this would
            integrate with Roblox authentication.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockUsers.map((user) => (
            <Card
              key={user.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedUser === user.id
                  ? "ring-2 ring-trading-primary"
                  : "hover:ring-1 hover:ring-trading-primary/50"
              }`}
              onClick={() => setSelectedUser(user.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} alt={user.displayName} />
                    <AvatarFallback>
                      {user.displayName.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {user.displayName}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      @{user.username}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-trading-warning text-trading-warning" />
                        <span className="text-xs font-medium">
                          {user.stats.rating}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {user.stats.totalTrades}
                        </span>
                      </div>
                    </div>
                  </div>
                  {user.isOnline && (
                    <Badge variant="secondary" className="text-xs">
                      Online
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4">
          <p className="text-sm text-muted-foreground">
            Demo mode - No real authentication required
          </p>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedUser && handleLogin(selectedUser)}
              disabled={!selectedUser}
              className="bg-trading-gradient hover:opacity-90"
            >
              Login as Selected User
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
