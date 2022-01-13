import { Socket } from 'socket.io';
import { BadRequestException } from './bad-request.exception';
import { NotFoundException } from './not-found.exception';

/**
 * Exception Handler.
 */
export class ExceptionHandler {
  /**
   * Handle exception.
   *
   * @param e
   * @param socket
   */
  public handle(e: Error, socket: Socket): void {
    if (e instanceof BadRequestException) {
      socket.send({
        status: 'Error',
        message: `Bad request. ${e.message || ''}`,
      });
    } else if (e instanceof NotFoundException) {
      socket.send({
        status: 'Error',
        message: 'Method not found.',
      });
    } else {
      socket.send({
        status: 'Error',
        message: 'Internal Server Error.',
      });

      console.error(e);
    }
  }
}
