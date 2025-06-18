import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/navigation";
import { TradingCard } from "@/components/trading/TradingCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User as UserIcon,
  Star,
  Calendar,
  TrendingUp,
  Award,
  Edit3,
  Save,
  X,
  Shield,
  CheckCircle,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getCurrentUser, isLoggedIn } from "@/lib/auth";
import { getUserTrades } from "@/lib/storage";
import { getSharedUsers } from "@/lib/shared-storage";
import { TradePost, User } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userTrades, setUserTrades] = useState<TradePost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDisplayName, setEditedDisplayName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = () => {
      if (!userId) {
        navigate("/");
        return;
      }

      // Get the user from shared storage
      const allUsers = getSharedUsers();
      const user = allUsers.find((u) => u.id === userId);

      if (!user) {
        navigate("/");
        return;
      }

      // Convert to public User format
      const publicUser: User = {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        robloxId: user.robloxId,
        joinDate: user.joinDate,
        isOnline: user.isOnline,
        stats: user.stats,
      };

      setProfileUser(publicUser);
      setEditedDisplayName(publicUser.displayName);
      setUserTrades(getUserTrades(userId));
      setLoading(false);
    };

    loadUserProfile();
  }, [userId, navigate]);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin h-8 w-8 mx-auto rounded-full border-2 border-trading-primary border-t-transparent" />
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container py-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold">User Not Found</h1>
            <p className="text-muted-foreground">
              The user profile you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profileUser.id;
  const activeTrades = userTrades.filter((t) => t.status === "active");
  const completedTrades = userTrades.filter((t) => t.status === "completed");
  const totalValue = userTrades.reduce((sum, trade) => {
    return (
      sum +
      trade.giving.reduce((itemSum, item) => itemSum + (item.value || 0), 0)
    );
  }, 0);

  const handleSaveProfile = () => {
    // In a real app, this would update the user's profile
    setIsEditing(false);
    // For now, just update the local state
    if (profileUser) {
      setProfileUser({
        ...profileUser,
        displayName: editedDisplayName,
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedDisplayName(profileUser.displayName);
  };

  const memberSince = formatDistanceToNow(profileUser.joinDate, {
    addSuffix: true,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container py-8 space-y-8">
        {/* Back Button (for non-own profiles) */}
        {!isOwnProfile && (
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
        )}

        {/* Profile Header */}
        <Card className="trading-card">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Avatar and Basic Info */}
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24 ring-4 ring-trading-primary/20">
                  <AvatarImage
                    src={profileUser.avatar}
                    alt={profileUser.displayName}
                  />
                  <AvatarFallback className="text-2xl">
                    {profileUser.displayName.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  {isEditing && isOwnProfile ? (
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="displayName"
                          value={editedDisplayName}
                          onChange={(e) => setEditedDisplayName(e.target.value)}
                          className="w-64"
                        />
                        <Button size="sm" onClick={handleSaveProfile}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <h1 className="text-3xl font-bold">
                        {profileUser.displayName}
                      </h1>
                      {isOwnProfile && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsEditing(true)}
                          className="h-8 w-8"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                  <p className="text-muted-foreground">
                    @{profileUser.username}
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Member {memberSince}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {profileUser.isOnline ? (
                        <>
                          <div className="w-2 h-2 bg-trading-success rounded-full" />
                          <span className="text-sm text-trading-success">
                            Online
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                          <span className="text-sm text-muted-foreground">
                            Offline
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Shield className="h-4 w-4 text-trading-success" />
                      <span className="text-sm text-trading-success">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex-1 lg:ml-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-trading-primary">
                      {profileUser.stats.totalTrades}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total Trades
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-trading-success">
                      {profileUser.stats.successfulTrades}
                    </div>
                    <p className="text-sm text-muted-foreground">Successful</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      {profileUser.stats.totalReviews > 0 ? (
                        <>
                          <Star className="h-5 w-5 fill-trading-warning text-trading-warning" />
                          <span className="text-2xl font-bold">
                            {profileUser.stats.rating.toFixed(1)}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-muted-foreground">
                          —
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-trading-accent">
                      {totalValue}
                    </div>
                    <p className="text-sm text-muted-foreground">Trade Value</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="trading-card">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-trading-primary/20">
                <TrendingUp className="h-6 w-6 text-trading-primary" />
              </div>
              <div className="text-2xl font-bold">{activeTrades.length}</div>
              <p className="text-sm text-muted-foreground">Active Trades</p>
            </CardContent>
          </Card>

          <Card className="trading-card">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-trading-success/20">
                <CheckCircle className="h-6 w-6 text-trading-success" />
              </div>
              <div className="text-2xl font-bold">{completedTrades.length}</div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>

          <Card className="trading-card">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-trading-warning/20">
                <Award className="h-6 w-6 text-trading-warning" />
              </div>
              <div className="text-2xl font-bold">
                {profileUser.stats.totalReviews}
              </div>
              <p className="text-sm text-muted-foreground">Reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue="trades" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="trades">
              {isOwnProfile ? "My Trades" : "Their Trades"}
            </TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="trades" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {isOwnProfile
                  ? "My Trading History"
                  : `${profileUser.displayName}'s Trades`}
              </h3>
              {isOwnProfile && (
                <Link to="/create">
                  <Button className="bg-trading-gradient hover:opacity-90">
                    Create New Trade
                  </Button>
                </Link>
              )}
            </div>

            {userTrades.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">
                      {isOwnProfile ? "No trades yet" : "No trades found"}
                    </h3>
                    <p className="text-muted-foreground">
                      {isOwnProfile
                        ? "Start your trading journey by creating your first trade post"
                        : `${profileUser.displayName} hasn't created any trades yet`}
                    </p>
                  </div>
                  {isOwnProfile && (
                    <Link to="/create">
                      <Button className="bg-trading-gradient hover:opacity-90">
                        Create Your First Trade
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {userTrades.map((trade) => (
                  <TradingCard key={trade.id} trade={trade} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Reviews & Ratings</h3>
            </div>

            {profileUser.stats.totalReviews === 0 ? (
              <Card className="p-12 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">No reviews yet</h3>
                    <p className="text-muted-foreground">
                      {isOwnProfile
                        ? "Complete some trades to start receiving reviews from other traders"
                        : `${profileUser.displayName} hasn't received any reviews yet`}
                    </p>
                  </div>
                  {isOwnProfile && (
                    <Link to="/create">
                      <Button className="bg-trading-gradient hover:opacity-90">
                        Start Trading
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Overall Rating</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                profileUser.stats.totalReviews > 0 &&
                                star <= Math.round(profileUser.stats.rating)
                                  ? "fill-trading-warning text-trading-warning"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium">
                          {profileUser.stats.totalReviews > 0
                            ? profileUser.stats.rating.toFixed(1)
                            : "No ratings yet"}
                        </span>
                        <span className="text-muted-foreground">
                          ({profileUser.stats.totalReviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
                <p className="text-center text-muted-foreground py-8">
                  Individual reviews will appear here as{" "}
                  {isOwnProfile ? "you complete" : "they complete"} more trades
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Achievements & Badges</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* First Trade Achievement */}
              <Card
                className={`p-6 ${userTrades.length > 0 ? "ring-2 ring-trading-success" : "opacity-50"}`}
              >
                <div className="text-center space-y-3">
                  <div
                    className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                      userTrades.length > 0
                        ? "bg-trading-success/20"
                        : "bg-muted"
                    }`}
                  >
                    <TrendingUp
                      className={`h-6 w-6 ${
                        userTrades.length > 0
                          ? "text-trading-success"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">First Trade</h4>
                    <p className="text-sm text-muted-foreground">
                      Create {isOwnProfile ? "your" : "their"} first trade post
                    </p>
                  </div>
                  {userTrades.length > 0 && (
                    <Badge className="bg-trading-success text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Unlocked
                    </Badge>
                  )}
                </div>
              </Card>

              {/* Trusted Trader Achievement */}
              <Card
                className={`p-6 ${profileUser.stats.successfulTrades >= 5 ? "ring-2 ring-trading-warning" : "opacity-50"}`}
              >
                <div className="text-center space-y-3">
                  <div
                    className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                      profileUser.stats.successfulTrades >= 5
                        ? "bg-trading-warning/20"
                        : "bg-muted"
                    }`}
                  >
                    <Shield
                      className={`h-6 w-6 ${
                        profileUser.stats.successfulTrades >= 5
                          ? "text-trading-warning"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Trusted Trader</h4>
                    <p className="text-sm text-muted-foreground">
                      Complete 5 successful trades
                    </p>
                  </div>
                  {profileUser.stats.successfulTrades >= 5 && (
                    <Badge className="bg-trading-warning text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Unlocked
                    </Badge>
                  )}
                </div>
              </Card>

              {/* Perfect Rating Achievement */}
              <Card
                className={`p-6 ${profileUser.stats.rating >= 4.8 && profileUser.stats.totalReviews >= 10 ? "ring-2 ring-trading-primary" : "opacity-50"}`}
              >
                <div className="text-center space-y-3">
                  <div
                    className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                      profileUser.stats.rating >= 4.8 &&
                      profileUser.stats.totalReviews >= 10
                        ? "bg-trading-primary/20"
                        : "bg-muted"
                    }`}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        profileUser.stats.rating >= 4.8 &&
                        profileUser.stats.totalReviews >= 10
                          ? "text-trading-primary fill-trading-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Top Rated</h4>
                    <p className="text-sm text-muted-foreground">
                      Maintain 4.8+ rating with 10+ reviews
                    </p>
                  </div>
                  {profileUser.stats.rating >= 4.8 &&
                    profileUser.stats.totalReviews >= 10 && (
                      <Badge className="bg-trading-primary text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Unlocked
                      </Badge>
                    )}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default UserProfile;
