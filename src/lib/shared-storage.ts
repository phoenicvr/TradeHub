import { TradePost } from "./types";

// For demo purposes, we'll simulate a shared database by using a global storage key
// In a real app, this would be a server API

const SHARED_TRADES_KEY = "tradehub_global_trades";

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
