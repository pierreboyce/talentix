// Rate Limiting Utility for Talentix API Endpoints
// Prevents abuse and protects expensive AI operations

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // Time window in milliseconds
  keyGenerator?: (request: Request) => string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (could be moved to Redis for production scaling)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  // Check if request should be allowed
  async checkLimit(request: Request): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = this.config.keyGenerator ? this.config.keyGenerator(request) : this.getDefaultKey(request);
    const now = Date.now();
    
    let entry = rateLimitStore.get(key);
    
    // Create new entry or reset if window expired
    if (!entry || now > entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + this.config.windowMs
      };
    }
    
    // Check if limit exceeded
    if (entry.count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime
      };
    }
    
    // Increment count and store
    entry.count++;
    rateLimitStore.set(key, entry);
    
    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime
    };
  }

  // Default key generator: IP + User-Agent (basic fingerprinting)
  private getDefaultKey(request: Request): string {
    const ip = this.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    return `${ip}:${userAgent.substring(0, 50)}`;
  }

  // Extract client IP from request
  private getClientIP(request: Request): string {
    // Check various headers for real IP (Vercel/Cloudflare compatibility)
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
      return realIP;
    }
    
    const vercelIP = request.headers.get('x-vercel-forwarded-for');
    if (vercelIP) {
      return vercelIP;
    }
    
    return 'unknown';
  }
}

// Pre-configured rate limiters for different endpoint types
export const rateLimiters = {
  // Very expensive AI operations (CV analysis, video transcription)
  aiHeavy: new RateLimiter({
    maxRequests: 3,
    windowMs: 60 * 1000, // 3 requests per minute
  }),
  
  // Moderate AI operations (cover letters, chat)
  aiModerate: new RateLimiter({
    maxRequests: 10,
    windowMs: 60 * 1000, // 10 requests per minute
  }),
  
  // Payment operations (checkout creation)
  payment: new RateLimiter({
    maxRequests: 5,
    windowMs: 60 * 1000, // 5 requests per minute
  }),
  
  // General API operations
  general: new RateLimiter({
    maxRequests: 30,
    windowMs: 60 * 1000, // 30 requests per minute
  }),
  
  // Authentication operations
  auth: new RateLimiter({
    maxRequests: 10,
    windowMs: 15 * 60 * 1000, // 10 requests per 15 minutes
  })
};

// Helper function to create rate limit response
export function createRateLimitResponse(resetTime: number) {
  const resetInSeconds = Math.ceil((resetTime - Date.now()) / 1000);
  
  return new Response(
    JSON.stringify({
      error: 'Rate limit exceeded',
      message: `Too many requests. Please try again in ${resetInSeconds} seconds.`,
      resetIn: resetInSeconds
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': resetInSeconds.toString(),
        'X-RateLimit-Reset': resetTime.toString()
      }
    }
  );
}

// Middleware wrapper for easy integration
export function withRateLimit(rateLimiter: RateLimiter) {
  return async function(request: Request, handler: () => Promise<Response>): Promise<Response> {
    const result = await rateLimiter.checkLimit(request);
    
    if (!result.allowed) {
      console.log('🚫 Rate limit exceeded for client');
      return createRateLimitResponse(result.resetTime);
    }
    
    console.log(`✅ Rate limit check passed. Remaining: ${result.remaining}`);
    
    // Add rate limit headers to successful responses
    const response = await handler();
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.resetTime.toString());
    
    return response;
  };
}
