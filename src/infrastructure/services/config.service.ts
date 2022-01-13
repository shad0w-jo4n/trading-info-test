/**
 * Configuration Service.
 */
export class ConfigService {
  /**
   * Supported currencies for get rate from it.
   */
  public readonly currenciesFrom: string[];

  /**
   * Supported currencies for get rate to it.
   */
  public readonly currenciesTo: string[];

  /**
   * CryptoCompare API endpoint for getting prices of multi-currency.
   */
  public readonly cryptoComparePriceMulti: string;

  /**
   * Load config from environment variables.
   */
  constructor() {
    this.currenciesFrom = process.env.CURRENCIES_FROM?.split(',') || [];
    this.currenciesTo = process.env.CURRENCIES_TO?.split(',') || [];
    this.cryptoComparePriceMulti =
      process.env.CRYPTOCOMPARE_PRICEMULTI_URL || 'https://min-api.cryptocompare.com/data/pricemulti';
  }
}
