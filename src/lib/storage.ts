import { TradePost, User, Item } from "./types";
import { mockUsers } from "./mock-data";

// Simple in-memory storage for demo purposes
let trades: TradePost[] = [];
let currentUserId: string | null = null;
let notifications: Notification[] = [];

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "trade" | "review" | "system";
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// Auth functions
export const getCurrentUser = (): User | null => {
  if (!currentUserId) return null;
  return mockUsers.find((user) => user.id === currentUserId) || null;
};

export const login = (userId: string): User | null => {
  const user = mockUsers.find((u) => u.id === userId);
  if (user) {
    currentUserId = userId;
    // Add welcome notification
    addNotification(userId, {
      title: "Welcome back!",
      message: `Welcome back to TradeHub, ${user.displayName}!`,
      type: "system",
    });
    return user;
  }
  return null;
};

export const logout = (): void => {
  currentUserId = null;
};

export const isLoggedIn = (): boolean => {
  return currentUserId !== null;
};

// Trade functions
export const getAllTrades = (): TradePost[] => {
  return [...trades].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
};

export const createTrade = (tradeData: {
  title: string;
  description: string;
  giving: Item[];
  wanting: Item[];
  isUrgent?: boolean;
  expiryDays?: string;
  tags?: string[];
}): TradePost | null => {
  const user = getCurrentUser();
  if (!user) return null;

  const expiresAt =
    tradeData.expiryDays && tradeData.expiryDays !== "never"
      ? new Date(
          Date.now() + parseInt(tradeData.expiryDays) * 24 * 60 * 60 * 1000,
        )
      : undefined;

  const newTrade: TradePost = {
    id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    author: user,
    title: tradeData.title,
    description: tradeData.description,
    giving: tradeData.giving,
    wanting: tradeData.wanting,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
    expiresAt,
    isUrgent: tradeData.isUrgent || false,
    tags: tradeData.tags || [],
  };

  trades.push(newTrade);

  // Notify other users about new trade
  mockUsers.forEach((otherUser) => {
    if (otherUser.id !== user.id) {
      addNotification(otherUser.id, {
        title: "New Trade Available!",
        message: `${user.displayName} posted a new trade: "${tradeData.title}"`,
        type: "trade",
        actionUrl: `/trade/${newTrade.id}`,
      });
    }
  });

  return newTrade;
};

export const getUserTrades = (userId?: string): TradePost[] => {
  const targetUserId = userId || currentUserId;
  if (!targetUserId) return [];

  return trades.filter((trade) => trade.author.id === targetUserId);
};

// Notification functions
export const addNotification = (
  userId: string,
  notificationData: {
    title: string;
    message: string;
    type: "trade" | "review" | "system";
    actionUrl?: string;
  },
): void => {
  const notification: Notification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    ...notificationData,
    isRead: false,
    createdAt: new Date(),
  };

  notifications.push(notification);
};

export const getUserNotifications = (userId?: string): Notification[] => {
  const targetUserId = userId || currentUserId;
  if (!targetUserId) return [];

  return notifications
    .filter((notif) => notif.userId === targetUserId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getUnreadNotificationCount = (userId?: string): number => {
  const targetUserId = userId || currentUserId;
  if (!targetUserId) return 0;

  return notifications.filter(
    (notif) => notif.userId === targetUserId && !notif.isRead,
  ).length;
};

export const markNotificationAsRead = (notificationId: string): void => {
  const notification = notifications.find((n) => n.id === notificationId);
  if (notification) {
    notification.isRead = true;
  }
};

export const markAllNotificationsAsRead = (userId?: string): void => {
  const targetUserId = userId || currentUserId;
  if (!targetUserId) return;

  notifications.forEach((notif) => {
    if (notif.userId === targetUserId) {
      notif.isRead = true;
    }
  });
};

// Initialize with some sample trades and notifications for demo
export const initializeStorage = (): void => {
  // Start with user 1 logged in
  login("1");

  // Add some sample trades
  createTrade({
    title: "Trading Mythical Dragon Fruit for Divine Items",
    description:
      "Looking to upgrade my Dragon Fruit to something divine. Will consider multiple divine items!",
    giving: [
      {
        id: "29",
        name: "Dragon Fruit",
        rarity: "mythical",
        image: "/placeholder.svg",
        category: "Fruits",
        value: 750,
      },
    ],
    wanting: [
      {
        id: "40",
        name: "Grape",
        rarity: "divine",
        image: "/placeholder.svg",
        category: "Fruits",
        value: 1200,
      },
      {
        id: "43",
        name: "Cacao",
        rarity: "divine",
        image: "/placeholder.svg",
        category: "Seeds",
        value: 1400,
      },
    ],
    isUrgent: true,
    expiryDays: "7",
    tags: ["mythical", "divine", "fruit", "upgrade"],
  });

  // Switch to user 2 and add their trade
  login("2");
  createTrade({
    title: "Legendary Bundle for Mythical Items",
    description:
      "Trading multiple legendary plants for any mythical fruits. Great deal for collectors!",
    giving: [
      {
        id: "19",
        name: "Watermelon",
        rarity: "legendary",
        image: "/placeholder.svg",
        category: "Fruits",
        value: 300,
      },
      {
        id: "22",
        name: "Bamboo",
        rarity: "legendary",
        image: "/placeholder.svg",
        category: "Plants",
        value: 350,
      },
      {
        id: "24",
        name: "Lumira",
        rarity: "legendary",
        image: "/placeholder.svg",
        category: "Flowers",
        value: 400,
      },
    ],
    wanting: [
      {
        id: "29",
        name: "Dragon Fruit",
        rarity: "mythical",
        image: "/placeholder.svg",
        category: "Fruits",
        value: 750,
      },
      {
        id: "31",
        name: "Mango",
        rarity: "mythical",
        image: "/placeholder.svg",
        category: "Fruits",
        value: 680,
      },
    ],
    expiryDays: "14",
    tags: ["legendary", "mythical", "bundle", "collector"],
  });

  // Back to user 1
  login("1");
};
