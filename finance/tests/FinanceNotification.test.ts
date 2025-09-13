jest.mock('@finance/utils/FinanceUtil', () => {
  return {
    __esModule: true,
    default: require('@finance/tests/mocks/utils/FinanceUtilMock').default
  };
});

import CommonUtil from '@common/utils/CommonUtil';
import NotificationServiceMock from '@common/tests/mock/services/NotificationServiceMock';

import ConditionService from '@finance/services/ConditionService';
import ExchangeServiceMock from '@finance/tests/mocks/services/ExchangeServiceMock';
import FinanceNotificationDataAccessorMock from '@finance/tests/mocks/services/FinanceNotificationDataAccessorMock';
import FinanceNotificationService from '@finance/services/FinanceNotificationService';
import FinanceUtilMock from '@finance/tests/mocks/utils/FinanceUtilMock';
import TickerServiceMock from '@finance/tests/mocks/services/TickerServiceMock';
import { EXCHANGE_SESSION } from '@finance/consts/ExchangeConsts';
import { FINANCE_NOTIFICATION_FREQUENCY } from '@finance/consts/FinanceNotificationConst';
import { FINANCE_RECORD_DATA_TYPE } from '@finance/types/FinanceRecordDataType';

describe('FinanceNotificationService', () => {
  let service: FinanceNotificationService;
  const dataAccessor = new FinanceNotificationDataAccessorMock();
  const conditionService = new ConditionService(
    new ExchangeServiceMock(),
    new TickerServiceMock()
  );
  const notificationService = new NotificationServiceMock();

  beforeEach(() => {
    service = new FinanceNotificationService(
      dataAccessor,
      new ExchangeServiceMock(),
      new TickerServiceMock(),
      conditionService,
      notificationService
    );
  });

  describe('Notification', () => {
    it('should send notification', async () => {
      FinanceUtilMock.StockPriceDataMock = [
        {
          date: '2025-01-01 00:00',
          data: [1000, 960, 950, 1010]
        }
      ];

      dataAccessor.createRecords([
        {
          ID: CommonUtil.generateUUID(),
          DataType: FINANCE_RECORD_DATA_TYPE.FINANCE_NOTIFICATION,
          TerminalID: CommonUtil.generateUUID(),
          SubscriptionEndpoint: 'http://localhost:3000/endpoint',
          SubscriptionKeysP256dh: 'p256dh',
          SubscriptionKeysAuth: 'auth',
          ExchangeID: ExchangeServiceMock.MockExchangeName,
          TickerID: TickerServiceMock.MockTickerName,
          ConditionList: [
            {
              conditionName: 'GreaterThan',
              frequency: FINANCE_NOTIFICATION_FREQUENCY.MINUTE_LEVEL
            }
          ],
          Session: EXCHANGE_SESSION.EXTENDED,
          TargetPrice: 950,
          FirstNotificationSent: false,
          Create: Date.now(),
          Update: Date.now()
        }
      ]);

      await service.notification('http://localhost:3000/endpoint');
      const messages = notificationService.getMessages();
      expect(messages.length).toBe(1);
    });
  });
});
