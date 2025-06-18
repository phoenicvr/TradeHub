import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/navigation";
import { ItemSelector } from "@/components/trading/ItemSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Clock,
  Zap,
  Tag,
  Send,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { Item } from "@/lib/types";
import { cn } from "@/lib/utils";
import { createTrade } from "@/lib/storage";
import { isLoggedIn } from "@/lib/auth";

const CreateTrade = () => {
  const navigate = useNavigate();
  const [givingItems, setGivingItems] = useState<Item[]>([]);
  const [wantingItems, setWantingItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [expiryDays, setExpiryDays] = useState("7");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/");
    }
  }, [navigate]);

  const isFormValid =
    title.trim() !== "" &&
    description.trim() !== "" &&
    givingItems.length > 0 &&
    wantingItems.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !isLoggedIn()) return;

    setIsSubmitting(true);

    try {
      // Process tags
      const processedTags = tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0);

      // Create the trade
      const trade = createTrade({
        title: title.trim(),
        description: description.trim(),
        giving: givingItems,
        wanting: wantingItems,
        isUrgent,
        expiryDays,
        tags: processedTags,
      });

      if (trade) {
        // Simulate some processing time
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Navigate back to home page
        navigate("/");
      } else {
        console.error("Failed to create trade");
      }
    } catch (error) {
      console.error("Error creating trade:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    // In a real app, this would open a preview modal
    console.log("Preview trade post");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container max-w-4xl py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-trading-primary to-trading-secondary bg-clip-text text-transparent">
              Create Trade Post
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Set up your trade offer and let others know what you're looking
              for. Be specific about your items and requirements.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-trading-primary/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-trading-primary">
                      1
                    </span>
                  </div>
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Trade Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Trading Legendary Sword for Epic Armor"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-sm text-muted-foreground">
                    Create a clear, descriptive title for your trade
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your trade in detail. Include any specific requirements, conditions, or additional information..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    {description.length}/500 characters
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Trade Expires In</Label>
                    <Select value={expiryDays} onValueChange={setExpiryDays}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Day</SelectItem>
                        <SelectItem value="3">3 Days</SelectItem>
                        <SelectItem value="7">7 Days</SelectItem>
                        <SelectItem value="14">14 Days</SelectItem>
                        <SelectItem value="30">30 Days</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="urgent"
                        className="flex items-center space-x-2"
                      >
                        <Zap className="h-4 w-4 text-trading-warning" />
                        <span>Mark as Urgent</span>
                      </Label>
                      <Switch
                        id="urgent"
                        checked={isUrgent}
                        onCheckedChange={setIsUrgent}
                      />
                    </div>
                    {isUrgent && (
                      <div className="flex items-start space-x-2 p-3 bg-trading-warning/10 border border-trading-warning/20 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-trading-warning mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-trading-warning">
                            Urgent Trade
                          </p>
                          <p className="text-muted-foreground">
                            Your post will be highlighted and appear higher in
                            search results
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-trading-primary/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-trading-primary">
                      2
                    </span>
                  </div>
                  <span>Select Items</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Giving Items */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold">
                      What you're giving
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {givingItems.length}/5 items
                    </Badge>
                  </div>
                  <ItemSelector
                    selectedItems={givingItems}
                    onItemsChange={setGivingItems}
                    maxItems={5}
                    placeholder="Select items you want to trade away"
                  />
                </div>

                <div className="flex items-center justify-center py-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-px bg-border flex-1" />
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-trading-gradient">
                      <ArrowRight className="h-5 w-5 text-white" />
                    </div>
                    <div className="h-px bg-border flex-1" />
                  </div>
                </div>

                {/* Wanting Items */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold">What you want</h3>
                    <Badge variant="outline" className="text-xs">
                      {wantingItems.length}/5 items
                    </Badge>
                  </div>
                  <ItemSelector
                    selectedItems={wantingItems}
                    onItemsChange={setWantingItems}
                    maxItems={5}
                    placeholder="Select items you want to receive"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-trading-primary/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-trading-primary">
                      3
                    </span>
                  </div>
                  <span>Additional Options</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tags" className="flex items-center space-x-2">
                    <Tag className="h-4 w-4" />
                    <span>Tags (optional)</span>
                  </Label>
                  <Input
                    id="tags"
                    placeholder="weapon, armor, rare, quick-trade (separated by commas)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Add tags to help others find your trade
                  </p>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreview}
                  disabled={!isFormValid}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={!isFormValid || isSubmitting}
                className="bg-trading-gradient hover:opacity-90"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent" />
                    Creating Trade...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Create Trade Post
                  </>
                )}
              </Button>
            </div>

            {/* Form Validation */}
            {!isFormValid && (
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <h4 className="font-medium text-destructive">
                        Please complete all required fields:
                      </h4>
                      <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                        {title.trim() === "" && <li>• Add a trade title</li>}
                        {description.trim() === "" && (
                          <li>• Add a description</li>
                        )}
                        {givingItems.length === 0 && (
                          <li>• Select at least one item you're giving</li>
                        )}
                        {wantingItems.length === 0 && (
                          <li>• Select at least one item you want</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateTrade;
