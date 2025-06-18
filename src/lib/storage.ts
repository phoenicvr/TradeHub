import { TradePost, User, Item } from "./types";
import { getCurrentUserSync, isLoggedIn as checkAuth } from "./auth";
import { tradesAPI, notificationsAPI } from "./api";

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
  return getCurrentUserSync();
};

export const isLoggedIn = (): boolean => {
  return checkAuth();
};

// Trade functions
export const getAllTrades = async (): Promise<TradePost[]> => {
  try {
    const response = await tradesAPI.getAllTrades();
    if (response.success) {
      return response.trades.map((trade: any) => ({
        ...trade,
        createdAt: new Date(trade.createdAt),
        updatedAt: new Date(trade.updatedAt),
        expiresAt: trade.expiresAt ? new Date(trade.expiresAt) : undefined,
        author: {
          ...trade.author,
          joinDate: new Date(trade.author.joinDate),
        },
      }));
    }
  } catch (error) {
    console.error("Error fetching trades:", error);
  }
  return [];
};

export const createTrade = async (tradeData: {
  title: string;
  description: string;
  giving: Item[];
  wanting: Item[];
  isUrgent?: boolean;
  expiryDays?: string;
  tags?: string[];
}): Promise<TradePost | null> => {
  const user = getCurrentUser();
  if (!user) return null;

  try {
    const response = await tradesAPI.createTrade(tradeData);
    if (response.success && response.trade) {
      const trade: TradePost = {
        ...response.trade,
        createdAt: new Date(response.trade.createdAt),
        updatedAt: new Date(response.trade.updatedAt),
        expiresAt: response.trade.expiresAt
          ? new Date(response.trade.expiresAt)
          : undefined,
        author: {
          ...response.trade.author,
          joinDate: new Date(response.trade.author.joinDate),
        },
      };

      console.log("Trade created:", trade.id, "by user:", user.username);
      return trade;
    }
  } catch (error) {
    console.error("Error creating trade:", error);
  }

  return null;
};

export const getUserTrades = async (userId?: string): Promise<TradePost[]> => {
  const currentUser = getCurrentUser();
  const targetUserId = userId || currentUser?.id;
  if (!targetUserId) return [];

  try {
    const response = await tradesAPI.getUserTrades(targetUserId);
    if (response.success) {
      return response.trades.map((trade: any) => ({
        ...trade,
        createdAt: new Date(trade.createdAt),
        updatedAt: new Date(trade.updatedAt),
        expiresAt: trade.expiresAt ? new Date(trade.expiresAt) : undefined,
        author: {
          ...trade.author,
          joinDate: new Date(trade.author.joinDate),
        },
      }));
    }
  } catch (error) {
    console.error("Error fetching user trades:", error);
  }

  return [];
};

// Notification functions
export const addNotification = async (
  userId: string,
  notificationData: {
    title: string;
    message: string;
    type: "trade" | "review" | "system";
    actionUrl?: string;
  },
): Promise<void> => {
  try {
    await notificationsAPI.addNotification({
      userId,
      ...notificationData,
    });
  } catch (error) {
    console.error("Error adding notification:", error);
  }
};

export const getUserNotifications = async (
  userId?: string,
): Promise<Notification[]> => {
  const currentUser = getCurrentUser();
  const targetUserId = userId || currentUser?.id;
  if (!targetUserId) return [];

  try {
    const response = await notificationsAPI.getUserNotifications();
    if (response.success) {
      return response.notifications.map((notif: any) => ({
        ...notif,
        createdAt: new Date(notif.createdAt),
      }));
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }

  return [];
};

export const getUnreadNotificationCount = async (
  userId?: string,
): Promise<number> => {
  const currentUser = getCurrentUser();
  const targetUserId = userId || currentUser?.id;
  if (!targetUserId) return 0;

  try {
    const response = await notificationsAPI.getUnreadCount();
    if (response.success) {
      return response.count;
    }
  } catch (error) {
    console.error("Error fetching unread count:", error);
  }

  return 0;
};

export const markNotificationAsRead = async (
  notificationId: string,
): Promise<void> => {
  try {
    await notificationsAPI.markAsRead(notificationId);
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

export const markAllNotificationsAsRead = async (
  userId?: string,
): Promise<void> => {
  try {
    await notificationsAPI.markAllAsRead();
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
  }
};

// Initialize storage - now uses backend API
export const initializeStorage = (): void => {
  console.log("Storage initialized with backend API");
};
