import { User } from "./types";

// Simple hash function for demo purposes (in production, use bcrypt or similar)
function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(16);
}

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

// LocalStorage keys
const USERS_STORAGE_KEY = "tradehub_users";
const CURRENT_USER_STORAGE_KEY = "tradehub_current_user";

// Get users from localStorage
function getStoredUsers(): StoredUser[] {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored).map((user: any) => ({
        ...user,
        joinDate: new Date(user.joinDate),
      }));
    }
  } catch (error) {
    console.error("Error loading users from localStorage:", error);
  }
  return [];
}

// Save users to localStorage
function saveUsers(users: StoredUser[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Error saving users to localStorage:", error);
  }
}

// Get current user ID from localStorage
function getCurrentUserId(): string | null {
  try {
    return localStorage.getItem(CURRENT_USER_STORAGE_KEY);
  } catch (error) {
    console.error("Error loading current user from localStorage:", error);
    return null;
  }
}

// Save current user ID to localStorage
function setCurrentUserId(userId: string | null): void {
  try {
    if (userId) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, userId);
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  } catch (error) {
    console.error("Error saving current user to localStorage:", error);
  }
}

// Initialize from localStorage
let users: StoredUser[] = getStoredUsers();
let currentUserId: string | null = getCurrentUserId();

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

// Check if username is available
export function isUsernameAvailable(username: string): boolean {
  const currentUsers = getStoredUsers();
  return !currentUsers.some(
    (user) => user.username.toLowerCase() === username.toLowerCase(),
  );
}

// Check if email is available
export function isEmailAvailable(email: string): boolean {
  const currentUsers = getStoredUsers();
  return !currentUsers.some(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );
}

// Register a new user
export function registerUser(data: RegisterData): AuthResult {
  // Validate input
  if (!data.username || data.username.length < 3) {
    return {
      success: false,
      message: "Username must be at least 3 characters long",
    };
  }

  if (!data.displayName || data.displayName.length < 2) {
    return {
      success: false,
      message: "Display name must be at least 2 characters long",
    };
  }

  if (!data.email || !data.email.includes("@")) {
    return { success: false, message: "Please enter a valid email address" };
  }

  if (!data.password || data.password.length < 6) {
    return {
      success: false,
      message: "Password must be at least 6 characters long",
    };
  }

  if (data.password !== data.confirmPassword) {
    return { success: false, message: "Passwords do not match" };
  }

  // Check if username is taken
  if (!isUsernameAvailable(data.username)) {
    return { success: false, message: "Username is already taken" };
  }

  // Check if email is taken
  if (!isEmailAvailable(data.email)) {
    return { success: false, message: "Email is already registered" };
  }

  // Create new user
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const passwordHash = simpleHash(data.password);

  const newUser: StoredUser = {
    id: userId,
    username: data.username,
    displayName: data.displayName,
    email: data.email,
    passwordHash,
    avatar: `/placeholder.svg`,
    robloxId: `roblox_${userId}`,
    joinDate: new Date(),
    isOnline: true,
    stats: {
      totalTrades: 0,
      successfulTrades: 0,
      rating: 0,
      totalReviews: 0,
    },
  };

  users = getStoredUsers();
  users.push(newUser);
  saveUsers(users);

  // Auto-login the new user
  currentUserId = userId;
  setCurrentUserId(userId);

  // Convert to public user format
  const publicUser: User = {
    id: newUser.id,
    username: newUser.username,
    displayName: newUser.displayName,
    avatar: newUser.avatar,
    robloxId: newUser.robloxId,
    joinDate: newUser.joinDate,
    isOnline: newUser.isOnline,
    stats: newUser.stats,
  };

  return {
    success: true,
    message: "Account created successfully!",
    user: publicUser,
  };
}

// Login user
export function loginUser(data: LoginData): AuthResult {
  if (!data.username || !data.password) {
    return {
      success: false,
      message: "Please enter both username and password",
    };
  }

  // Find user
  users = getStoredUsers();
  const user = users.find(
    (u) => u.username.toLowerCase() === data.username.toLowerCase(),
  );
  if (!user) {
    return { success: false, message: "Invalid username or password" };
  }

  // Check password
  const passwordHash = simpleHash(data.password);
  if (passwordHash !== user.passwordHash) {
    return { success: false, message: "Invalid username or password" };
  }

  // Login successful
  currentUserId = user.id;
  setCurrentUserId(user.id);
  user.isOnline = true;
  saveUsers(users);

  // Convert to public user format
  const publicUser: User = {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    avatar: user.avatar,
    robloxId: user.robloxId,
    joinDate: user.joinDate,
    isOnline: user.isOnline,
    stats: user.stats,
  };

  return {
    success: true,
    message: "Login successful!",
    user: publicUser,
  };
}

// Get current user
export function getCurrentUser(): User | null {
  const userId = getCurrentUserId();
  if (!userId) return null;

  const currentUsers = getStoredUsers();
  const user = currentUsers.find((u) => u.id === userId);
  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    avatar: user.avatar,
    robloxId: user.robloxId,
    joinDate: user.joinDate,
    isOnline: user.isOnline,
    stats: user.stats,
  };
}

// Logout user
export function logoutUser(): void {
  const userId = getCurrentUserId();
  if (userId) {
    const currentUsers = getStoredUsers();
    const user = currentUsers.find((u) => u.id === userId);
    if (user) {
      user.isOnline = false;
      saveUsers(currentUsers);
    }
  }
  currentUserId = null;
  setCurrentUserId(null);
}

// Check if user is logged in
export function isLoggedIn(): boolean {
  return getCurrentUserId() !== null;
}

// Get all users (for admin purposes or user lists)
export function getAllUsers(): User[] {
  const currentUsers = getStoredUsers();
  return currentUsers.map((user) => ({
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    avatar: user.avatar,
    robloxId: user.robloxId,
    joinDate: user.joinDate,
    isOnline: user.isOnline,
    stats: user.stats,
  }));
}

// Update user stats (for trading activities)
export function updateUserStats(
  userId: string,
  updates: Partial<User["stats"]>,
): void {
  const currentUsers = getStoredUsers();
  const user = currentUsers.find((u) => u.id === userId);
  if (user) {
    user.stats = { ...user.stats, ...updates };
    saveUsers(currentUsers);
  }
}

// Initialize with some demo accounts for testing
export function initializeAuth(): void {
  // Load existing users from localStorage
  users = getStoredUsers();
  currentUserId = getCurrentUserId();

  // No pre-created accounts - users must register themselves
}
