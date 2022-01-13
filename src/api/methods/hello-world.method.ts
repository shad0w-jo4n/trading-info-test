import { RpcContext } from '../../infrastructure/rpc/rpc.context';

/**
 * Send "Hello, world!" to client.
 *
 * @param ctx
 */
export function HelloWorldMethod(ctx: RpcContext): any {
  return {
    message: 'Hello, world!',
  };
}
