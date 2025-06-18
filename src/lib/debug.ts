// Debug utilities for localStorage management

export function clearAllData(): void {
  localStorage.removeItem("tradehub_users");
  localStorage.removeItem("tradehub_current_user");
  localStorage.removeItem("tradehub_trades");
  localStorage.removeItem("tradehub_notifications");
  localStorage.removeItem("tradehub_global_trades"); // New shared trades storage
  console.log("All TradeHub data cleared from localStorage");
}

export function exportData(): void {
  const data = {
    users: localStorage.getItem("tradehub_users"),
    currentUser: localStorage.getItem("tradehub_current_user"),
    personalTrades: localStorage.getItem("tradehub_trades"),
    sharedTrades: localStorage.getItem("tradehub_global_trades"),
    notifications: localStorage.getItem("tradehub_notifications"),
  };
  console.log("TradeHub Data:", data);
  return data;
}

export function getStorageInfo(): void {
  const users = localStorage.getItem("tradehub_users");
  const currentUser = localStorage.getItem("tradehub_current_user");
  const personalTrades = localStorage.getItem("tradehub_trades");
  const sharedTrades = localStorage.getItem("tradehub_global_trades");
  const notifications = localStorage.getItem("tradehub_notifications");

  console.log("Storage Info:");
  console.log("- Users:", users ? JSON.parse(users).length : 0);
  console.log("- Current User:", currentUser || "None");
  console.log(
    "- Personal Trades:",
    personalTrades ? JSON.parse(personalTrades).length : 0,
  );
  console.log(
    "- Shared Trades:",
    sharedTrades ? JSON.parse(sharedTrades).length : 0,
  );
  console.log(
    "- Notifications:",
    notifications ? JSON.parse(notifications).length : 0,
  );
}

// Make these available globally for debugging
if (typeof window !== "undefined") {
  (window as any).tradeHubDebug = {
    clearAllData,
    exportData,
    getStorageInfo,
  };
}
