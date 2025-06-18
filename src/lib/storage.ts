import { TradePost, User, Item } from "./types";
import { getCurrentUser as getAuthUser, isLoggedIn as checkAuth } from "./auth";

// Simple in-memory storage for demo purposes
let trades: TradePost[] = [];
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

// Auth functions - now use the real auth system
export const getCurrentUser = (): User | null => {
  return getAuthUser();
};

export const isLoggedIn = (): boolean => {
  return checkAuth();
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

  // For now, skip notifying other users since we don't have a user list
  // In a real app, this would notify relevant users based on their interests

  return newTrade;
};

export const getUserTrades = (userId?: string): TradePost[] => {
  const currentUser = getCurrentUser();
  const targetUserId = userId || currentUser?.id;
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
  const currentUser = getCurrentUser();
  const targetUserId = userId || currentUser?.id;
  if (!targetUserId) return [];

  return notifications
    .filter((notif) => notif.userId === targetUserId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getUnreadNotificationCount = (userId?: string): number => {
  const currentUser = getCurrentUser();
  const targetUserId = userId || currentUser?.id;
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
  const currentUser = getCurrentUser();
  const targetUserId = userId || currentUser?.id;
  if (!targetUserId) return;

  notifications.forEach((notif) => {
    if (notif.userId === targetUserId) {
      notif.isRead = true;
    }
  });
};

// Initialize storage - clean start
export const initializeStorage = (): void => {
  // Just ensure storage is ready, no pre-populated data
  trades = [];
  notifications = [];
};
