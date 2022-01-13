import { Server } from 'socket.io';
import { RedisClientType } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { RpcHandler } from './rpc.handler';
import { ExceptionHandler } from '../exceptions/exception.handler';
import { RpcContext } from './rpc.context';

/**
 * RPC Server.
 */
export class RpcServer {
  private readonly ioServer = new Server();

  constructor(
    private readonly pubRedisClient: RedisClientType<any>,
    private readonly subRedisClient: RedisClientType<any>,
    private readonly rpcHandler: RpcHandler,
  ) {}

  /**
   * Bind interceptors, handlers and start listening port.
   *
   * @param port
   */
  public listen(port: number): void {
    this.ioServer.adapter(createAdapter(this.pubRedisClient, this.subRedisClient));

    this.ioServer.on('connection', socket => {
      console.log(`Client ${socket.id} connected`);

      const exceptionHandler = new ExceptionHandler();

      socket.on('message', async data => {
        console.log(`Message from client ${socket.id} received: ${JSON.stringify(data)}`);

        try {
          const ctx = new RpcContext();

          await this.rpcHandler.handle(data, ctx);

          socket.send({
            status: 'Ok',
            data: ctx.responseData,
          });
        } catch (e) {
          exceptionHandler.handle(e as Error, socket);
        }
      });
    });

    this.ioServer.listen(port);
  }
}
