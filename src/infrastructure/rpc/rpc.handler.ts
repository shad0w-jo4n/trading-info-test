import { BadRequestException } from '../exceptions/bad-request.exception';
import { NotFoundException } from '../exceptions/not-found.exception';
import { RpcContext } from './rpc.context';

export type MethodPtr = (context: RpcContext) => any | Promise<any>;

export type NextPtr = () => Promise<any>;
export type InterceptorPtr = (context: RpcContext, next: NextPtr) => Promise<any>;

/**
 * RPC Handler.
 */
export class RpcHandler {
  private readonly interceptors: InterceptorPtr[] = [];

  private readonly methods = new Map<string, MethodPtr>();

  /**
   * Register interceptor for message handling.
   *
   * @param interceptor
   */
  public registerInterceptor(interceptor: InterceptorPtr): RpcHandler {
    this.interceptors.push(interceptor);
    console.log(`Interceptor registered.`);

    return this;
  }

  /**
   * Register handler for method.
   *
   * @param name
   * @param method
   */
  public registerHandler(name: string, method: MethodPtr): RpcHandler {
    this.methods.set(name, method);
    console.log(`Method ${name} registered.`);

    return this;
  }

  /**
   * Handle message.
   *
   * @param data
   * @param ctx
   */
  public async handle(data: any, ctx: RpcContext): Promise<void> {
    this.validateMessageData(data);
    this.setupContext(data, ctx);

    const method = this.getMethodByName(ctx.method!);

    if (this.interceptors.length === 0) {
      ctx.responseData = await method(ctx);
      return;
    }

    const interceptorIterator = this.interceptors.entries();
    let interceptorIteratorObject = interceptorIterator.next();

    const next = async () => {
      if (!interceptorIteratorObject.done) {
        interceptorIteratorObject = interceptorIterator.next();

        if (interceptorIteratorObject.value) {
          await interceptorIteratorObject.value[1](ctx, next);
        }
      }

      ctx.responseData = await method(ctx);
    };

    await interceptorIteratorObject.value[1](ctx, next);
  }

  /**
   * Validate message.
   *
   * If message isn't valid, that throws exception.
   *
   * @param data
   * @private
   */
  private validateMessageData(data: any): void {
    if (typeof data !== 'object') {
      throw new BadRequestException();
    }

    if (!data.method || typeof data.method !== 'string') {
      throw new BadRequestException('Field `method` is required!');
    }
  }

  /**
   * Pass data to context.
   *
   * @param data
   * @param ctx
   * @private
   */
  private setupContext(data: any, ctx: RpcContext): RpcContext {
    ctx.method = data.method;
    ctx.args = data.args;

    return ctx;
  }

  /**
   * Get method by name.
   *
   * @param name
   * @private
   */
  private getMethodByName(name: string): MethodPtr {
    const method = this.methods.get(name);

    if (!method) {
      throw new NotFoundException();
    }

    return method;
  }
}
