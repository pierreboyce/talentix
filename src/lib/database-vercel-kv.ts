import bcrypt from 'bcryptjs';
import { User } from '../types/auth';

// Vercel KV Database Implementation
// This provides true persistence across deployments

let kv: any = null;

// Initialize Redis (Vercel KV or regular Redis) if available
async function initKV() {
  if (kv) return kv;
  
  try {
    // Try Vercel KV first
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { kv: vercelKV } = await import('@vercel/kv');
      kv = vercelKV;
      console.log('✅ Vercel KV initialized successfully');
      return kv;
    }
    
    // Try regular Redis with REDIS_URL
    if (process.env.REDIS_URL) {
      const Redis = await import('ioredis');
      kv = new Redis.default(process.env.REDIS_URL);
      console.log('✅ Redis initialized successfully with REDIS_URL');
      return kv;
    }
    
    console.log('⚠️ No Redis configuration found - missing environment variables');
    return null;
  } catch (error) {
    console.log('⚠️ Redis not available:', error);
    return null;
  }
}

// Fallback to persistent file system
import { database as fallbackDB } from './database-persistent';

// Generate unique ID
function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Redis operation helpers (works with both Vercel KV and regular Redis)
async function redisGet(key: string) {
  const kvInstance = await initKV();
  if (!kvInstance) return null;
  
  try {
    // Vercel KV uses .get(), regular Redis uses .get()
    const result = await kvInstance.get(key);
    return result;
  } catch (error) {
    console.log('⚠️ Redis GET error:', error);
    return null;
  }
}

async function redisSet(key: string, value: any) {
  const kvInstance = await initKV();
  if (!kvInstance) return false;
  
  try {
    // Both Vercel KV and regular Redis use .set()
    await kvInstance.set(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.log('⚠️ Redis SET error:', error);
    return false;
  }
}

async function redisSAdd(key: string, member: string) {
  const kvInstance = await initKV();
  if (!kvInstance) return false;
  
  try {
    // Both support sadd
    await kvInstance.sadd(key, member);
    return true;
  } catch (error) {
    console.log('⚠️ Redis SADD error:', error);
    return false;
  }
}

async function redisSMembers(key: string) {
  const kvInstance = await initKV();
  if (!kvInstance) return [];
  
  try {
    // Both support smembers
    const result = await kvInstance.smembers(key);
    return result || [];
  } catch (error) {
    console.log('⚠️ Redis SMEMBERS error:', error);
    return [];
  }
}

// Database operations with KV + fallback
export const database = {
  // Find user by email
  async findUserByEmail(email: string): Promise<User | null> {
    const userData = await redisGet(`user:email:${email.toLowerCase()}`);
    
    if (userData) {
      try {
        // Parse JSON if it's a string (regular Redis), or use directly (Vercel KV)
        const user = typeof userData === 'string' ? JSON.parse(userData) : userData;
        console.log('📊 User found in Redis:', email);
        return user;
      } catch (error) {
        console.log('⚠️ Redis data parse error:', error);
      }
    }
    
    // Fallback to persistent file
    return fallbackDB.findUserByEmail(email);
  },

  // Find user by ID
  async findUserById(id: string): Promise<User | null> {
    const userData = await redisGet(`user:id:${id}`);
    
    if (userData) {
      try {
        // Parse JSON if it's a string (regular Redis), or use directly (Vercel KV)
        const user = typeof userData === 'string' ? JSON.parse(userData) : userData;
        console.log('📊 User found in Redis by ID:', id);
        return user;
      } catch (error) {
        console.log('⚠️ Redis data parse error:', error);
      }
    }
    
    // Fallback to persistent file
    return fallbackDB.findUserById(id);
  },

  // Create new user
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    location?: string;
  }): Promise<User> {
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
      subscriptionTier: 'free',
      subscriptionStatus: 'active'
    };

    // Try to store in Redis
    const redisSuccess = await Promise.all([
      redisSet(`user:email:${newUser.email}`, newUser),
      redisSet(`user:id:${newUser.id}`, newUser),
      redisSAdd('users:all', newUser.id)
    ]);
    
    if (redisSuccess.every(Boolean)) {
      console.log('✅ User created in Redis:', { id: newUser.id, email: newUser.email });
      return newUser;
    } else {
      console.log('⚠️ Redis write error, falling back to file storage');
    }
    
    // Fallback to persistent file
    return fallbackDB.createUser(userData);
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
    const user = await this.findUserByEmail(email);
    if (!user) {
      console.log('❌ User not found for subscription update:', email);
      return false;
    }

    const updatedUser = {
      ...user,
      stripeCustomerId: subscriptionData.stripeCustomerId,
      stripeSubscriptionId: subscriptionData.stripeSubscriptionId,
      subscriptionTier: subscriptionData.tier as 'free' | 'pro' | 'enterprise',
      subscriptionStatus: subscriptionData.status,
      subscriptionCurrentPeriodEnd: subscriptionData.currentPeriodEnd.toISOString(),
      subscriptionCancelAtPeriodEnd: subscriptionData.cancelAtPeriodEnd,
      subscriptionPriceId: subscriptionData.priceId,
      updatedAt: new Date().toISOString()
    };

    // Try to update in Redis
    const redisSuccess = await Promise.all([
      redisSet(`user:email:${updatedUser.email}`, updatedUser),
      redisSet(`user:id:${updatedUser.id}`, updatedUser)
    ]);
    
    if (redisSuccess.every(Boolean)) {
      console.log('✅ User subscription updated in Redis:', email, 'to tier:', subscriptionData.tier);
      return true;
    } else {
      console.log('⚠️ Redis update error, falling back to file storage');
    }
    
    // Fallback to persistent file
    return fallbackDB.updateUserSubscription(email, subscriptionData);
  },

  // Update user password
  async updatePassword(email: string, newPassword: string): Promise<boolean> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      return false;
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    const updatedUser = {
      ...user,
      password: hashedPassword,
      updatedAt: new Date().toISOString()
    };

    // Try to update in Redis
    const redisSuccess = await Promise.all([
      redisSet(`user:email:${updatedUser.email}`, updatedUser),
      redisSet(`user:id:${updatedUser.id}`, updatedUser)
    ]);
    
    if (redisSuccess.every(Boolean)) {
      console.log('✅ User password updated in Redis:', email);
      return true;
    } else {
      console.log('⚠️ Redis update error, falling back to file storage');
    }
    
    // Fallback to persistent file
    return fallbackDB.updatePassword(email, newPassword);
  },

  // Get all users (for admin purposes)
  async getAllUsers(): Promise<User[]> {
    const userIds = await redisSMembers('users:all');
    
    if (userIds && userIds.length > 0) {
      try {
        const userPromises = userIds.map(async (id: string) => {
          const userData = await redisGet(`user:id:${id}`);
          if (userData) {
            return typeof userData === 'string' ? JSON.parse(userData) : userData;
          }
          return null;
        });
        
        const users = await Promise.all(userPromises);
        const validUsers = users.filter(Boolean);
        
        if (validUsers.length > 0) {
          console.log(`📊 Retrieved ${validUsers.length} users from Redis`);
          return validUsers;
        }
      } catch (error) {
        console.log('⚠️ Redis read error, falling back:', error);
      }
    }
    
    // Fallback to persistent file
    return fallbackDB.getAllUsers();
  },

  // Migrate data from persistent file to Redis (one-time operation)
  async migrateToKV(): Promise<boolean> {
    const kvInstance = await initKV();
    if (!kvInstance) {
      console.log('❌ Cannot migrate: Redis not available');
      return false;
    }

    try {
      // Get all users from persistent file
      const users = await fallbackDB.getAllUsers();
      console.log(`🔄 Migrating ${users.length} users to Redis...`);

      // Store each user in Redis
      for (const user of users) {
        const success = await Promise.all([
          redisSet(`user:email:${user.email}`, user),
          redisSet(`user:id:${user.id}`, user),
          redisSAdd('users:all', user.id)
        ]);
        
        if (!success.every(Boolean)) {
          console.log(`⚠️ Failed to migrate user: ${user.email}`);
        }
      }

      console.log(`✅ Successfully migrated ${users.length} users to Redis`);
      return true;
    } catch (error) {
      console.error('❌ Migration failed:', error);
      return false;
    }
  }
};
