/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useEffect, useState } from 'react';

import { FINANCE_NOTIFICATION_CONDITION_TYPE, FINANCE_NOTIFICATION_TIME_FRAME } from '@finance/types/FinanceNotificationType';
import { FinanceNotificationDataType } from '@finance/interfaces/data/FinanceNotificationDataType';

import AdminManagement from '@client-common/components/admin/AdminManagement';
import NotificationUtil from '@client-common/utils/NotificationUtil.client';
import TerminalUtil from '@client-common/utils/TerminalUtil.client';
import { Column } from '@client-common/components/data/table/BasicTable';

import Auth from '@/app/components/Auth';
import ErrorUtil from '@common/utils/ErrorUtil';
import ExchangeFetchService from '@/services/exchange/ExchangeFetchService.client';
import FinanceNotificationEditDialogContent from '@/app/components/financeNotification/FinanceNotificationEditDialogContent';
import FinanceNotificationFetchService from '@/services/financeNotification/FinanceNotificationFetchService.client';
import TickerFetchService from '@/services/ticker/TickerFetchService.client';
import { ExchangeDataType } from '@/interfaces/data/ExchangeDataType';
import { TickerDataType } from '@/interfaces/data/TickerDataType';

interface FinanceNotificationTableType extends FinanceNotificationDataType {
    action: React.ReactNode;
}

export interface StateType extends Record<string, unknown> {
    filteredTickers: TickerDataType[];
}

export default function FinanceNotificationPage() {
    const [terminalId, setTerminalId] = useState<string>('');
    const [exchanges, setExchanges] = useState<ExchangeDataType[]>([]);
    const [tickers, setTickers] = useState<TickerDataType[]>([]);

    const financeNotificationFetchService = new FinanceNotificationFetchService();
    const exchangeFetchService = new ExchangeFetchService();
    const tickerFetchService = new TickerFetchService();

    const columns: Column<FinanceNotificationTableType>[] = [
        {
            id: 'exchangeId',
            label: 'Exchange',
            format: (cell) => cell ? exchanges.find(exchange => exchange.id === cell)?.name : ''
        },
        {
            id: 'tickerId',
            label: 'Ticker',
            format: (cell) => cell ? tickers.find(ticker => ticker.id === cell)?.name : ''
        },
        {
            id: 'conditionType',
            label: 'Condition Type'
        },
        {
            id: 'conditionValue',
            label: 'Condition Value'
        },
        {
            id: 'action',
            label: 'Action'
        }
    ];

    const getDefaultItem = (): FinanceNotificationDataType => ({
        id: '',
        terminalId: terminalId,
        subscriptionEndpoint: '',
        subscriptionKeysP256dh: '',
        subscriptionKeysAuth: '',
        exchangeId: '',
        tickerId: '',
        conditionType: FINANCE_NOTIFICATION_CONDITION_TYPE.GREATER_THAN,
        conditionValue: 0,
        timeFrame: FINANCE_NOTIFICATION_TIME_FRAME.ONE_MINUTE,
        create: Date.now(),
        update: Date.now(),
    });

    const defaultState: StateType = {
        filteredTickers: []
    };

    const generateState = (item: FinanceNotificationDataType): StateType => {
        return {
            filteredTickers: tickers.filter(t => t.exchange === item.exchangeId)
        };
    };

    const fetchData = async () => {
        const result = await financeNotificationFetchService.get();
        return result.filter(item => item.terminalId === terminalId);
    };

    const fixItem = async (item: FinanceNotificationDataType, isNew: boolean): Promise<FinanceNotificationDataType> => {
        item.terminalId = terminalId;

        const subscription = NotificationUtil.getSubscription();

        if (!subscription) {
            ErrorUtil.throwError('No push subscription found. Please subscribe to notifications first.');
        }

        item.subscriptionEndpoint = subscription.endpoint;
        item.subscriptionKeysP256dh = subscription.keys.p256dh;
        item.subscriptionKeysAuth = subscription.keys.auth;

        // TODO: 実装するまでは固定値
        item.timeFrame = FINANCE_NOTIFICATION_TIME_FRAME.ONE_MINUTE;

        const now = Date.now();

        if (isNew) {
            item.create = now;
        }

        item.update = now;

        return item;
    };

    const onCreate = async (item: FinanceNotificationDataType): Promise<FinanceNotificationDataType> => {
        const fixedItem = await fixItem(item, true);
        return await financeNotificationFetchService.create(fixedItem);
    };

    const onUpdate = async (item: FinanceNotificationDataType): Promise<FinanceNotificationDataType> => {
        const fixedItem = await fixItem(item, false);
        return await financeNotificationFetchService.update(fixedItem);
    };

    const onDelete = async (id: string): Promise<void> => {
        await financeNotificationFetchService.delete(id);
    };

    const validateItem = (item: FinanceNotificationDataType): string | null => {
        if (!item.exchangeId.trim()) {
            return 'Exchange is required.';
        }

        if (!item.tickerId.trim()) {
            return 'Ticker is required.';
        }

        if (item.conditionValue <= 0) {
            return 'Condition Value must be greater than 0.';
        }

        return null;
    };

    useEffect(() => {
        (async () => {
            const [exchangesData, tickersData, terminalId] = await Promise.all([
                exchangeFetchService.get(),
                tickerFetchService.get(),
                TerminalUtil.getTerminalId()
            ]);
            setExchanges(exchangesData);
            setTickers(tickersData);
            setTerminalId(terminalId);
        })();
    }, []);

    return (
        <Auth
            userContent={
                terminalId ? (
                    <AdminManagement<FinanceNotificationDataType, StateType>
                        columns={columns}
                        fetchData={fetchData}
                        itemName='Finance Notification'
                        defaultItem={getDefaultItem()}
                        defaultState={defaultState}
                        generateState={generateState}
                        validateItem={validateItem}
                        onCreate={onCreate}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                    >
                        {(item, state, onItemChange, onStateChange) => {
                            return (
                                <FinanceNotificationEditDialogContent
                                    item={item}
                                    state={state}
                                    onItemChange={onItemChange}
                                    onStateChange={onStateChange}
                                    exchanges={exchanges}
                                    tickers={tickers}
                                />
                            );
                        }}
                    </AdminManagement>
                ) : (
                    <div>Loading...</div>
                )
            }
        />
    );
}
