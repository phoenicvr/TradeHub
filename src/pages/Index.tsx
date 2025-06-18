import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { TradingCard } from "@/components/trading/TradingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Filter,
  TrendingUp,
  Users,
  Activity,
  Zap,
  RefreshCw,
  Plus,
} from "lucide-react";
import { mockUsers } from "@/lib/mock-data";
import { ItemRarity, TradePost } from "@/lib/types";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getAllTrades, initializeStorage } from "@/lib/storage";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedRarities, setSelectedRarities] = useState<ItemRarity[]>([]);
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);
  const [trades, setTrades] = useState<TradePost[]>([]);

  const rarities: ItemRarity[] = [
    "common",
    "uncommon",
    "rare",
    "legendary",
    "mythical",
    "divine",
    "prismatic",
  ];

  useEffect(() => {
    // Initialize storage with sample data on first load
    initializeStorage();
    refreshTrades();
  }, []);

  const refreshTrades = () => {
    setTrades(getAllTrades());
  };

  const filteredTrades = trades
    .filter((trade) => {
      const matchesSearch =
        trade.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.author.displayName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesRarity =
        selectedRarities.length === 0 ||
        trade.giving.some((item) => selectedRarities.includes(item.rarity)) ||
        trade.wanting.some((item) => selectedRarities.includes(item.rarity));

      const matchesUrgent = !showUrgentOnly || trade.isUrgent;

      return matchesSearch && matchesRarity && matchesUrgent;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "oldest":
          return a.createdAt.getTime() - b.createdAt.getTime();
        case "rating":
          return b.author.stats.rating - a.author.stats.rating;
        default:
          return 0;
      }
    });

  const stats = {
    activeTrades: trades.filter((t) => t.status === "active").length,
    totalUsers: mockUsers.length,
    completedToday: 0, // Would be calculated from real data
    urgentTrades: trades.filter((t) => t.isUrgent).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-trading-primary via-trading-secondary to-trading-accent bg-clip-text text-transparent">
            Trade with Confidence
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover rare items, make secure trades, and build your reputation
            in the ultimate trading marketplace.
          </p>
          <div className="flex items-center justify-center space-x-4 pt-4">
            <Link to="/create">
              <Button
                size="lg"
                className="bg-trading-gradient hover:opacity-90"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Trade Post
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Learn How It Works
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="trading-card">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-trading-primary/20">
                <TrendingUp className="h-6 w-6 text-trading-primary" />
              </div>
              <div className="text-2xl font-bold">{stats.activeTrades}</div>
              <p className="text-sm text-muted-foreground">Active Trades</p>
            </CardContent>
          </Card>

          <Card className="trading-card">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-trading-secondary/20">
                <Users className="h-6 w-6 text-trading-secondary" />
              </div>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-sm text-muted-foreground">Traders</p>
            </CardContent>
          </Card>

          <Card className="trading-card">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-trading-success/20">
                <Activity className="h-6 w-6 text-trading-success" />
              </div>
              <div className="text-2xl font-bold">{stats.completedToday}</div>
              <p className="text-sm text-muted-foreground">Completed Today</p>
            </CardContent>
          </Card>

          <Card className="trading-card">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-trading-warning/20">
                <Zap className="h-6 w-6 text-trading-warning" />
              </div>
              <div className="text-2xl font-bold">{stats.urgentTrades}</div>
              <p className="text-sm text-muted-foreground">Urgent</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Browse Trade Posts</span>
              <Button variant="outline" size="sm" onClick={refreshTrades}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search trades, users, or items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="rating">Best Rating</SelectItem>
                </SelectContent>
              </Select>

              {/* Filters */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-[120px]">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {(selectedRarities.length > 0 || showUrgentOnly) && (
                      <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {selectedRarities.length + (showUrgentOnly ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={showUrgentOnly}
                    onCheckedChange={setShowUrgentOnly}
                  >
                    Urgent Only
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Item Rarities</DropdownMenuLabel>
                  {rarities.map((rarity) => (
                    <DropdownMenuCheckboxItem
                      key={rarity}
                      checked={selectedRarities.includes(rarity)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedRarities([...selectedRarities, rarity]);
                        } else {
                          setSelectedRarities(
                            selectedRarities.filter((r) => r !== rarity),
                          );
                        }
                      }}
                    >
                      <span className="capitalize">{rarity}</span>
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Active Filters */}
            {(selectedRarities.length > 0 || showUrgentOnly) && (
              <div className="flex flex-wrap gap-2">
                {showUrgentOnly && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => setShowUrgentOnly(false)}
                  >
                    Urgent Only ×
                  </Badge>
                )}
                {selectedRarities.map((rarity) => (
                  <Badge
                    key={rarity}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground capitalize"
                    onClick={() =>
                      setSelectedRarities(
                        selectedRarities.filter((r) => r !== rarity),
                      )
                    }
                  >
                    {rarity} ×
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trade Posts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTrades.map((trade) => (
            <TradingCard key={trade.id} trade={trade} />
          ))}
        </div>

        {filteredTrades.length === 0 && (
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">No trades found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedRarities([]);
                  setShowUrgentOnly(false);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Index;
