import { RpcContext } from '../../infrastructure/rpc/rpc.context';
import { DiContainer } from '../../shared/di.container';
import { Pool } from 'pg';
import { POSTGRES_SERVICE } from '../../constants';

/**
 * Get number 1 by database.
 *
 * @param ctx
 */
export async function GetOneMethod(ctx: RpcContext): Promise<number> {
  const database = DiContainer.getService<Pool>(POSTGRES_SERVICE);
  const result = await database.query('SELECT 1 AS num');

  return result.rows[0]['num'];
}
