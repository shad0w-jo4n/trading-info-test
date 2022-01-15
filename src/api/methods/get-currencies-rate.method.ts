import { RpcContext } from '../../infrastructure/rpc/rpc.context';
import { CurrencyRate } from '../../domain/currency-rate.entity';
import { BadRequestException } from '../../infrastructure/exceptions/bad-request.exception';
import { DiContainer } from '../../shared/di.container';
import { CurrencyRateService } from '../../domain/currency-rate.service';
import { CURRENCY_RATE_SERVICE } from '../../constants';

/**
 * Arguments for method to get currencies rates.
 */
type GetCurrenciesRateArgs = {
  from: string[],
  to: string[],
};

/**
 * Get currencies rates.
 *
 * @param ctx
 */
export function GetCurrenciesRateMethod(ctx: RpcContext): Promise<CurrencyRate[]> {
  const args = ctx.args as GetCurrenciesRateArgs | undefined;
  const currencyRateService = DiContainer.getService<CurrencyRateService>(CURRENCY_RATE_SERVICE);

  if (!args?.from || !args.to || !Array.isArray(args.from) || !Array.isArray(args.to)) {
    throw new BadRequestException();
  }

  if (!currencyRateService.validateCurrenciesFrom(args.from) || !currencyRateService.validateCurrenciesTo(args.to)) {
    throw new BadRequestException('Unsupported currency.');
  }

  return currencyRateService.getCurrenciesRates(args.from, args.to);
}
