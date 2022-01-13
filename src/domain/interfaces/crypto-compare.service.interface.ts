import { CurrencyRate } from '../currency-rate.entity';

/**
 * CryptoCompare API Service Interface.
 */
export interface ICryptoCompareService {
  /**
   * Get currencies rate from CryptoCompare API.
   *
   * @param from
   * @param to
   */
  getCurrenciesRates(from: string[], to: string[]): Promise<CurrencyRate[]>;
}
