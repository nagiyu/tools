/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useEffect, useState } from 'react';

import DateUtil from '@common/utils/DateUtil';

import { MyTickerDataType } from '@finance/interfaces/data/MyTickerDataType';

import AuthFetchService from '@client-common/services/auth/AuthFetchService.client';
import AdminManagement from '@client-common/components/admin/AdminManagement';
import { Column } from '@client-common/components/data/table/BasicTable';

import Auth from '@/app/components/Auth';
import ExchangeFetchService from '@/services/exchange/ExchangeFetchService.client';
import MyTickerEditDialogContent from '@/app/components/myticker/MyTickerEditDialogContent';
import MyTickerFetchService from '@/services/myticker/MyTickerFetchService.client';
import TickerFetchService from '@/services/ticker/TickerFetchService.client';
import { ExchangeDataType } from '@/interfaces/data/ExchangeDataType';
import { TickerDataType } from '@/interfaces/data/TickerDataType';

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

    const myTickerFetchService = new MyTickerFetchService();
    const authFetchService = new AuthFetchService();
    const exchangeFetchService = new ExchangeFetchService();
    const tickerFetchService = new TickerFetchService();

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
        create: Date.now(),
        update: Date.now()
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
        return await myTickerFetchService.get();
    };

    const fixItem = async (item: MyTickerDataType, isNew: boolean): Promise<MyTickerDataType> => {
        const user = await authFetchService.getUserByGoogle();
        item.userId = user.id;

        const now = Date.now();

        if (isNew) {
            item.create = now;
        }

        item.update = now;

        return item;
    };

    const onCreate = async (item: MyTickerDataType): Promise<MyTickerDataType> => {
        const fixedItem = await fixItem(item, true);
        return await myTickerFetchService.create(fixedItem);
    };

    const onUpdate = async (item: MyTickerDataType): Promise<MyTickerDataType> => {
        const fixedItem = await fixItem(item, false);
        return await myTickerFetchService.update(fixedItem);
    };

    const onDelete = async (id: string): Promise<void> => {
        await myTickerFetchService.delete(id);
    };

    const validateItem = (item: MyTickerDataType): string | null => {
        if (!item.exchangeId.trim()) return 'Exchange is required.';
        if (!item.tickerId.trim()) return 'Ticker is required.';
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
                exchangeFetchService.get(),
                tickerFetchService.get()
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
