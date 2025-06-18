import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container py-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold">User Profile</h1>
            <p className="text-muted-foreground">
              Manage your profile and view your trading reputation
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                This page will display your complete trading profile. Features
                will include:
              </p>
              <ul className="text-left space-y-2 text-sm text-muted-foreground">
                <li>• Roblox profile integration with avatar</li>
                <li>• Trading statistics and achievements</li>
                <li>• Reviews and ratings from other traders</li>
                <li>• Successful vs unsuccessful trade history</li>
                <li>• Profile customization options</li>
                <li>• Trust score and verification badges</li>
              </ul>
              <div className="pt-4">
                <Link to="/create">
                  <Button className="bg-trading-gradient hover:opacity-90">
                    <Star className="h-4 w-4 mr-2" />
                    Start Building Your Reputation
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
