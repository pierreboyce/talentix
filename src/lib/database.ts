import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User } from '../types/auth';

const DB_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DB_DIR, 'users.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DB_DIR);
  } catch {
    await fs.mkdir(DB_DIR, { recursive: true });
  }
}

// Ensure users file exists
async function ensureUsersFile() {
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
  }
}

// Read all users from file
async function readUsers(): Promise<User[]> {
  await ensureDataDir();
  await ensureUsersFile();
  
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

// Write users to file
async function writeUsers(users: User[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// Database operations
export const database = {
  // Find user by email
  async findUserByEmail(email: string): Promise<User | null> {
    const users = await readUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  },

  // Find user by ID
  async findUserById(id: string): Promise<User | null> {
    const users = await readUsers();
    return users.find(user => user.id === id) || null;
  },

  // Create new user
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    location?: string;
  }): Promise<User> {
    const users = await readUsers();
    
    // Check if user already exists
    const existingUser = users.find(user => user.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      location: userData.location || 'Unknown',
      score: 0,
      emoji: '😊',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to users array and save
    users.push(newUser);
    await writeUsers(users);

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  },

  // Verify user password
  async verifyPassword(email: string, password: string): Promise<User | null> {
    const users = await readUsers();
    const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    
    if (!user || !user.password) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  },

  // Update user
  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const users = await readUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return null;
    }

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await writeUsers(users);

    // Return user without password
    const { password, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword as User;
  },

  // Update user password
  async updatePassword(email: string, newPassword: string): Promise<boolean> {
    const users = await readUsers();
    const userIndex = users.findIndex(user => user.email.toLowerCase() === email.toLowerCase());
    
    if (userIndex === -1) {
      return false;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password
    users[userIndex] = {
      ...users[userIndex],
      password: hashedPassword,
      updatedAt: new Date().toISOString()
    };

    await writeUsers(users);
    return true;
  },

  // Get all users (admin function)
  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await readUsers();
    return users.map(({ password, ...user }) => user);
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
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
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

    await writeUsers(users);
    return true;
  }
};