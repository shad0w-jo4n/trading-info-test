/**
 * RPC Context.
 */
export class RpcContext {
  /**
   * Name of method which passed by message request.
   */
  public method?: string;

  /**
   * Arguments which passed by message request.
   */
  public args?: object;

  /**
   * Data object for response on message.
   */
  public responseData?: any;
}
