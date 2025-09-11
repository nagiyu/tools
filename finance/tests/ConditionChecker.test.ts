import FinanceUtilMock from '@finance/tests/mocks/utils/FinanceUtilMock';

jest.mock('@finance/utils/FinanceUtil', () => {
  return {
    __esModule: true,
    default: FinanceUtilMock
  };
});

import { SansenAkenomyojoConditionChecker } from '@finance/services/conditionChecker/SansenAkenomyojoConditionChecker';
import { ConditionCheckParams } from '@finance/services/conditionChecker/BaseConditionChecker';

describe('ConditionChecker', () => {
  describe('三川明けの明星', () => {
    const checker = new SansenAkenomyojoConditionChecker();

    it('Check Success Case', async () => {
      FinanceUtilMock.StockPriceDataMock = [
        {
          date: '2025-01-01 00:00',
          data: [1000, 960, 950, 1010]
        },
        {
          date: '2025-01-02 00:00',
          data: [940, 950, 930, 960]
        },
        {
          date: '2025-01-03 00:00',
          data: [970, 1010, 970, 1020]
        }
      ];

      const params: ConditionCheckParams = {
        target: 'MOCK_TARGET',
        exchangeKey: 'MOCK_EXCHANGE',
        tickerKey: 'MOCK_TICKER',
        session: 'extended',
      };

      const result = await checker.check(params);

      expect(result.met).toBe(true);
    });
  });
});
