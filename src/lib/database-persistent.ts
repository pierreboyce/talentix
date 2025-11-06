import bcrypt from 'bcryptjs';
import { User } from '../types/auth';
import fs from 'fs';
import path from 'path';

// Persistent database using /tmp directory (writable in Vercel)
const DB_FILE = '/tmp/talentix_users.json';

// In-memory cache for performance
let usersCache: User[] | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

// Initialize database
function initializeDatabase(): User[] {
  try {
    // Check if we have a recent cache
    if (usersCache && (Date.now() - lastCacheTime) < CACHE_DURATION) {
      return usersCache;
    }

    // Try to read from file
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      const users = JSON.parse(data);
      console.log('📊 Loaded users from persistent file:', users.length);
      
      // Update cache
      usersCache = users;
      lastCacheTime = Date.now();
      return users;
    }
  } catch (error) {
    console.log('⚠️ Could not read persistent file:', error);
  }

  // Initialize with default users
  const defaultUsers: User[] = [
    {
      id: 'oauth_user_google_1759301674181',
      name: 'Pierre Boyce',
      email: 'pierreboyce70@gmail.com',
      password: '',
      location: 'London',
      score: 0,
      emoji: '😊',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subscriptionTier: 'free' as const,
      subscriptionStatus: 'active'
    }
  ];

  // Save to file and cache
  saveToFile(defaultUsers);
  usersCache = defaultUsers;
  lastCacheTime = Date.now();
  
  console.log('📊 Initialized persistent database with default users');
  return defaultUsers;
}

// Save users to file
function saveToFile(users: User[]): void {
  try {
    // Ensure /tmp directory exists
    const tmpDir = path.dirname(DB_FILE);
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
    console.log('💾 Saved users to persistent file:', users.length);
    
    // Update cache
    usersCache = users;
    lastCacheTime = Date.now();
  } catch (error) {
    console.error('❌ Failed to save to persistent file:', error);
  }
}

// Generate unique ID
function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Database operations
export const database = {
  // Find user by email
  async findUserByEmail(email: string): Promise<User | null> {
    const users = initializeDatabase();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  },

  // Find user by ID
  async findUserById(id: string): Promise<User | null> {
    const users = initializeDatabase();
    const user = users.find(u => u.id === id);
    return user || null;
  },

  // Create new user
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    location?: string;
  }): Promise<User> {
    const users = initializeDatabase();
    
    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create new user
    const newUser: User = {
      id: generateId(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      location: userData.location || 'London',
      score: 0,
      emoji: '😊',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subscriptionTier: 'free',
      subscriptionStatus: 'active'
    };

    // Add to users and save
    users.push(newUser);
    saveToFile(users);
    
    console.log('✅ User created in persistent database:', { id: newUser.id, email: newUser.email });
    return newUser;
  },

  // Verify user password
  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user || !user.password) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  },

  // Update user subscription
  async updateUserSubscription(email: string, subscriptionData: {
    stripeCustomerId: string;
    stripeSubscriptionId: string | null;
    tier: string;
    status: string;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    priceId: string | null;
  }): Promise<boolean> {
    const users = initializeDatabase();
    
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) {
      console.log('❌ User not found for subscription update:', email);
      return false;
    }

    users[userIndex] = {
      ...users[userIndex],
      stripeCustomerId: subscriptionData.stripeCustomerId,
      stripeSubscriptionId: subscriptionData.stripeSubscriptionId,
      subscriptionTier: subscriptionData.tier as 'free' | 'pro' | 'enterprise',
      subscriptionStatus: subscriptionData.status,
      subscriptionCurrentPeriodEnd: subscriptionData.currentPeriodEnd.toISOString(),
      subscriptionCancelAtPeriodEnd: subscriptionData.cancelAtPeriodEnd,
      subscriptionPriceId: subscriptionData.priceId,
      updatedAt: new Date().toISOString()
    };

    // Save to file
    saveToFile(users);
    
    console.log('✅ User subscription updated in persistent database:', email, 'to tier:', subscriptionData.tier);
    return true;
  },

  // Update user password
  async updatePassword(email: string, newPassword: string): Promise<boolean> {
    const users = initializeDatabase();
    
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) {
      return false;
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    users[userIndex] = {
      ...users[userIndex],
      password: hashedPassword,
      updatedAt: new Date().toISOString()
    };

    // Save to file
    saveToFile(users);
    
    console.log('✅ User password updated in persistent database:', email);
    return true;
  },

  // Get all users (for admin purposes)
  async getAllUsers(): Promise<User[]> {
    return initializeDatabase();
  }
};














