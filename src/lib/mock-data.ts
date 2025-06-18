import { Item, User, TradePost, ItemRarity } from "./types";

// Mock items with different rarities
export const mockItems: Item[] = [
  // Common items
  {
    id: "1",
    name: "Wooden Sword",
    rarity: "common",
    image: "/placeholder.svg",
    category: "Weapons",
    description: "A basic wooden sword for beginners",
    value: 10,
  },
  {
    id: "2",
    name: "Leather Boots",
    rarity: "common",
    image: "/placeholder.svg",
    category: "Armor",
    description: "Simple leather boots for protection",
    value: 15,
  },
  {
    id: "3",
    name: "Health Potion",
    rarity: "common",
    image: "/placeholder.svg",
    category: "Consumables",
    description: "Restores a small amount of health",
    value: 5,
  },
  // Uncommon items
  {
    id: "4",
    name: "Iron Sword",
    rarity: "uncommon",
    image: "/placeholder.svg",
    category: "Weapons",
    description: "A sturdy iron sword with decent damage",
    value: 50,
  },
  {
    id: "5",
    name: "Chain Mail",
    rarity: "uncommon",
    image: "/placeholder.svg",
    category: "Armor",
    description: "Protective chain mail armor",
    value: 75,
  },
  {
    id: "6",
    name: "Speed Boots",
    rarity: "uncommon",
    image: "/placeholder.svg",
    category: "Armor",
    description: "Boots that increase movement speed",
    value: 60,
  },
  // Rare items
  {
    id: "7",
    name: "Crystal Blade",
    rarity: "rare",
    image: "/placeholder.svg",
    category: "Weapons",
    description: "A magical blade infused with crystal power",
    value: 200,
  },
  {
    id: "8",
    name: "Mage Robes",
    rarity: "rare",
    image: "/placeholder.svg",
    category: "Armor",
    description: "Robes that enhance magical abilities",
    value: 180,
  },
  {
    id: "9",
    name: "Phoenix Feather",
    rarity: "rare",
    image: "/placeholder.svg",
    category: "Materials",
    description: "A rare feather with resurrection properties",
    value: 250,
  },
  // Epic items
  {
    id: "10",
    name: "Dragon Slayer",
    rarity: "epic",
    image: "/placeholder.svg",
    category: "Weapons",
    description: "A legendary sword capable of slaying dragons",
    value: 500,
  },
  {
    id: "11",
    name: "Shadow Cloak",
    rarity: "epic",
    image: "/placeholder.svg",
    category: "Armor",
    description: "A cloak that grants invisibility",
    value: 450,
  },
  {
    id: "12",
    name: "Time Crystal",
    rarity: "epic",
    image: "/placeholder.svg",
    category: "Materials",
    description: "A crystal that can manipulate time",
    value: 600,
  },
  // Legendary items
  {
    id: "13",
    name: "Excalibur",
    rarity: "legendary",
    image: "/placeholder.svg",
    category: "Weapons",
    description: "The legendary sword of kings",
    value: 1000,
  },
  {
    id: "14",
    name: "Crown of Gods",
    rarity: "legendary",
    image: "/placeholder.svg",
    category: "Armor",
    description: "A crown blessed by the gods themselves",
    value: 1200,
  },
  {
    id: "15",
    name: "Orb of Eternity",
    rarity: "legendary",
    image: "/placeholder.svg",
    category: "Materials",
    description: "An orb containing the power of eternity",
    value: 1500,
  },
  // Mythic items
  {
    id: "16",
    name: "World Ender",
    rarity: "mythic",
    image: "/placeholder.svg",
    category: "Weapons",
    description: "A weapon capable of ending worlds",
    value: 5000,
  },
  {
    id: "17",
    name: "Universe Armor",
    rarity: "mythic",
    image: "/placeholder.svg",
    category: "Armor",
    description: "Armor forged from the fabric of space itself",
    value: 4500,
  },
  {
    id: "18",
    name: "Genesis Stone",
    rarity: "mythic",
    image: "/placeholder.svg",
    category: "Materials",
    description: "The stone that created all existence",
    value: 10000,
  },
];

// Mock users
export const mockUsers: User[] = [
  {
    id: "1",
    username: "DragonSlayer99",
    displayName: "Dragon Slayer",
    avatar: "/placeholder.svg",
    robloxId: "roblox_123456",
    joinDate: new Date("2023-01-15"),
    isOnline: true,
    stats: {
      totalTrades: 156,
      successfulTrades: 142,
      rating: 4.8,
      totalReviews: 89,
    },
  },
  {
    id: "2",
    username: "MagicCollector",
    displayName: "Magic Collector",
    avatar: "/placeholder.svg",
    robloxId: "roblox_789012",
    joinDate: new Date("2023-03-22"),
    isOnline: false,
    stats: {
      totalTrades: 73,
      successfulTrades: 68,
      rating: 4.6,
      totalReviews: 45,
    },
  },
  {
    id: "3",
    username: "SwordMaster2024",
    displayName: "Sword Master",
    avatar: "/placeholder.svg",
    robloxId: "roblox_345678",
    joinDate: new Date("2024-01-10"),
    isOnline: true,
    stats: {
      totalTrades: 234,
      successfulTrades: 218,
      rating: 4.9,
      totalReviews: 167,
    },
  },
  {
    id: "4",
    username: "NoobTrader",
    displayName: "Rookie Trader",
    avatar: "/placeholder.svg",
    robloxId: "roblox_901234",
    joinDate: new Date("2024-02-01"),
    isOnline: true,
    stats: {
      totalTrades: 12,
      successfulTrades: 10,
      rating: 4.2,
      totalReviews: 8,
    },
  },
  {
    id: "5",
    username: "LegendHunter",
    displayName: "Legend Hunter",
    avatar: "/placeholder.svg",
    robloxId: "roblox_567890",
    joinDate: new Date("2023-06-15"),
    isOnline: false,
    stats: {
      totalTrades: 89,
      successfulTrades: 82,
      rating: 4.7,
      totalReviews: 56,
    },
  },
];

// Mock trade posts
export const mockTradePosts: TradePost[] = [
  {
    id: "1",
    author: mockUsers[0],
    title: "Trading Epic Dragon Slayer for Legendary Items",
    description:
      "Looking to upgrade my Dragon Slayer to something legendary. Willing to add more items if needed!",
    giving: [mockItems[9]], // Dragon Slayer
    wanting: [mockItems[12], mockItems[13]], // Excalibur or Crown of Gods
    status: "active",
    createdAt: new Date("2024-03-15T10:00:00Z"),
    updatedAt: new Date("2024-03-15T10:00:00Z"),
    isUrgent: true,
    tags: ["weapon", "upgrade", "legendary"],
  },
  {
    id: "2",
    author: mockUsers[1],
    title: "Crystal Blade + Phoenix Feather for Time Crystal",
    description:
      "Have rare magical items, looking for an epic time crystal to complete my collection.",
    giving: [mockItems[6], mockItems[8]], // Crystal Blade + Phoenix Feather
    wanting: [mockItems[11]], // Time Crystal
    status: "active",
    createdAt: new Date("2024-03-15T09:30:00Z"),
    updatedAt: new Date("2024-03-15T09:30:00Z"),
    tags: ["magic", "rare", "epic"],
  },
  {
    id: "3",
    author: mockUsers[2],
    title: "Multiple Rare Items for One Epic",
    description:
      "Trading 3 rare items for any epic weapon. Great deal for someone looking to get multiple rares!",
    giving: [mockItems[6], mockItems[7], mockItems[8]], // Crystal Blade + Mage Robes + Phoenix Feather
    wanting: [mockItems[9], mockItems[10]], // Any epic weapon
    status: "active",
    createdAt: new Date("2024-03-15T08:45:00Z"),
    updatedAt: new Date("2024-03-15T08:45:00Z"),
    tags: ["bulk", "epic", "weapon"],
  },
  {
    id: "4",
    author: mockUsers[3],
    title: "New Trader - Common Items for Uncommon",
    description:
      "Just started trading! Have some common items and looking to upgrade to uncommon ones.",
    giving: [mockItems[0], mockItems[1], mockItems[2]], // Wooden Sword + Leather Boots + Health Potion
    wanting: [mockItems[3]], // Iron Sword
    status: "active",
    createdAt: new Date("2024-03-15T12:00:00Z"),
    updatedAt: new Date("2024-03-15T12:00:00Z"),
    tags: ["beginner", "upgrade", "fair"],
  },
  {
    id: "5",
    author: mockUsers[4],
    title: "URGENT: Shadow Cloak for Crown of Gods",
    description:
      "Need Crown of Gods ASAP! Willing to trade my epic Shadow Cloak. Quick trade needed!",
    giving: [mockItems[10]], // Shadow Cloak
    wanting: [mockItems[13]], // Crown of Gods
    status: "active",
    createdAt: new Date("2024-03-15T11:15:00Z"),
    updatedAt: new Date("2024-03-15T11:15:00Z"),
    isUrgent: true,
    expiresAt: new Date("2024-03-16T11:15:00Z"),
    tags: ["urgent", "legendary", "1:1"],
  },
  {
    id: "6",
    author: mockUsers[1],
    title: "Speed Boots + Chain Mail Bundle",
    description:
      "Selling these uncommon armor pieces together. Looking for rare materials or weapons.",
    giving: [mockItems[4], mockItems[5]], // Chain Mail + Speed Boots
    wanting: [mockItems[8]], // Phoenix Feather
    status: "active",
    createdAt: new Date("2024-03-14T16:20:00Z"),
    updatedAt: new Date("2024-03-14T16:20:00Z"),
    tags: ["armor", "bundle", "uncommon"],
  },
];

export const getRarityColor = (rarity: ItemRarity): string => {
  const rarityColors = {
    common: "text-rarity-common",
    uncommon: "text-rarity-uncommon",
    rare: "text-rarity-rare",
    epic: "text-rarity-epic",
    legendary: "text-rarity-legendary",
    mythic: "text-rarity-mythic",
  };
  return rarityColors[rarity];
};

export const getRarityBorder = (rarity: ItemRarity): string => {
  const rarityBorders = {
    common: "border-rarity-common",
    uncommon: "border-rarity-uncommon",
    rare: "border-rarity-rare",
    epic: "border-rarity-epic",
    legendary: "border-rarity-legendary",
    mythic: "border-rarity-mythic",
  };
  return rarityBorders[rarity];
};

export const getRarityGradient = (rarity: ItemRarity): string => {
  const rarityGradients = {
    common: "bg-rarity-common",
    uncommon: "bg-rarity-uncommon",
    rare: "bg-rarity-rare",
    epic: "bg-rarity-epic",
    legendary: "bg-rarity-legendary",
    mythic: "bg-rarity-mythic",
  };
  return rarityGradients[rarity];
};
