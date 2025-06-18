import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { TradingCard } from "@/components/trading/TradingCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, Plus, ArrowRight, Filter } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getUserTrades } from "@/lib/storage";
import { isLoggedIn } from "@/lib/auth";
import { TradePost } from "@/lib/types";

const MyTrades = () => {
  const navigate = useNavigate();
  const [userTrades, setUserTrades] = useState<TradePost[]>([]);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/");
      return;
    }

    const trades = getUserTrades();
    setUserTrades(trades);
  }, [navigate]);

  const activeTrades = userTrades.filter((t) => t.status === "active");
  const completedTrades = userTrades.filter((t) => t.status === "completed");
  const cancelledTrades = userTrades.filter((t) => t.status === "cancelled");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-trading-primary to-trading-secondary bg-clip-text text-transparent">
              My Trades
            </h1>
            <p className="text-muted-foreground">
              Manage your trading activity and track your progress
            </p>
          </div>
          <Link to="/create">
            <Button className="bg-trading-gradient hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Create New Trade
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="trading-card">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-trading-primary">
                {activeTrades.length}
              </div>
              <p className="text-sm text-muted-foreground">Active Trades</p>
            </CardContent>
          </Card>
          <Card className="trading-card">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-trading-success">
                {completedTrades.length}
              </div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card className="trading-card">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-muted-foreground">
                {cancelledTrades.length}
              </div>
              <p className="text-sm text-muted-foreground">Cancelled</p>
            </CardContent>
          </Card>
        </div>

        {/* Trades Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="active" className="relative">
              Active
              {activeTrades.length > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {activeTrades.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedTrades.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledTrades.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {activeTrades.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <Coins className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">No active trades</h3>
                    <p className="text-muted-foreground">
                      Start trading by creating your first trade post
                    </p>
                  </div>
                  <Link to="/create">
                    <Button className="bg-trading-gradient hover:opacity-90">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Trade
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {activeTrades.map((trade) => (
                  <TradingCard key={trade.id} trade={trade} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {completedTrades.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <Coins className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">No completed trades</h3>
                    <p className="text-muted-foreground">
                      Completed trades will appear here
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {completedTrades.map((trade) => (
                  <TradingCard key={trade.id} trade={trade} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-6">
            {cancelledTrades.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <Coins className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">No cancelled trades</h3>
                    <p className="text-muted-foreground">
                      Cancelled trades will appear here
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {cancelledTrades.map((trade) => (
                  <TradingCard key={trade.id} trade={trade} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MyTrades;
