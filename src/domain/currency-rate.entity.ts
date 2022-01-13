/**
 * Currency Rate.
 */
export class CurrencyRate {
  constructor(
    /**
     * Source currency.
     */
    public readonly from: string,
    /**
     * Result currency.
     */
    public readonly to: string,
    /**
     * Rate for converting.
     */
    public readonly price: number,
    /**
     * Date of rate.
     */
    public readonly date: Date,
  ) {}
}
