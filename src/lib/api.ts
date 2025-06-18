// API client for backend communication

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Storage for auth token
let authToken: string | null = localStorage.getItem("tradehub_token");

// Set auth token
export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem("tradehub_token", token);
  } else {
    localStorage.removeItem("tradehub_token");
  }
}

// Get auth headers
function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  return headers;
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Authentication API
export const authAPI = {
  async register(userData: {
    username: string;
    displayName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    const response = await apiRequest<{
      success: boolean;
      message: string;
      user?: any;
      token?: string;
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.success && response.token) {
      setAuthToken(response.token);
    }

    return response;
  },

  async login(credentials: { username: string; password: string }) {
    const response = await apiRequest<{
      success: boolean;
      message: string;
      user?: any;
      token?: string;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.success && response.token) {
      setAuthToken(response.token);
    }

    return response;
  },

  async getCurrentUser() {
    return await apiRequest<{
      success: boolean;
      user?: any;
    }>("/auth/me");
  },

  async logout() {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      });
    } finally {
      setAuthToken(null);
    }
  },
};

// Users API
export const usersAPI = {
  async getAllUsers() {
    return await apiRequest<{
      success: boolean;
      users: any[];
    }>("/users");
  },

  async getUserById(userId: string) {
    return await apiRequest<{
      success: boolean;
      user: any;
    }>(`/users/${userId}`);
  },

  async updateUserStats(userId: string, stats: any) {
    return await apiRequest<{
      success: boolean;
      user: any;
    }>(`/users/${userId}/stats`, {
      method: "PATCH",
      body: JSON.stringify(stats),
    });
  },
};

// Trades API
export const tradesAPI = {
  async getAllTrades() {
    return await apiRequest<{
      success: boolean;
      trades: any[];
    }>("/trades");
  },

  async getUserTrades(userId: string) {
    return await apiRequest<{
      success: boolean;
      trades: any[];
    }>(`/trades/user/${userId}`);
  },

  async createTrade(tradeData: {
    title: string;
    description: string;
    giving: any[];
    wanting: any[];
    isUrgent?: boolean;
    expiryDays?: string;
    tags?: string[];
  }) {
    return await apiRequest<{
      success: boolean;
      trade: any;
      message: string;
    }>("/trades", {
      method: "POST",
      body: JSON.stringify(tradeData),
    });
  },
};

// Notifications API
export const notificationsAPI = {
  async getUserNotifications() {
    return await apiRequest<{
      success: boolean;
      notifications: any[];
    }>("/notifications");
  },

  async getUnreadCount() {
    return await apiRequest<{
      success: boolean;
      count: number;
    }>("/notifications/unread-count");
  },

  async markAsRead(notificationId: string) {
    return await apiRequest(`/notifications/${notificationId}/read`, {
      method: "PATCH",
    });
  },

  async markAllAsRead() {
    return await apiRequest("/notifications/read-all", {
      method: "PATCH",
    });
  },

  async addNotification(notificationData: {
    userId: string;
    title: string;
    message: string;
    type: string;
    actionUrl?: string;
  }) {
    return await apiRequest("/notifications", {
      method: "POST",
      body: JSON.stringify(notificationData),
    });
  },
};

// Development API
export const devAPI = {
  async clearAllData() {
    return await apiRequest<{
      success: boolean;
      message: string;
    }>("/dev/clear-data", {
      method: "DELETE",
    });
  },

  async healthCheck() {
    return await apiRequest<{
      status: string;
      timestamp: string;
    }>("/health");
  },
};

// Initialize auth token on app start
export function initializeAPI() {
  const token = localStorage.getItem("tradehub_token");
  if (token) {
    setAuthToken(token);
  }
}
