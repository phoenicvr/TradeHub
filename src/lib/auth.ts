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

// In-memory user storage (in production, this would be a database)
let users: StoredUser[] = [];
let currentUserId: string | null = null;

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
  return !users.some(
    (user) => user.username.toLowerCase() === username.toLowerCase(),
  );
}

// Check if email is available
export function isEmailAvailable(email: string): boolean {
  return !users.some(
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
      rating: 5.0,
      totalReviews: 0,
    },
  };

  users.push(newUser);

  // Auto-login the new user
  currentUserId = userId;

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
  user.isOnline = true;

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
  if (!currentUserId) return null;

  const user = users.find((u) => u.id === currentUserId);
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
  if (currentUserId) {
    const user = users.find((u) => u.id === currentUserId);
    if (user) {
      user.isOnline = false;
    }
  }
  currentUserId = null;
}

// Check if user is logged in
export function isLoggedIn(): boolean {
  return currentUserId !== null;
}

// Get all users (for admin purposes or user lists)
export function getAllUsers(): User[] {
  return users.map((user) => ({
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
  const user = users.find((u) => u.id === userId);
  if (user) {
    user.stats = { ...user.stats, ...updates };
  }
}

// Initialize with some demo accounts for testing
export function initializeAuth(): void {
  // Clear existing data
  users = [];
  currentUserId = null;

  // Create a demo admin account
  const adminUser: StoredUser = {
    id: "admin_123",
    username: "admin",
    displayName: "TradeHub Admin",
    email: "admin@tradehub.com",
    passwordHash: simpleHash("admin123"),
    avatar: "/placeholder.svg",
    robloxId: "roblox_admin",
    joinDate: new Date("2024-01-01"),
    isOnline: false,
    stats: {
      totalTrades: 500,
      successfulTrades: 485,
      rating: 4.9,
      totalReviews: 234,
    },
  };

  users.push(adminUser);
}
