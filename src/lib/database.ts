/**
 * Database abstraction layer - Mock implementation
 * This can be easily replaced with a real database (PostgreSQL, MongoDB, etc.)
 */

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  subscription: {
    tier: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'cancelled' | 'expired';
    startDate?: Date;
    endDate?: Date;
  };
  usage: {
    cvReviews: number;
    videoInterviews: number;
    blogViews: number;
  };
}

export interface Subscription {
  id: string;
  userId: string;
  tier: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data store (in production, this would be a real database)
const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    subscription: {
      tier: 'pro',
      status: 'active',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-12-15'),
    },
    usage: {
      cvReviews: 45,
      videoInterviews: 23,
      blogViews: 156,
    },
  },
  {
    id: '2',
    email: 'sarah@example.com',
    name: 'Sarah Smith',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    subscription: {
      tier: 'free',
      status: 'active',
    },
    usage: {
      cvReviews: 3,
      videoInterviews: 5,
      blogViews: 28,
    },
  },
  {
    id: '3',
    email: 'mike@company.com',
    name: 'Mike Johnson',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    subscription: {
      tier: 'enterprise',
      status: 'active',
      startDate: new Date('2024-01-20'),
    },
    usage: {
      cvReviews: 234,
      videoInterviews: 189,
      blogViews: 1245,
    },
  },
];

const mockSubscriptions: Subscription[] = [
  {
    id: 'sub_1',
    userId: '1',
    tier: 'pro',
    status: 'active',
    stripeCustomerId: 'cus_123',
    stripeSubscriptionId: 'sub_123',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-12-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'sub_2',
    userId: '3',
    tier: 'enterprise',
    status: 'active',
    stripeCustomerId: 'cus_456',
    stripeSubscriptionId: 'sub_456',
    startDate: new Date('2024-01-20'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
];

/**
 * Database operations for users
 */
export const userDb = {
  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 10));
    return mockUsers.find(user => user.id === id) || null;
  },

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 10));
    return mockUsers.find(user => user.email === email) || null;
  },

  /**
   * Create a new user
   */
  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockUsers.push(newUser);
    return newUser;
  },

  /**
   * Update user
   */
  async update(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const userIndex = mockUsers.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...updates,
      updatedAt: new Date(),
    };

    return mockUsers[userIndex];
  },

  /**
   * Delete user
   */
  async delete(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const userIndex = mockUsers.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    mockUsers.splice(userIndex, 1);
    return true;
  },

  /**
   * Get all users (for admin)
   */
  async findAll(limit?: number, offset?: number): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 10));
    
    let users = [...mockUsers];
    
    if (offset) {
      users = users.slice(offset);
    }
    
    if (limit) {
      users = users.slice(0, limit);
    }
    
    return users;
  },

  /**
   * Count total users
   */
  async count(): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 10));
    return mockUsers.length;
  },
};

/**
 * Database operations for subscriptions
 */
export const subscriptionDb = {
  /**
   * Find subscription by user ID
   */
  async findByUserId(userId: string): Promise<Subscription | null> {
    await new Promise(resolve => setTimeout(resolve, 10));
    return mockSubscriptions.find(sub => sub.userId === userId) || null;
  },

  /**
   * Find subscription by Stripe subscription ID
   */
  async findByStripeId(stripeSubscriptionId: string): Promise<Subscription | null> {
    await new Promise(resolve => setTimeout(resolve, 10));
    return mockSubscriptions.find(sub => sub.stripeSubscriptionId === stripeSubscriptionId) || null;
  },

  /**
   * Create subscription
   */
  async create(subData: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<Subscription> {
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const newSubscription: Subscription = {
      ...subData,
      id: `sub_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockSubscriptions.push(newSubscription);
    return newSubscription;
  },

  /**
   * Update subscription
   */
  async update(id: string, updates: Partial<Omit<Subscription, 'id' | 'createdAt'>>): Promise<Subscription | null> {
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const subIndex = mockSubscriptions.findIndex(sub => sub.id === id);
    if (subIndex === -1) return null;

    mockSubscriptions[subIndex] = {
      ...mockSubscriptions[subIndex],
      ...updates,
      updatedAt: new Date(),
    };

    return mockSubscriptions[subIndex];
  },

  /**
   * Get all subscriptions
   */
  async findAll(): Promise<Subscription[]> {
    await new Promise(resolve => setTimeout(resolve, 10));
    return [...mockSubscriptions];
  },

  /**
   * Count active subscriptions
   */
  async countActive(): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 10));
    return mockSubscriptions.filter(sub => sub.status === 'active').length;
  },
};

/**
 * Analytics queries
 */
export const analyticsDb = {
  /**
   * Get user analytics
   */
  async getUserAnalytics() {
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const total = mockUsers.length;
    const active = mockUsers.filter(user => 
      user.subscription.status === 'active' && 
      user.usage.cvReviews > 0 || user.usage.videoInterviews > 0
    ).length;

    return {
      total,
      active,
      growth: Math.round((active / total) * 100),
    };
  },

  /**
   * Get subscription analytics
   */
  async getSubscriptionAnalytics() {
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const total = mockSubscriptions.length;
    const active = mockSubscriptions.filter(sub => sub.status === 'active').length;
    const pro = mockSubscriptions.filter(sub => sub.tier === 'pro' && sub.status === 'active').length;
    const enterprise = mockSubscriptions.filter(sub => sub.tier === 'enterprise' && sub.status === 'active').length;

    // Mock revenue calculation
    const monthlyRevenue = (pro * 3.99) + (enterprise * 29.99);

    return {
      total,
      active,
      monthlyRevenue,
      conversionRate: Math.round((active / mockUsers.length) * 100),
    };
  },

  /**
   * Get usage analytics
   */
  async getUsageAnalytics() {
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const totalCvReviews = mockUsers.reduce((sum, user) => sum + user.usage.cvReviews, 0);
    const totalVideoInterviews = mockUsers.reduce((sum, user) => sum + user.usage.videoInterviews, 0);
    const totalBlogViews = mockUsers.reduce((sum, user) => sum + user.usage.blogViews, 0);

    return {
      cvReviews: { total: totalCvReviews },
      videoInterviews: { total: totalVideoInterviews },
      blogViews: { total: totalBlogViews },
    };
  },
};