import { createClient } from 'redis';

/**
 * Redis Factory.
 */
export class RedisFactory {
  /**
   * Create Redis client with options from environment variables.
   */
  public static createClientFromEnv() {
    return createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });
  }
}
