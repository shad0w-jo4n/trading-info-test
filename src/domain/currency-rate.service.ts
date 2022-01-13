import { CurrencyRate } from './currency-rate.entity';
import { DiContainer } from '../shared/di.container';
import { ICryptoCompareService } from './interfaces/crypto-compare.service.interface';
import { ICurrencyRateRepository } from './interfaces/currency-rate.repository.interface';
import { ConfigService } from '../infrastructure/services/config.service';
import { CONFIG_SERVICE, CRYPTO_COMPARE_SERVICE, CURRENCY_RATE_REPOSITORY_SERVICE } from '../constants';

/**
 * Currency Rate Service.
 */
export class CurrencyRateService {
  private readonly config: ConfigService;

  private readonly cryptoCompareService: ICryptoCompareService;

  private readonly currencyRateRepository: ICurrencyRateRepository;

  constructor() {
    this.config = DiContainer.getService<ConfigService>(CONFIG_SERVICE);
    this.cryptoCompareService = DiContainer.getService<ICryptoCompareService>(CRYPTO_COMPARE_SERVICE);
    this.currencyRateRepository = DiContainer.getService<ICurrencyRateRepository>(CURRENCY_RATE_REPOSITORY_SERVICE);
  }

  /**
   * Get currencies rates.
   *
   * @param from
   * @param to
   */
  public async getCurrenciesRates(from: string[], to: string[]): Promise<CurrencyRate[]> {
    let result: CurrencyRate[];

    try {
      result = await this.cryptoCompareService.getCurrenciesRates(from, to);
    } catch (e) {
      result = await this.currencyRateRepository.getCurrenciesRates(from, to);
    }

    return result;
  }

  /**
   * Update currencies rates.
   */
  public async updateCurrenciesRates(): Promise<void> {
    const rates = await this.cryptoCompareService.getCurrenciesRates(
      this.config.currenciesFrom,
      this.config.currenciesTo,
    );

    await this.currencyRateRepository.saveBulk(rates);
  }

  /**
   * Is currencies (from) are supported.
   *
   * @param from
   */
  public validateCurrenciesFrom(from: string[]): boolean {
    return from.every(c => this.config.currenciesFrom.includes(c));
  }

  /**
   * Is currencies (to) are supported.
   *
   * @param to
   */
  public validateCurrenciesTo(to: string[]): boolean {
    return to.every(c => this.config.currenciesTo.includes(c));
  }
}
