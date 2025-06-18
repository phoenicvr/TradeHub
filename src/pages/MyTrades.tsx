import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const MyTrades = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container py-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Coins className="h-8 w-8 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold">My Trades</h1>
            <p className="text-muted-foreground">
              View and manage all your trading activity
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                This page will show your active trades, completed trades, and
                trading history. Features will include:
              </p>
              <ul className="text-left space-y-2 text-sm text-muted-foreground">
                <li>• Active trade posts you've created</li>
                <li>• Incoming trade offers</li>
                <li>• Trade history and statistics</li>
                <li>• Success/failure tracking</li>
                <li>• Quick actions for managing trades</li>
              </ul>
              <div className="pt-4">
                <Link to="/create">
                  <Button className="bg-trading-gradient hover:opacity-90">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Trade
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

export default MyTrades;
