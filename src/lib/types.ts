export type ItemRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic";

export interface Item {
  id: string;
  name: string;
  rarity: ItemRarity;
  image: string;
  category: string;
  description?: string;
  value?: number;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  robloxId: string;
  joinDate: Date;
  isOnline: boolean;
  stats: {
    totalTrades: number;
    successfulTrades: number;
    rating: number;
    totalReviews: number;
  };
}

export interface TradePost {
  id: string;
  author: User;
  title: string;
  description: string;
  giving: Item[];
  wanting: Item[];
  status: "active" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  isUrgent?: boolean;
  tags?: string[];
}

export interface Trade {
  id: string;
  postId: string;
  trader1: User;
  trader2: User;
  trader1Items: Item[];
  trader2Items: Item[];
  status: "pending" | "accepted" | "completed" | "cancelled" | "disputed";
  createdAt: Date;
  completedAt?: Date;
  isSuccessful?: boolean;
  notes?: string;
}

export interface Review {
  id: string;
  tradeId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
  isVerified: boolean;
}

export interface TradeFilters {
  category?: string;
  rarity?: ItemRarity[];
  itemName?: string;
  username?: string;
  sortBy?: "newest" | "oldest" | "value" | "rating";
  showOnlyActive?: boolean;
}

export interface NotificationSettings {
  newTrades: boolean;
  tradeUpdates: boolean;
  reviews: boolean;
  marketing: boolean;
}

export interface UserProfile {
  user: User;
  trades: Trade[];
  reviews: Review[];
  settings: NotificationSettings;
}
