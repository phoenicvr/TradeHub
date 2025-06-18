import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  Bell,
  User,
  Settings,
  LogOut,
  Coins,
  Star,
  TrendingUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Mock user for demo - in real app this would come from auth context
const currentUser = {
  username: "DragonSlayer99",
  displayName: "Dragon Slayer",
  avatar: "/placeholder.svg",
  rating: 4.8,
  isOnline: true,
};

export function Navigation() {
  const location = useLocation();

  const navItems = [
    { label: "Home", href: "/", icon: TrendingUp },
    { label: "Create Trade", href: "/create", icon: Plus },
    { label: "My Trades", href: "/my-trades", icon: Coins },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-trading-gradient">
            <Coins className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-trading-primary to-trading-secondary bg-clip-text text-transparent">
            TradeHub
          </span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search items, users, or trades..."
              className="pl-10 bg-muted/50 border-border/50 focus:border-trading-primary"
            />
          </div>
        </div>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex items-center space-x-2 hover:bg-trading-primary/10",
                    isActive && "bg-trading-primary/20 text-trading-primary",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-trading-accent text-xs">
              3
            </Badge>
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 ring-2 ring-trading-primary/20">
                  <AvatarImage
                    src={currentUser.avatar}
                    alt={currentUser.displayName}
                  />
                  <AvatarFallback>
                    {currentUser.displayName.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                {currentUser.isOnline && (
                  <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-trading-success border border-background"></div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {currentUser.displayName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    @{currentUser.username}
                  </p>
                  <div className="flex items-center space-x-1 pt-1">
                    <Star className="h-3 w-3 fill-trading-warning text-trading-warning" />
                    <span className="text-xs font-medium">
                      {currentUser.rating}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/my-trades" className="flex items-center">
                  <Coins className="mr-2 h-4 w-4" />
                  <span>My Trades</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
