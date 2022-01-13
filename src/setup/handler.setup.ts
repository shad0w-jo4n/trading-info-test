import { RpcHandler } from '../infrastructure/rpc/rpc.handler';
import { CacheInterceptor } from '../api/interceptors/cache.interceptor';
import { HelloWorldMethod } from '../api/methods/hello-world.method';
import { GetOneMethod } from '../api/methods/get-one.method';
import { GetCurrenciesRateMethod } from '../api/methods/get-currencies-rate.method';

export function HandlerSetup(): RpcHandler {
  const rpcHandler = new RpcHandler();

  rpcHandler.registerInterceptor(CacheInterceptor);
  rpcHandler.registerHandler('HelloWorld', HelloWorldMethod);
  rpcHandler.registerHandler('GetOne', GetOneMethod);
  rpcHandler.registerHandler('GetCurrenciesRate', GetCurrenciesRateMethod);

  return rpcHandler;
}
