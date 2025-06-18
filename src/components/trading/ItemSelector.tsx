import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search, X, Plus } from "lucide-react";
import { Item, ItemRarity } from "@/lib/types";
import { mockItems, getRarityColor, getRarityBorder } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface ItemSelectorProps {
  selectedItems: Item[];
  onItemsChange: (items: Item[]) => void;
  maxItems?: number;
  placeholder?: string;
}

export function ItemSelector({
  selectedItems,
  onItemsChange,
  maxItems = 5,
  placeholder = "Select items to trade",
}: ItemSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [isOpen, setIsOpen] = useState(false);

  const categories = Array.from(
    new Set(mockItems.map((item) => item.category)),
  );

  const rarities: ItemRarity[] = [
    "common",
    "uncommon",
    "rare",
    "epic",
    "legendary",
    "mythic",
  ];

  const filteredItems = mockItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesRarity =
      selectedRarity === "all" || item.rarity === selectedRarity;
    const notSelected = !selectedItems.find(
      (selected) => selected.id === item.id,
    );

    return matchesSearch && matchesCategory && matchesRarity && notSelected;
  });

  const handleItemSelect = (item: Item) => {
    if (selectedItems.length < maxItems) {
      onItemsChange([...selectedItems, item]);
    }
  };

  const handleItemRemove = (itemId: string) => {
    onItemsChange(selectedItems.filter((item) => item.id !== itemId));
  };

  return (
    <div className="space-y-4">
      {/* Selected Items */}
      <div>
        <Label className="text-sm font-medium">Selected Items</Label>
        <div className="mt-2 min-h-[100px] p-4 border border-border rounded-lg bg-muted/30">
          {selectedItems.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              {placeholder}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedItems.map((item) => (
                <Card
                  key={item.id}
                  className={cn(
                    "relative group hover:shadow-lg transition-all",
                    getRarityBorder(item.rarity),
                  )}
                >
                  <CardContent className="p-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleItemRemove(item.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <div className="text-center space-y-2">
                      <div className="h-12 w-12 mx-auto bg-muted rounded-lg flex items-center justify-center">
                        <span className="text-lg">📦</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm line-clamp-1">
                          {item.name}
                        </p>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            getRarityColor(item.rarity),
                            getRarityBorder(item.rarity),
                          )}
                        >
                          {item.rarity}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {selectedItems.length} / {maxItems} items selected
        </p>
      </div>

      {/* Add Items Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full"
        disabled={selectedItems.length >= maxItems}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Items ({selectedItems.length}/{maxItems})
      </Button>

      {/* Item Browser */}
      {isOpen && (
        <Card className="border-2 border-trading-primary/20">
          <CardContent className="p-4 space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search" className="text-sm">
                  Search
                </Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm">Category</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Rarity</Label>
                <Select
                  value={selectedRarity}
                  onValueChange={setSelectedRarity}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rarities</SelectItem>
                    {rarities.map((rarity) => (
                      <SelectItem key={rarity} value={rarity}>
                        <span
                          className={cn("capitalize", getRarityColor(rarity))}
                        >
                          {rarity}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Items Grid */}
            <ScrollArea className="h-96">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pr-4">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className={cn(
                      "cursor-pointer hover:shadow-lg transition-all group",
                      getRarityBorder(item.rarity),
                    )}
                    onClick={() => handleItemSelect(item)}
                  >
                    <CardContent className="p-3">
                      <div className="text-center space-y-2">
                        <div className="h-12 w-12 mx-auto bg-muted rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <span className="text-lg">📦</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm line-clamp-2">
                            {item.name}
                          </p>
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
                          {item.value && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Value: {item.value}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {filteredItems.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No items found matching your filters
                </div>
              )}
            </ScrollArea>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Done
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
