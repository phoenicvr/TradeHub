import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  ArrowRightLeft,
  Star,
  Eye,
  MessageSquare,
  Zap,
  Calendar,
} from "lucide-react";
import { TradePost } from "@/lib/types";
import { getRarityColor, getRarityBorder } from "@/lib/mock-data";
import { getCurrentUser } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { TradeDetailsModal } from "./TradeDetailsModal";
import { TradeChatModal } from "./TradeChatModal";

interface TradingCardProps {
  trade: TradePost;
}

export function TradingCard({ trade }: TradingCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const currentUser = getCurrentUser();
  const isOwnTrade = currentUser?.id === trade.author.id;

  const timeAgo = formatDistanceToNow(trade.createdAt, { addSuffix: true });
  const isExpiringSoon =
    trade.expiresAt &&
    new Date(trade.expiresAt).getTime() - Date.now() < 24 * 60 * 60 * 1000; // 24 hours

  const handleViewDetails = () => {
    setDetailsOpen(true);
  };

  const handleStartChat = () => {
    if (!currentUser || isOwnTrade) return;
    setChatOpen(true);
  };

  return (
    <Card
      className={cn(
        "trading-card group cursor-pointer hover:shadow-glow transition-all duration-300",
        trade.isUrgent && "ring-2 ring-trading-warning/50",
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 ring-2 ring-trading-primary/20">
              <AvatarImage
                src={trade.author.avatar}
                alt={trade.author.displayName}
              />
              <AvatarFallback>
                {trade.author.displayName.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-sm">
                  {trade.author.displayName}
                </h3>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-trading-warning text-trading-warning" />
                  <span className="text-xs text-muted-foreground">
                    {trade.author.stats.rating}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                @{trade.author.username}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
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
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Trade Title */}
        <div>
          <h2 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-trading-primary transition-colors">
            {trade.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {trade.description}
          </p>
        </div>

        {/* Trading Items */}
        <div className="space-y-3">
          {/* Giving Items */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Giving
            </p>
            <div className="flex flex-wrap gap-2">
              {trade.giving.map((item) => (
                <Badge
                  key={item.id}
                  variant="outline"
                  className={cn(
                    "px-2 py-1 text-xs",
                    getRarityBorder(item.rarity),
                    getRarityColor(item.rarity),
                  )}
                >
                  {item.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Wanting Items */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Wanting
            </p>
            <div className="flex flex-wrap gap-2">
              {trade.wanting.map((item) => (
                <Badge
                  key={item.id}
                  variant="outline"
                  className={cn(
                    "px-2 py-1 text-xs",
                    getRarityBorder(item.rarity),
                    getRarityColor(item.rarity),
                  )}
                >
                  {item.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{timeAgo}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>Views</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-3 w-3" />
                <span>Chat</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={handleViewDetails}
              >
                <Eye className="h-3 w-3 mr-1" />
                View Details
              </Button>
              {!isOwnTrade && currentUser ? (
                <Button
                  size="sm"
                  className="h-8 bg-trading-gradient hover:opacity-90 transition-opacity"
                  onClick={handleStartChat}
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Start Chat
                </Button>
              ) : isOwnTrade ? (
                <Badge variant="secondary" className="h-8 px-3">
                  Your Trade
                </Badge>
              ) : (
                <Button
                  size="sm"
                  className="h-8"
                  variant="outline"
                  disabled
                >
                  Login to Chat
                </Button>
              )}
            </div>
          </div>

        {/* Tags */}
        {trade.tags && trade.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2">
            {trade.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs px-2 py-0.5 bg-muted/50"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <TradeDetailsModal
        trade={trade}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      <TradeChatModal
        trade={trade}
        open={chatOpen}
        onOpenChange={setChatOpen}
      />
    </Card>
  );
}
}