import axios from 'axios';
import { CurrencyRate } from '../../domain/currency-rate.entity';
import { ICryptoCompareService } from '../../domain/interfaces/crypto-compare.service.interface';
import { ConfigService } from './config.service';
import { DiContainer } from '../../shared/di.container';
import { CONFIG_SERVICE } from '../../constants';

/**
 * CryptoCompare API Service
 */
export class CryptoCompareService implements ICryptoCompareService {
  private readonly config: ConfigService;

  constructor() {
    this.config = DiContainer.getService<ConfigService>(CONFIG_SERVICE);
  }

  /**
   * Get currencies rate from CryptoCompare API.
   *
   * @param from
   * @param to
   */
  public async getCurrenciesRates(from: string[], to: string[]): Promise<CurrencyRate[]> {
    const now = new Date();
    const result: CurrencyRate[] = [];
    const response = await axios.get(this.config.cryptoComparePriceMulti, {
      params: {
        fsyms: from.map(f => f.trim()).join(','),
        tsyms: to.map(t => t.trim()).join(','),
      },
    });

    if (response.data.Response && response.data.Response === 'Error') {
      console.log(`Error on CryptoCompare API: ${response.data.Message}`);
      throw new Error();
    }

    for (const from in response.data) {
      for (const to in response.data[from]) {
        result.push(new CurrencyRate(from, to, response.data[from][to], now));
      }
    }

    return result;
  }
}
