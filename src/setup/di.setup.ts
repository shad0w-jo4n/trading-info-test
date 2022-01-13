import { DiContainer } from '../shared/di.container';
import { ConfigService } from '../infrastructure/services/config.service';
import { CryptoCompareService } from '../infrastructure/services/crypto-compare.service';
import { CurrencyRateRepository } from '../infrastructure/database/repositories/currency-rate.repository';
import { CurrencyRateService } from '../domain/currency-rate.service';
import { Pool } from 'pg';
import { RedisClientType } from 'redis';
import {
  CONFIG_SERVICE,
  CRYPTO_COMPARE_SERVICE,
  CURRENCY_RATE_REPOSITORY_SERVICE, CURRENCY_RATE_SERVICE,
  POSTGRES_SERVICE,
  REDIS_SERVICE
} from '../constants';

export function DiSetup(postgresPool: Pool, cacheRedisClient: RedisClientType<any>): void {
  DiContainer.addSingleton(CONFIG_SERVICE, new ConfigService());
  DiContainer.addSingleton(POSTGRES_SERVICE, postgresPool);
  DiContainer.addSingleton(REDIS_SERVICE, cacheRedisClient);
  DiContainer.addSingleton(CRYPTO_COMPARE_SERVICE, new CryptoCompareService());
  DiContainer.addSingleton(CURRENCY_RATE_REPOSITORY_SERVICE, new CurrencyRateRepository());
  DiContainer.addSingleton(CURRENCY_RATE_SERVICE, new CurrencyRateService());
}
