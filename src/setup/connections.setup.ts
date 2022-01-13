import { Pool } from 'pg';
import { RedisClientType } from 'redis';
import { PostgresFactory } from '../infrastructure/database/postgres.factory';
import { RedisFactory } from '../infrastructure/redis.factory';

export type Connections = {
  postgres: Pool,
  redis: RedisClientType<any>,
  pubRedis: RedisClientType<any>,
  subRedis: RedisClientType<any>,
};

export async function ConnectionsSetup(): Promise<Connections> {
  const postgres = PostgresFactory.createPoolFromEnv();

  console.log('Created pool of connections to PostgreSQL');

  const redis = RedisFactory.createClientFromEnv();
  const pubRedis = RedisFactory.createClientFromEnv();
  const subRedis = RedisFactory.createClientFromEnv();

  await Promise.allSettled([
    redis.connect(),
    pubRedis.connect(),
    subRedis.connect(),
  ]);

  console.log('Connected to Redis.');

  return {
    postgres,
    redis,
    pubRedis,
    subRedis,
  };
}
