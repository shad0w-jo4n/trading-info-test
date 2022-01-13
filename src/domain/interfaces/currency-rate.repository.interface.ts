import { CurrencyRate } from '../currency-rate.entity';

/**
 * Currency Rate Repository Interface.
 */
export interface ICurrencyRateRepository {
  /**
   * Get currencies rates.
   *
   * @param from
   * @param to
   */
  getCurrenciesRates(from: string[], to: string[]): Promise<CurrencyRate[]>;

  /**
   * Save currencies rates.
   *
   * @param rates
   */
  saveBulk(rates: CurrencyRate[]): Promise<void>;
}
