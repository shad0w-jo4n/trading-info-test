import { RpcContext } from '../../infrastructure/rpc/rpc.context';
import { NextPtr } from '../../infrastructure/rpc/rpc.handler';
import { DiContainer } from '../../shared/di.container';
import { RedisClientType } from 'redis';
import { REDIS_SERVICE } from '../../constants';

/**
 * Cache request and response.
 *
 * @param ctx
 * @param next
 */
export async function CacheInterceptor(ctx: RpcContext, next: NextPtr): Promise<void> {
  const method = ctx.method!;
  const args = ctx.args!;

  if (method !== 'GetCurrenciesRate') {
    await next();
    return;
  }

  const cache = DiContainer.getService<RedisClientType<any>>(REDIS_SERVICE);
  const cacheKey = `${method}:${JSON.stringify(args)}`;
  const cacheValue = await cache.get(cacheKey);

  if (cacheValue) {
    ctx.responseData = JSON.parse(cacheValue);
    return;
  }

  await next();
  await cache.set(cacheKey, JSON.stringify(ctx.responseData), {
    EX: 60,
  });
}
