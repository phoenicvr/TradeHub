import { TradePost } from "./types";

// For demo purposes, we'll simulate a shared database by using global storage keys
// This allows all users on the same browser to see each other's trades and prevents duplicate usernames
// In a real app, this would be a server API with a proper database

const SHARED_TRADES_KEY = "tradehub_global_trades";
const SHARED_USERS_KEY = "tradehub_global_users";

// User storage interfaces (matching auth.ts)
interface StoredUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  passwordHash: string;
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

// Get all trades from shared storage (simulating a global database)
export function getSharedTrades(): TradePost[] {
  try {
    const stored = localStorage.getItem(SHARED_TRADES_KEY);
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
    console.error("Error loading shared trades:", error);
  }
  return [];
}

// Save trades to shared storage
export function saveSharedTrades(trades: TradePost[]): void {
  try {
    localStorage.setItem(SHARED_TRADES_KEY, JSON.stringify(trades));
    console.log("Saved", trades.length, "trades to shared storage");
  } catch (error) {
    console.error("Error saving shared trades:", error);
  }
}

// Add a trade to shared storage
export function addSharedTrade(trade: TradePost): void {
  const currentTrades = getSharedTrades();
  currentTrades.push(trade);
  saveSharedTrades(currentTrades);
}

// Get trades by user ID from shared storage
export function getSharedTradesByUser(userId: string): TradePost[] {
  const allTrades = getSharedTrades();
  return allTrades.filter((trade) => trade.author.id === userId);
}

// Get all users from shared storage (simulating a global user database)
export function getSharedUsers(): StoredUser[] {
  try {
    const stored = localStorage.getItem(SHARED_USERS_KEY);
    if (stored) {
      return JSON.parse(stored).map((user: any) => ({
        ...user,
        joinDate: new Date(user.joinDate),
      }));
    }
  } catch (error) {
    console.error("Error loading shared users:", error);
  }
  return [];
}

// Save users to shared storage
export function saveSharedUsers(users: StoredUser[]): void {
  try {
    localStorage.setItem(SHARED_USERS_KEY, JSON.stringify(users));
    console.log("Saved", users.length, "users to shared storage");
  } catch (error) {
    console.error("Error saving shared users:", error);
  }
}

// Add a user to shared storage
export function addSharedUser(user: StoredUser): void {
  const currentUsers = getSharedUsers();
  currentUsers.push(user);
  saveSharedUsers(currentUsers);
}

// Check if username exists in shared storage
export function isSharedUsernameAvailable(username: string): boolean {
  const users = getSharedUsers();
  return !users.some(
    (user) => user.username.toLowerCase() === username.toLowerCase(),
  );
}

// Check if email exists in shared storage
export function isSharedEmailAvailable(email: string): boolean {
  const users = getSharedUsers();
  return !users.some(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );
}

// Find user in shared storage
export function findSharedUser(username: string): StoredUser | null {
  const users = getSharedUsers();
  return (
    users.find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    ) || null
  );
}

// Update user in shared storage
export function updateSharedUser(
  userId: string,
  updates: Partial<StoredUser>,
): void {
  const users = getSharedUsers();
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates };
    saveSharedUsers(users);
  }
}

// Remove user's personal trades and migrate to shared storage
export function migratePersonalTradesToShared(): void {
  try {
    // Get any existing personal trades
    const personalTrades = localStorage.getItem("tradehub_trades");
    if (personalTrades) {
      const trades = JSON.parse(personalTrades).map((trade: any) => ({
        ...trade,
        createdAt: new Date(trade.createdAt),
        updatedAt: new Date(trade.updatedAt),
        expiresAt: trade.expiresAt ? new Date(trade.expiresAt) : undefined,
        author: {
          ...trade.author,
          joinDate: new Date(trade.author.joinDate),
        },
      }));

      // Add them to shared storage
      const sharedTrades = getSharedTrades();
      const mergedTrades = [...sharedTrades];

      trades.forEach((trade: TradePost) => {
        // Only add if not already in shared storage
        if (!mergedTrades.find((existing) => existing.id === trade.id)) {
          mergedTrades.push(trade);
        }
      });

      saveSharedTrades(mergedTrades);
      console.log(
        "Migrated",
        trades.length,
        "personal trades to shared storage",
      );
    }
  } catch (error) {
    console.error("Error migrating personal trades:", error);
  }
}

// Migrate personal users to shared storage
export function migratePersonalUsersToShared(): void {
  try {
    // Get any existing personal users
    const personalUsers = localStorage.getItem("tradehub_users");
    if (personalUsers) {
      const users = JSON.parse(personalUsers).map((user: any) => ({
        ...user,
        joinDate: new Date(user.joinDate),
      }));

      // Add them to shared storage
      const sharedUsers = getSharedUsers();
      const mergedUsers = [...sharedUsers];

      users.forEach((user: StoredUser) => {
        // Only add if not already in shared storage (check by username)
        if (
          !mergedUsers.find(
            (existing) =>
              existing.username.toLowerCase() === user.username.toLowerCase(),
          )
        ) {
          mergedUsers.push(user);
        }
      });

      saveSharedUsers(mergedUsers);
      console.log("Migrated", users.length, "personal users to shared storage");
    }
  } catch (error) {
    console.error("Error migrating personal users:", error);
  }
}
