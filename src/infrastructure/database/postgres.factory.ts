import { Pool } from 'pg';

/**
 * PostgreSQL Factory.
 */
export class PostgresFactory {
  /**
   * Create PostgreSQL pool of connections with options from environment variables.
   */
  public static createPoolFromEnv(): Pool {
    return new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
}
