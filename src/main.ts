import { CurrenciesRateUpdater } from './infrastructure/schedulers/currencies-rate.updater';
import { RpcServer } from './infrastructure/rpc/rpc.server';
import { DiSetup } from './setup/di.setup';
import { HandlerSetup } from './setup/handler.setup';
import { ConnectionsSetup } from './setup/connections.setup';

async function bootstrap(): Promise<void> {
  // TODO: Add migration tool.
  const connections = await ConnectionsSetup();

  DiSetup(connections.postgres, connections.redis);

  const rpcHandler = HandlerSetup();

  new CurrenciesRateUpdater();
  console.log('CurrenciesRateUpdater started.');

  const server = new RpcServer(connections.pubRedis, connections.subRedis, rpcHandler);

  server.listen(3000);
  console.log('Server started.');
}

bootstrap();
