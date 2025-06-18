// Debug utilities for localStorage management

export function clearAllData(): void {
  localStorage.removeItem("tradehub_users");
  localStorage.removeItem("tradehub_current_user");
  localStorage.removeItem("tradehub_trades");
  localStorage.removeItem("tradehub_notifications");
  localStorage.removeItem("tradehub_global_trades"); // Shared trades storage
  localStorage.removeItem("tradehub_global_users"); // Shared users storage
  console.log("All TradeHub data cleared from localStorage");
}

export function exportData(): void {
  const data = {
    personalUsers: localStorage.getItem("tradehub_users"),
    sharedUsers: localStorage.getItem("tradehub_global_users"),
    currentUser: localStorage.getItem("tradehub_current_user"),
    personalTrades: localStorage.getItem("tradehub_trades"),
    sharedTrades: localStorage.getItem("tradehub_global_trades"),
    notifications: localStorage.getItem("tradehub_notifications"),
  };
  console.log("TradeHub Data:", data);
  return data;
}

export function getStorageInfo(): void {
  const personalUsers = localStorage.getItem("tradehub_users");
  const sharedUsers = localStorage.getItem("tradehub_global_users");
  const currentUser = localStorage.getItem("tradehub_current_user");
  const personalTrades = localStorage.getItem("tradehub_trades");
  const sharedTrades = localStorage.getItem("tradehub_global_trades");
  const notifications = localStorage.getItem("tradehub_notifications");

  console.log("Storage Info:");
  console.log(
    "- Personal Users:",
    personalUsers ? JSON.parse(personalUsers).length : 0,
  );
  console.log(
    "- Shared Users:",
    sharedUsers ? JSON.parse(sharedUsers).length : 0,
  );
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
