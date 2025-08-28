import React from 'react';

import { FinanceNotificationConditionType, FINANCE_NOTIFICATION_CONDITION_TYPE } from '@finance/types/FinanceNotificationType';
import { FinanceNotificationDataType } from '@finance/interfaces/data/FinanceNotificationDataType';

import BasicSelect from '@client-common/components/inputs/Selects/BasicSelect';
import BasicNumberField from '@client-common/components/inputs/TextFields/BasicNumberField';
import { SelectOptionType } from '@client-common/interfaces/SelectOptionType';

import ExchangeUtil from '@/utils/ExchangeUtil';
import TickerUtil from '@/utils/TickerUtil';
import { ExchangeDataType } from '@/interfaces/data/ExchangeDataType';
import { TickerDataType } from '@/interfaces/data/TickerDataType';
import { StateType } from '@/app/finance-notification/page';

interface FinanceNotificationEditDialogContentProps {
    item: FinanceNotificationDataType;
    state: StateType;
    onItemChange: (item: FinanceNotificationDataType) => void;
    onStateChange: (state: StateType) => void;
    exchanges: ExchangeDataType[];
    tickers: TickerDataType[];
}

const conditionTypeOptions: SelectOptionType[] = [
    { value: FINANCE_NOTIFICATION_CONDITION_TYPE.GREATER_THAN, label: FINANCE_NOTIFICATION_CONDITION_TYPE.GREATER_THAN },
    { value: FINANCE_NOTIFICATION_CONDITION_TYPE.LESS_THAN, label: FINANCE_NOTIFICATION_CONDITION_TYPE.LESS_THAN },
];

export default function FinanceNotificationEditDialogContent({
    item,
    state,
    onItemChange,
    onStateChange,
    exchanges,
    tickers,
}: FinanceNotificationEditDialogContentProps) {
    return (
        <>
            <BasicSelect
                label='Exchange'
                options={ExchangeUtil.dataToSelectOptions(exchanges)}
                value={item.exchangeId}
                onChange={(value) => {
                    const filteredTickers = tickers.filter(t => t.exchange === value);
                    onItemChange({ ...item, exchangeId: value, tickerId: filteredTickers.length > 0 ? filteredTickers[0].id : '' });
                    onStateChange({ ...state, filteredTickers });
                }}
            />
            <BasicSelect
                label='Ticker'
                options={TickerUtil.dataToSelectOptions(state.filteredTickers)}
                value={item.tickerId}
                onChange={(value) => onItemChange({ ...item, tickerId: value })}
            />
            <BasicSelect
                label='Condition Type'
                options={conditionTypeOptions}
                value={item.conditionType}
                onChange={(value) => onItemChange({ ...item, conditionType: value as FinanceNotificationConditionType })}
            />
            <BasicNumberField
                label='Condition Value'
                value={item.conditionValue}
                onChange={(value) => onItemChange({ ...item, conditionValue: Number(value.target.value) })}
            />
        </>
    );
}
