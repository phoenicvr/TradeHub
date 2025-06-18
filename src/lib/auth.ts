import { User } from "./types";
import { authAPI, usersAPI, initializeAPI } from "./api";

// Cache for current user to avoid repeated API calls
let currentUserCache: User | null = null;

export interface RegisterData {
  username: string;
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: User;
}

// Check if username is available (placeholder - validation now happens on server)
export function isUsernameAvailable(username: string): boolean {
  // This is now handled server-side during registration
  return true;
}

// Check if email is available (placeholder - validation now happens on server)
export function isEmailAvailable(email: string): boolean {
  // This is now handled server-side during registration
  return true;
}

// Register a new user
export async function registerUser(data: RegisterData): Promise<AuthResult> {
  try {
    const response = await authAPI.register(data);

    if (response.success && response.user) {
      // Convert response dates to Date objects
      const user: User = {
        ...response.user,
        joinDate: new Date(response.user.joinDate),
      };

      // Cache the user
      currentUserCache = user;

      return {
        success: true,
        message: response.message,
        user,
      };
    }

    return {
      success: false,
      message: response.message,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Registration failed",
    };
  }
}

// Login user
export async function loginUser(data: LoginData): Promise<AuthResult> {
  try {
    const response = await authAPI.login(data);

    if (response.success && response.user) {
      // Convert response dates to Date objects
      const user: User = {
        ...response.user,
        joinDate: new Date(response.user.joinDate),
      };

      // Cache the user
      currentUserCache = user;

      return {
        success: true,
        message: response.message,
        user,
      };
    }

    return {
      success: false,
      message: response.message,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
    };
  }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  // Return cached user if available
  if (currentUserCache) {
    return currentUserCache;
  }

  try {
    const response = await authAPI.getCurrentUser();
    if (response.success && response.user) {
      const user: User = {
        ...response.user,
        joinDate: new Date(response.user.joinDate),
      };
      currentUserCache = user;
      return user;
    }
  } catch (error) {
    console.error("Get current user error:", error);
    // Clear invalid token if user not found
    currentUserCache = null;
  }

  return null;
}

// Get current user synchronously (for cases where we need immediate access)
export function getCurrentUserSync(): User | null {
  return currentUserCache;
}

// Logout user
export async function logoutUser(): Promise<void> {
  try {
    await authAPI.logout();
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    currentUserCache = null;
  }
}

// Check if user is logged in
export function isLoggedIn(): boolean {
  return localStorage.getItem("tradehub_token") !== null;
}

// Get all users (for admin purposes or user lists)
export async function getAllUsers(): Promise<User[]> {
  try {
    const response = await usersAPI.getAllUsers();
    if (response.success) {
      return response.users.map((user: any) => ({
        ...user,
        joinDate: new Date(user.joinDate),
      }));
    }
  } catch (error) {
    console.error("Get all users error:", error);
  }
  return [];
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const response = await usersAPI.getUserById(userId);
    if (response.success && response.user) {
      return {
        ...response.user,
        joinDate: new Date(response.user.joinDate),
      };
    }
  } catch (error) {
    console.error("Get user by ID error:", error);
  }
  return null;
}

// Update user stats (for trading activities)
export async function updateUserStats(
  userId: string,
  updates: Partial<User["stats"]>,
): Promise<void> {
  try {
    await usersAPI.updateUserStats(userId, updates);

    // Update cache if it's the current user
    if (currentUserCache && currentUserCache.id === userId) {
      currentUserCache.stats = { ...currentUserCache.stats, ...updates };
    }
  } catch (error) {
    console.error("Update user stats error:", error);
  }
}

// Initialize auth system
export function initializeAuth(): void {
  // Initialize API with existing token
  initializeAPI();

  // Try to load current user if token exists
  if (isLoggedIn()) {
    getCurrentUser().catch(() => {
      // Token is invalid, clear it
      currentUserCache = null;
    });
  }

  console.log("Auth initialized");
}
