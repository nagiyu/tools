import { ExchangeSessionType } from '@finance/types/ExchangeTypes';

/**
 * Interface for condition information.
 */
export interface ConditionInfo {
  /**
   * Name of the condition.
   */
  name: string;

  /**
   * Description of the condition.
   */
  description: string;

  /**
   * Indicates if the condition is a buy condition.
   */
  isBuyCondition: boolean;

  /**
   * Indicates if the condition is a sell condition.
   */
  isSellCondition: boolean;
}

/**
 * Base class for all conditions.
 */
export default abstract class ConditionBase {
  /**
   * Checks if the condition is met.
   * @param exchangeId Exchange ID
   * @param tickerId Ticker ID
   * @param session Exchange session (optional)
   * @param currentPrice Current price (optional)
   */
  public abstract checkCondition(
    exchangeId: string,
    tickerId: string,
    session?: ExchangeSessionType,
    currentPrice?: number
  ): Promise<boolean>;
}
