import { TradePost, User, Item } from "./types";
import { getCurrentUser as getAuthUser, isLoggedIn as checkAuth } from "./auth";

// LocalStorage keys
const TRADES_STORAGE_KEY = "tradehub_trades";
const NOTIFICATIONS_STORAGE_KEY = "tradehub_notifications";

// Get trades from localStorage
function getStoredTrades(): TradePost[] {
  try {
    const stored = localStorage.getItem(TRADES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored).map((trade: any) => ({
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
    console.error("Error loading trades from localStorage:", error);
  }
  return [];
}

// Save trades to localStorage
function saveTrades(trades: TradePost[]): void {
  try {
    localStorage.setItem(TRADES_STORAGE_KEY, JSON.stringify(trades));
  } catch (error) {
    console.error("Error saving trades to localStorage:", error);
  }
}

// Get notifications from localStorage
function getStoredNotifications(): Notification[] {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored).map((notif: any) => ({
        ...notif,
        createdAt: new Date(notif.createdAt),
      }));
    }
  } catch (error) {
    console.error("Error loading notifications from localStorage:", error);
  }
  return [];
}

// Save notifications to localStorage
function saveNotifications(notifications: Notification[]): void {
  try {
    localStorage.setItem(
      NOTIFICATIONS_STORAGE_KEY,
      JSON.stringify(notifications),
    );
  } catch (error) {
    console.error("Error saving notifications to localStorage:", error);
  }
}

// Initialize from localStorage
let trades: TradePost[] = getStoredTrades();
let notifications: Notification[] = getStoredNotifications();

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
  // Always get fresh data from localStorage
  const currentTrades = getStoredTrades();
  console.log("Total trades in storage:", currentTrades.length);
  return [...currentTrades].sort(
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

  // Get current trades from storage
  const currentTrades = getStoredTrades();
  currentTrades.push(newTrade);
  saveTrades(currentTrades);

  console.log("Trade created:", newTrade.id, "by user:", user.username);
  console.log("Total trades after creation:", currentTrades.length);

  // Update the local trades variable for consistency
  trades = currentTrades;

  // Add a notification for the user who created the trade
  addNotification(user.id, {
    title: "Trade Posted Successfully!",
    message: `Your trade "${tradeData.title}" is now live and visible to other traders.`,
    type: "system",
  });

  return newTrade;
};

export const getUserTrades = (userId?: string): TradePost[] => {
  const currentUser = getCurrentUser();
  const targetUserId = userId || currentUser?.id;
  if (!targetUserId) return [];

  const currentTrades = getStoredTrades();
  return currentTrades.filter((trade) => trade.author.id === targetUserId);
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

  notifications = getStoredNotifications();
  notifications.push(notification);
  saveNotifications(notifications);
};

export const getUserNotifications = (userId?: string): Notification[] => {
  const currentUser = getCurrentUser();
  const targetUserId = userId || currentUser?.id;
  if (!targetUserId) return [];

  const currentNotifications = getStoredNotifications();
  return currentNotifications
    .filter((notif) => notif.userId === targetUserId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getUnreadNotificationCount = (userId?: string): number => {
  const currentUser = getCurrentUser();
  const targetUserId = userId || currentUser?.id;
  if (!targetUserId) return 0;

  const currentNotifications = getStoredNotifications();
  return currentNotifications.filter(
    (notif) => notif.userId === targetUserId && !notif.isRead,
  ).length;
};

export const markNotificationAsRead = (notificationId: string): void => {
  notifications = getStoredNotifications();
  const notification = notifications.find((n) => n.id === notificationId);
  if (notification) {
    notification.isRead = true;
    saveNotifications(notifications);
  }
};

export const markAllNotificationsAsRead = (userId?: string): void => {
  const currentUser = getCurrentUser();
  const targetUserId = userId || currentUser?.id;
  if (!targetUserId) return;

  notifications = getStoredNotifications();
  notifications.forEach((notif) => {
    if (notif.userId === targetUserId) {
      notif.isRead = true;
    }
  });
  saveNotifications(notifications);
};

// Initialize storage - load from localStorage
export const initializeStorage = (): void => {
  // Load existing data from localStorage
  trades = getStoredTrades();
  notifications = getStoredNotifications();
};
