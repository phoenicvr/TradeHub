import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  User,
  Star,
  Calendar,
  TrendingUp,
  Award,
  Edit3,
  Save,
  X,
  Shield,
  CheckCircle,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getCurrentUser, isLoggedIn } from "@/lib/auth";
import { getUserTrades } from "@/lib/storage";
import { TradePost } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

const Profile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/");
      return;
    }

    // Redirect to the dynamic user profile page
    navigate(`/user/${user.id}`);
  }, [navigate]);

  // This component just redirects - the actual profile is shown by UserProfile
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin h-8 w-8 mx-auto rounded-full border-2 border-trading-primary border-t-transparent" />
            <p className="text-muted-foreground">Redirecting to your profile...</p>
          </div>
        </div>
      </main>
    </div>
  );