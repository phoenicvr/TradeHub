import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  Clock,
  ArrowRightLeft,
  Star,
  MessageSquare,
  Flag,
  Share,
  Zap,
} from "lucide-react";
import { TradePost } from "@/lib/types";
import { getRarityColor, getRarityBorder } from "@/lib/mock-data";
import { getCurrentUser } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { TradeChatModal } from "./TradeChatModal";

interface TradeDetailsModalProps {
  trade: TradePost;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TradeDetailsModal({
  trade,
  open,
  onOpenChange,
}: TradeDetailsModalProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const currentUser = getCurrentUser();
  const isOwnTrade = currentUser?.id === trade.author.id;
  const timeAgo = formatDistanceToNow(trade.createdAt, { addSuffix: true });
  const isExpiringSoon =
    trade.expiresAt &&
    new Date(trade.expiresAt).getTime() - Date.now() < 24 * 60 * 60 * 1000;

  const handleStartChat = () => {
    if (!currentUser || isOwnTrade) return;
    setChatOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold leading-tight pr-4">
                  {trade.title}
                </h2>
                <div className="flex items-center space-x-2 mt-2">
                  {trade.isUrgent && (
                    <Badge variant="destructive" className="text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      Urgent
                    </Badge>
                  )}
                  {isExpiringSoon && (
                    <Badge
                      variant="outline"
                      className="text-xs border-trading-warning text-trading-warning"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      Expires Soon
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs capitalize">
                    {trade.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Share className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </DialogTitle>
            <DialogDescription className="text-left">
              {trade.description}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
              {/* Trader Info */}
              <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                <Avatar className="h-12 w-12 ring-2 ring-trading-primary/20">
                  <AvatarImage
                    src={trade.author.avatar}
                    alt={trade.author.displayName}
                  />
                  <AvatarFallback>
                    {trade.author.displayName.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">
                      {trade.author.displayName}
                    </h3>
                    {trade.author.stats.totalReviews > 0 ? (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-trading-warning text-trading-warning" />
                        <span className="text-sm font-medium">
                          {trade.author.stats.rating.toFixed(1)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({trade.author.stats.totalReviews} reviews)
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        New trader
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    @{trade.author.username} • {trade.author.stats.totalTrades}{" "}
                    total trades • {trade.author.stats.successfulTrades}{" "}
                    successful
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Posted {timeAgo}</span>
                    </div>
                    {trade.expiresAt && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          Expires{" "}
                          {formatDistanceToNow(trade.expiresAt, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Trading Items */}
              <div className="space-y-6">
                {/* Giving Items */}
                <div>
                  <h4 className="font-semibold text-lg mb-4 flex items-center">
                    <span className="w-6 h-6 bg-trading-primary rounded-full flex items-center justify-center text-white text-xs mr-2">
                      1
                    </span>
                    What they're giving
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trade.giving.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "p-4 border rounded-lg bg-card",
                          getRarityBorder(item.rarity),
                        )}
                      >
                        <div className="text-center space-y-2">
                          <div className="h-16 w-16 mx-auto bg-muted rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🌱</span>
                          </div>
                          <div>
                            <h5 className="font-medium">{item.name}</h5>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs mt-1",
                                getRarityColor(item.rarity),
                                getRarityBorder(item.rarity),
                              )}
                            >
                              {item.rarity}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.category}
                            </p>
                            {item.value && (
                              <p className="text-xs font-medium text-trading-accent mt-1">
                                Value: {item.value}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="flex items-center space-x-3">
                    <div className="h-px bg-border flex-1 w-12" />
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-trading-gradient">
                      <ArrowRightLeft className="h-5 w-5 text-white" />
                    </div>
                    <div className="h-px bg-border flex-1 w-12" />
                  </div>
                </div>

                {/* Wanting Items */}
                <div>
                  <h4 className="font-semibold text-lg mb-4 flex items-center">
                    <span className="w-6 h-6 bg-trading-secondary rounded-full flex items-center justify-center text-white text-xs mr-2">
                      2
                    </span>
                    What they want
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trade.wanting.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "p-4 border rounded-lg bg-card",
                          getRarityBorder(item.rarity),
                        )}
                      >
                        <div className="text-center space-y-2">
                          <div className="h-16 w-16 mx-auto bg-muted rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🌱</span>
                          </div>
                          <div>
                            <h5 className="font-medium">{item.name}</h5>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs mt-1",
                                getRarityColor(item.rarity),
                                getRarityBorder(item.rarity),
                              )}
                            >
                              {item.rarity}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.category}
                            </p>
                            {item.value && (
                              <p className="text-xs font-medium text-trading-accent mt-1">
                                Value: {item.value}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tags */}
              {trade.tags && trade.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {trade.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs px-2 py-1"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <Separator />

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-muted-foreground">
              {isOwnTrade
                ? "This is your trade post"
                : currentUser
                  ? "Interested in this trade?"
                  : "Login to make an offer"}
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              {!isOwnTrade && currentUser && (
                <Button
                  onClick={handleStartChat}
                  className="bg-trading-gradient hover:opacity-90"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start Conversation
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TradeChatModal
        trade={trade}
        open={chatOpen}
        onOpenChange={setChatOpen}
      />
    </>
  );
}
