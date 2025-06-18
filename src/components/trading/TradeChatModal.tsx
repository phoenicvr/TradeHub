import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { TradePost } from "@/lib/types";
import { getCurrentUser } from "@/lib/storage";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  type: "text" | "offer" | "system";
}

interface TradeChatModalProps {
  trade: TradePost;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TradeChatModal({
  trade,
  open,
  onOpenChange,
}: TradeChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (open && currentUser) {
      // Initialize conversation with a welcome message
      const welcomeMessage: Message = {
        id: `msg_${Date.now()}`,
        senderId: "system",
        senderName: "TradeHub",
        senderAvatar: "/placeholder.svg",
        content: `Started conversation about: "${trade.title}"`,
        timestamp: new Date(),
        type: "system",
      };
      setMessages([welcomeMessage]);
    }
  }, [open, currentUser, trade.title]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentUser) return;

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatar,
      content: newMessage.trim(),
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Simulate other user typing and responding
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const responses = [
          "Hi! I'm interested in your trade offer.",
          "That sounds like a fair deal to me.",
          "Would you be willing to add anything else?",
          "Perfect! When would you like to complete this trade?",
          "I have those items you're looking for.",
          "Let me check my inventory and get back to you.",
        ];

        const response: Message = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          senderId: trade.author.id,
          senderName: trade.author.displayName,
          senderAvatar: trade.author.avatar,
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          type: "text",
        };
        setMessages((prev) => [...prev, response]);
      }, 1500);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!currentUser) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={trade.author.avatar}
                alt={trade.author.displayName}
              />
              <AvatarFallback>
                {trade.author.displayName.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">
                {trade.author.displayName}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                About: {trade.title}
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Trade Summary */}
        <div className="flex-shrink-0 p-3 bg-muted/30 rounded-lg mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {trade.giving.length} items offered
              </Badge>
              <span>for</span>
              <Badge variant="outline" className="text-xs">
                {trade.wanting.length} items wanted
              </Badge>
            </div>
            <Badge
              variant={trade.status === "active" ? "default" : "secondary"}
              className="text-xs"
            >
              {trade.status}
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                {message.type === "system" ? (
                  <div className="text-center">
                    <div className="inline-flex items-center px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                      {message.content}
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "flex space-x-3",
                      message.senderId === currentUser.id &&
                        "flex-row-reverse space-x-reverse",
                    )}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage
                        src={message.senderAvatar}
                        alt={message.senderName}
                      />
                      <AvatarFallback>
                        {message.senderName.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "flex-1 min-w-0",
                        message.senderId === currentUser.id && "text-right",
                      )}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium">
                          {message.senderName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(message.timestamp, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "inline-block p-3 rounded-lg max-w-xs lg:max-w-md",
                          message.senderId === currentUser.id
                            ? "bg-trading-primary text-white ml-auto"
                            : "bg-muted",
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={trade.author.avatar}
                    alt={trade.author.displayName}
                  />
                  <AvatarFallback>
                    {trade.author.displayName.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-muted rounded-lg p-3 max-w-xs">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <Separator />

        {/* Message Input */}
        <div className="flex-shrink-0 pt-4">
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-trading-gradient hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="text-trading-success border-trading-success hover:bg-trading-success hover:text-white"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Accept Trade
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive hover:bg-destructive hover:text-white"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Decline
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
