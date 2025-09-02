/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useEffect } from 'react';

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
    loading?: boolean;
    exchanges: ExchangeDataType[];
    tickers: TickerDataType[];
}

const conditionTypeOptions: SelectOptionType[] = [
    { value: FINANCE_NOTIFICATION_CONDITION_TYPE.GREATER_THAN, label: FINANCE_NOTIFICATION_CONDITION_TYPE.GREATER_THAN },
    { value: FINANCE_NOTIFICATION_CONDITION_TYPE.LESS_THAN, label: FINANCE_NOTIFICATION_CONDITION_TYPE.LESS_THAN },
    { value: FINANCE_NOTIFICATION_CONDITION_TYPE.THREE_RED_SOLDIERS, label: 'Three Red Soldiers (赤三兵)' },
    { value: FINANCE_NOTIFICATION_CONDITION_TYPE.THREE_RIVER_EVENING_STAR, label: 'Three River Evening Star (三川明けの明星)' },
];

export default function FinanceNotificationEditDialogContent({
    item,
    state,
    onItemChange,
    onStateChange,
    loading,
    exchanges,
    tickers,
}: FinanceNotificationEditDialogContentProps) {
    useEffect(() => {
        if (exchanges.length === 0 || tickers.length === 0) {
            return;
        }

        const exchangeId = item.exchangeId.trim() === '' ? exchanges[0].id : item.exchangeId;
        const filteredTickers = tickers.filter(t => t.exchange === exchangeId);
        const tickerId = filteredTickers.find(t => t.id === item.tickerId)
            ? item.tickerId
            : (filteredTickers.length > 0 ? filteredTickers[0].id : '');

        onItemChange({
            ...item,
            exchangeId: exchangeId,
            tickerId: tickerId
        });
        onStateChange({ ...state, filteredTickers });
    }, [exchanges, tickers]);

    return (
        <>
            <BasicSelect
                label='Exchange'
                options={ExchangeUtil.dataToSelectOptions(exchanges)}
                value={item.exchangeId}
                disabled={loading}
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
                disabled={loading || !item.exchangeId}
                onChange={(value) => onItemChange({ ...item, tickerId: value })}
            />
            <BasicSelect
                label='Condition Type'
                options={conditionTypeOptions}
                value={item.conditionType}
                disabled={loading}
                onChange={(value) => onItemChange({ ...item, conditionType: value as FinanceNotificationConditionType })}
            />
            {(item.conditionType === FINANCE_NOTIFICATION_CONDITION_TYPE.GREATER_THAN || 
              item.conditionType === FINANCE_NOTIFICATION_CONDITION_TYPE.LESS_THAN) && (
                <BasicNumberField
                    label='Condition Value'
                    value={item.conditionValue}
                    disabled={loading}
                    onChange={(value) => onItemChange({ ...item, conditionValue: Number(value.target.value) })}
                />
            )}
        </>
    );
}
