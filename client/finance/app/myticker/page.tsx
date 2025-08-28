'use client';

import React, { useEffect, useState } from 'react';

import DateUtil from '@common/utils/DateUtil';

import { MyTickerDataType } from '@finance/interfaces/data/MyTickerDataType';

import AuthFetchService from '@client-common/services/auth/AuthFetchService.client';
import AdminManagement from '@client-common/components/admin/AdminManagement';
import { Column } from '@client-common/components/data/table/BasicTable';

import Auth from '@/app/components/Auth';
import ExchangeAPIUtil from '@/app/exchanges/ExchangeAPIUtil';
import MyTickerFetchService from '@/services/myticker/MyTickerFetchService.client';
import TickerAPIUtil from '@/app/tickers/TickerAPIUtil';
import { ExchangeDataType } from '@/interfaces/data/ExchangeDataType';
import { TickerDataType } from '@/interfaces/data/TickerDataType';
import MyTickerEditDialogContent from '@/app/components/myticker/MyTickerEditDialogContent';

interface MyTickerTableType extends MyTickerDataType {
    action: React.ReactNode;
}

export interface StateType extends Record<string, unknown> {
    filteredTickers: TickerDataType[];
    isSell: boolean;
}

export default function MyTickerPage() {
    const [exchanges, setExchanges] = useState<ExchangeDataType[]>([]);
    const [tickers, setTickers] = useState<TickerDataType[]>([]);

    const fetchService = new MyTickerFetchService();
    const authFetchService = new AuthFetchService();

    const columns: Column<MyTickerTableType>[] = [
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
            id: 'purchaseDate',
            label: 'Purchase Date',
            format: (cell) => cell ? new Date(cell).toLocaleString() : ''
        },
        { id: 'purchasePrice', label: 'Purchase Price' },
        { id: 'quantity', label: 'Quantity' },
        {
            id: 'sellDate',
            label: 'Sell Date',
            format: (cell) => cell ? new Date(cell).toLocaleString() : ''
        },
        { id: 'sellPrice', label: 'Sell Price' },
        { id: 'action', label: 'Action' }
    ];

    const defaultItem: MyTickerDataType = {
        id: '',
        userId: '',
        exchangeId: '',
        tickerId: '',
        purchaseDate: DateUtil.getTodayStartTimestamp(),
        purchasePrice: 0,
        quantity: 0,
        sellDate: null,
        sellPrice: null,
        create: 0,
        update: 0
    }

    const defaultState: StateType = {
        filteredTickers: [],
        isSell: false
    }

    const generateState = (item: MyTickerDataType): StateType => {
        const filteredTickers = tickers.filter(t => t.exchange === item.exchangeId);
        const isSell = item.sellDate !== null || item.sellPrice !== null;
        return {
            filteredTickers,
            isSell
        };
    };

    const fetchData = async (): Promise<MyTickerDataType[]> => {
        return await fetchService.get();
    };

    const onCreate = async (item: MyTickerDataType) => {
        const user = await authFetchService.getUserByGoogle();
        item.userId = user.id;

        const now = Date.now();

        item.create = now;
        item.update = now;

        return await fetchService.create(item);
    };

    const onUpdate = async (item: MyTickerDataType) => {
        const user = await authFetchService.getUserByGoogle();
        item.userId = user.id;

        item.update = Date.now();

        return await fetchService.update(item);
    };

    const onDelete = async (id: string) => {
        await fetchService.delete(id);
    };

    const validateItem = (item: MyTickerDataType): string | null => {
        if (!item.exchangeId) return 'Exchange is required.';
        if (!item.tickerId) return 'Ticker is required.';
        if (item.purchasePrice <= 0) return 'Purchase Price must be greater than 0.';
        if (item.quantity <= 0) return 'Quantity must be greater than 0.';
        if ((item.sellDate && !item.sellPrice) || (!item.sellDate && item.sellPrice)) {
            return 'Both Sell Date and Sell Price must be set together.';
        }
        if (item.sellPrice && item.sellPrice <= 0) {
            return 'Sell Price must be greater than 0.';
        }
        return null;
    };

    useEffect(() => {
        (async () => {
            const [exchangeData, tickerData] = await Promise.all([
                ExchangeAPIUtil.get(),
                TickerAPIUtil.get()
            ]);
            setExchanges(exchangeData);
            setTickers(tickerData);
        })();
    }, []);

    return (
        <Auth
            userContent={
                <AdminManagement<MyTickerDataType, StateType>
                    columns={columns}
                    fetchData={fetchData}
                    itemName='My Ticker'
                    defaultItem={defaultItem}
                    defaultState={defaultState}
                    generateState={generateState}
                    validateItem={validateItem}
                    onCreate={onCreate}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                >
                    {(item, state, onItemChange, onStateChange) => {
                        return (
                            <MyTickerEditDialogContent
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
            }
        />
    )
}
