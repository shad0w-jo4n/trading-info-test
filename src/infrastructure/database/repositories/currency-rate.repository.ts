import { ICurrencyRateRepository } from '../../../domain/interfaces/currency-rate.repository.interface';
import { CurrencyRate } from '../../../domain/currency-rate.entity';
import { DiContainer } from '../../../shared/di.container';
import { Pool } from 'pg';

/**
 * Currency Rate Repository.
 */
export class CurrencyRateRepository implements ICurrencyRateRepository {
  private readonly database: Pool;

  constructor() {
    this.database = DiContainer.getService<Pool>('postgres');
  }

  /**
   * Get currencies rates from database.
   *
   * @param from
   * @param to
   */
  public async getCurrenciesRates(from: string[], to: string[]): Promise<CurrencyRate[]> {
    const result = await this.database.query(
      `
          SELECT "from",
                 "to",
                 LAST("price", "date") AS "price",
                 LAST("date", "date")  AS "date"
          FROM "currency_rate"
          WHERE "from" = ANY($1)
            AND "to" = ANY($2)
          GROUP BY "from", "to"
      `,
      [
        from,
        to,
      ],
    );

    return result.rows.map(row => new CurrencyRate(row.from, row.to, row.price, row.date));
  }

  /**
   * Save currencies rates to database.
   *
   * @param rates
   */
  public async saveBulk(rates: CurrencyRate[]): Promise<void> {
    let iterator = 1;
    const params: any[] = [];
    let query = 'INSERT INTO "currency_rate" ("from", "to", "price") VALUES ';

    rates.forEach((currencyRate, index) => {
      query += `($${iterator++}, $${iterator++}, $${iterator++})`;

      if (index !== rates.length - 1) {
        query += ', ';
      }

      params.push(currencyRate.from);
      params.push(currencyRate.to);
      params.push(currencyRate.price);
    });

    await this.database.query(query, params);
  }
}
