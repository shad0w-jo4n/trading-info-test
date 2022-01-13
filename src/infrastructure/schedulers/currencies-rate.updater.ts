import { SchedulerBase } from './scheduler.base';
import { CurrencyRateService } from '../../domain/currency-rate.service';
import { DiContainer } from '../../shared/di.container';
import { CURRENCY_RATE_SERVICE } from '../../constants';

/**
 * Currencies Rate Updater (Scheduled).
 */
export class CurrenciesRateUpdater extends SchedulerBase {
  private readonly currencyRateService: CurrencyRateService;

  constructor() {
    super(process.env.CURRENCIES_RATE_UPDATER_CRON || '*/1 * * * *');

    this.currencyRateService = DiContainer.getService<CurrencyRateService>(CURRENCY_RATE_SERVICE);
  }

  /**
   * Update currencies rate.
   */
  public async work(): Promise<void> {
    console.log('CurrenciesRateUpdater starts work.');

    await this.currencyRateService.updateCurrenciesRates();

    console.log('CurrenciesRateUpdater ends work.');
  }
}
