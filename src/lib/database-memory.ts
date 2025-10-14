import bcrypt from 'bcryptjs';
import { User } from '../types/auth';

// In-memory database for Vercel serverless environment
const users: User[] = [];

// Initialize with some default users if needed
function initializeDatabase() {
  if (users.length === 0) {
    console.log('📊 Initializing in-memory database');
    
    // Add known users to prevent webhook failures
    // This is a temporary solution - in production you'd use a real database
    const knownUsers = [
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
    
    users.push(...knownUsers);
    console.log('✅ Added known users to memory database:', knownUsers.map(u => u.email));
  }
}

// Generate unique ID
function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Database operations for serverless environment
export const database = {
  // Find user by email
  async findUserByEmail(email: string): Promise<User | null> {
    initializeDatabase();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  },

  // Find user by ID
  async findUserById(id: string): Promise<User | null> {
    initializeDatabase();
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
    initializeDatabase();
    
    // Check if user already exists
    const existingUser = await this.findUserByEmail(userData.email);
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
      // Default subscription fields
      subscriptionTier: 'free',
      subscriptionStatus: 'active'
    };

    // Add to in-memory database
    users.push(newUser);
    console.log('✅ User created in memory database:', { id: newUser.id, email: newUser.email });

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
    initializeDatabase();
    
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
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

    console.log('✅ User subscription updated in memory database:', email);
    return true;
  },

  // Update user password
  async updatePassword(email: string, newPassword: string): Promise<boolean> {
    initializeDatabase();
    
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

    console.log('✅ User password updated in memory database:', email);
    return true;
  },

  // Get all users (for admin purposes)
  async getAllUsers(): Promise<User[]> {
    initializeDatabase();
    return users;
  }
};

