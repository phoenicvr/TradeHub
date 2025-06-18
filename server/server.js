import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Middleware
app.use(cors());
app.use(express.json());

// Data directory setup
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const usersFile = path.join(dataDir, "users.json");
const tradesFile = path.join(dataDir, "trades.json");
const notificationsFile = path.join(dataDir, "notifications.json");

// Initialize data files
function initializeDataFiles() {
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([]));
  }
  if (!fs.existsSync(tradesFile)) {
    fs.writeFileSync(tradesFile, JSON.stringify([]));
  }
  if (!fs.existsSync(notificationsFile)) {
    fs.writeFileSync(notificationsFile, JSON.stringify([]));
  }
}

// Data access functions
function readUsers() {
  try {
    const data = fs.readFileSync(usersFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading users:", error);
    return [];
  }
}

function writeUsers(users) {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error writing users:", error);
  }
}

function readTrades() {
  try {
    const data = fs.readFileSync(tradesFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading trades:", error);
    return [];
  }
}

function writeTrades(trades) {
  try {
    fs.writeFileSync(tradesFile, JSON.stringify(trades, null, 2));
  } catch (error) {
    console.error("Error writing trades:", error);
  }
}

function readNotifications() {
  try {
    const data = fs.readFileSync(notificationsFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading notifications:", error);
    return [];
  }
}

function writeNotifications(notifications) {
  try {
    fs.writeFileSync(notificationsFile, JSON.stringify(notifications, null, 2));
  } catch (error) {
    console.error("Error writing notifications:", error);
  }
}

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }
    req.user = user;
    next();
  });
}

// Helper function to create user response (without sensitive data)
function createUserResponse(user) {
  const { passwordHash, ...userResponse } = user;
  return userResponse;
}

// AUTH ENDPOINTS

// Register endpoint
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, displayName, email, password, confirmPassword } =
      req.body;

    // Validation
    if (!username || username.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username must be at least 3 characters long",
      });
    }

    if (!displayName || displayName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Display name must be at least 2 characters long",
      });
    }

    if (!email || !email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const users = readUsers();

    // Check if username exists
    if (
      users.find((u) => u.username.toLowerCase() === username.toLowerCase())
    ) {
      return res.status(400).json({
        success: false,
        message: "Username is already taken",
      });
    }

    // Check if email exists
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const newUser = {
      id: userId,
      username,
      displayName,
      email,
      passwordHash: hashedPassword,
      avatar: "/placeholder.svg",
      robloxId: `roblox_${userId}`,
      joinDate: new Date().toISOString(),
      isOnline: true,
      stats: {
        totalTrades: 0,
        successfulTrades: 0,
        rating: 0,
        totalReviews: 0,
      },
    };

    users.push(newUser);
    writeUsers(users);

    // Create JWT token
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      message: "Account created successfully!",
      user: createUserResponse(newUser),
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
});

// Login endpoint
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter both username and password",
      });
    }

    const users = readUsers();
    const user = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase(),
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Update user online status
    user.isOnline = true;
    writeUsers(users);

    // Create JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      message: "Login successful!",
      user: createUserResponse(user),
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
});

// Get current user endpoint
app.get("/api/auth/me", authenticateToken, (req, res) => {
  try {
    const users = readUsers();
    const user = users.find((u) => u.id === req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: createUserResponse(user),
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Logout endpoint
app.post("/api/auth/logout", authenticateToken, (req, res) => {
  try {
    const users = readUsers();
    const userIndex = users.findIndex((u) => u.id === req.user.userId);

    if (userIndex !== -1) {
      users[userIndex].isOnline = false;
      writeUsers(users);
    }

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
});

// USER ENDPOINTS

// Get all users
app.get("/api/users", (req, res) => {
  try {
    const users = readUsers();
    const publicUsers = users.map(createUserResponse);
    res.json({ success: true, users: publicUsers });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Get user by ID
app.get("/api/users/:userId", (req, res) => {
  try {
    const users = readUsers();
    const user = users.find((u) => u.id === req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: createUserResponse(user),
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Update user stats
app.patch("/api/users/:userId/stats", authenticateToken, (req, res) => {
  try {
    const users = readUsers();
    const userIndex = users.findIndex((u) => u.id === req.params.userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    users[userIndex].stats = { ...users[userIndex].stats, ...req.body };
    writeUsers(users);

    res.json({
      success: true,
      user: createUserResponse(users[userIndex]),
    });
  } catch (error) {
    console.error("Update user stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// TRADE ENDPOINTS

// Get all trades
app.get("/api/trades", (req, res) => {
  try {
    const trades = readTrades();
    // Sort by creation date, newest first
    const sortedTrades = trades.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
    res.json({ success: true, trades: sortedTrades });
  } catch (error) {
    console.error("Get trades error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Get trades by user
app.get("/api/trades/user/:userId", (req, res) => {
  try {
    const trades = readTrades();
    const userTrades = trades.filter(
      (trade) => trade.author.id === req.params.userId,
    );
    res.json({ success: true, trades: userTrades });
  } catch (error) {
    console.error("Get user trades error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Create trade
app.post("/api/trades", authenticateToken, (req, res) => {
  try {
    const users = readUsers();
    const user = users.find((u) => u.id === req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { title, description, giving, wanting, isUrgent, expiryDays, tags } =
      req.body;

    const expiresAt =
      expiryDays && expiryDays !== "never"
        ? new Date(
            Date.now() + parseInt(expiryDays) * 24 * 60 * 60 * 1000,
          ).toISOString()
        : null;

    const newTrade = {
      id: uuidv4(),
      author: createUserResponse(user),
      title,
      description,
      giving: giving || [],
      wanting: wanting || [],
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt,
      isUrgent: isUrgent || false,
      tags: tags || [],
    };

    const trades = readTrades();
    trades.push(newTrade);
    writeTrades(trades);

    // Add notification for the user
    const notifications = readNotifications();
    const notification = {
      id: uuidv4(),
      userId: user.id,
      title: "Trade Posted Successfully!",
      message: `Your trade "${title}" is now live and visible to other traders.`,
      type: "system",
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    notifications.push(notification);
    writeNotifications(notifications);

    res.json({
      success: true,
      trade: newTrade,
      message: "Trade created successfully",
    });
  } catch (error) {
    console.error("Create trade error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// NOTIFICATION ENDPOINTS

// Get user notifications
app.get("/api/notifications", authenticateToken, (req, res) => {
  try {
    const notifications = readNotifications();
    const userNotifications = notifications
      .filter((notif) => notif.userId === req.user.userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ success: true, notifications: userNotifications });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Get unread notification count
app.get("/api/notifications/unread-count", authenticateToken, (req, res) => {
  try {
    const notifications = readNotifications();
    const unreadCount = notifications.filter(
      (notif) => notif.userId === req.user.userId && !notif.isRead,
    ).length;

    res.json({ success: true, count: unreadCount });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Mark notification as read
app.patch(
  "/api/notifications/:notificationId/read",
  authenticateToken,
  (req, res) => {
    try {
      const notifications = readNotifications();
      const notificationIndex = notifications.findIndex(
        (notif) =>
          notif.id === req.params.notificationId &&
          notif.userId === req.user.userId,
      );

      if (notificationIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }

      notifications[notificationIndex].isRead = true;
      writeNotifications(notifications);

      res.json({ success: true, message: "Notification marked as read" });
    } catch (error) {
      console.error("Mark notification read error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
);

// Mark all notifications as read
app.patch("/api/notifications/read-all", authenticateToken, (req, res) => {
  try {
    const notifications = readNotifications();

    notifications.forEach((notif) => {
      if (notif.userId === req.user.userId) {
        notif.isRead = true;
      }
    });

    writeNotifications(notifications);

    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Add notification (for internal use by other endpoints)
app.post("/api/notifications", authenticateToken, (req, res) => {
  try {
    const { userId, title, message, type, actionUrl } = req.body;

    const notification = {
      id: uuidv4(),
      userId,
      title,
      message,
      type,
      actionUrl,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const notifications = readNotifications();
    notifications.push(notification);
    writeNotifications(notifications);

    res.json({ success: true, notification });
  } catch (error) {
    console.error("Add notification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// UTILITY ENDPOINTS

// Clear all data (for development/testing)
app.delete("/api/dev/clear-data", (req, res) => {
  try {
    writeUsers([]);
    writeTrades([]);
    writeNotifications([]);

    res.json({
      success: true,
      message: "All data cleared successfully",
    });
  } catch (error) {
    console.error("Clear data error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Initialize and start server
initializeDataFiles();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
