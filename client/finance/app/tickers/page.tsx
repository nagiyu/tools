'use client';

import React, { useEffect, useState } from 'react';

import { Column } from '@client-common/components/data/table/BasicTable';
import AdminManagement from '@client-common/components/admin/AdminManagement';

import Auth from '@/app/components/Auth';
import ExchangeAPIUtil from '@/app/exchanges/ExchangeAPIUtil';
import TickerAPIUtil from '@/app/tickers/TickerAPIUtil';
import TickerEditDialogContent from '@/app/components/ticker/TickerEditDialogContent';
import { ExchangeDataType } from '@/interfaces/data/ExchangeDataType';
import { TickerDataType } from '@/interfaces/data/TickerDataType';

interface TickerTableType extends TickerDataType {
    action: React.ReactNode;
}

export default function TickersPage() {
    const [exchanges, setExchanges] = useState<ExchangeDataType[]>([]);

    const columns: Column<TickerTableType>[] = [
        { id: 'name', label: 'Name' },
        { id: 'key', label: 'Key' },
        {
            id: 'exchange',
            label: 'Exchange',
            format: (cell) => cell ? exchanges.find(exchange => exchange.id === cell)?.name : ''
        },
        { id: 'action', label: 'Action' }
    ];

    const defaultItem: TickerDataType = {
        id: '',
        name: '',
        key: '',
        exchange: '',
        create: 0,
        update: 0
    };

    const fetchData = async (): Promise<TickerDataType[]> => {
        const [exchangeData, tickerData] = await Promise.all([
            ExchangeAPIUtil.get(),
            TickerAPIUtil.get()
        ]);
        setExchanges(exchangeData);
        return tickerData;
    };

    const onCreate = async (item: TickerDataType): Promise<TickerDataType> => {
        return await TickerAPIUtil.create({
            name: item.name,
            key: item.key,
            exchange: item.exchange
        });
    };

    const onUpdate = async (item: TickerDataType): Promise<TickerDataType> => {
        return await TickerAPIUtil.update(item.id, {
            name: item.name,
            key: item.key,
            exchange: item.exchange,
            create: item.create
        });
    };

    const onDelete = async (id: string): Promise<void> => {
        await TickerAPIUtil.delete(id);
    };

    const validateItem = (item: TickerDataType): string | null => {
        if (!item.name.trim()) return 'Name is required.';
        if (!item.key.trim()) return 'Key is required.';
        if (!item.exchange.trim()) return 'Exchange is required.';
        return null;
    };

    useEffect(() => {
        (async () => {
            const exchangeData = await ExchangeAPIUtil.get();
            setExchanges(exchangeData);
        })();
    }, []);

    return (
        <Auth
            adminContent={
                <AdminManagement<TickerDataType>
                    columns={columns}
                    fetchData={fetchData}
                    itemName='Ticker'
                    defaultItem={defaultItem}
                    validateItem={validateItem}
                    onCreate={onCreate}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                >
                    {(item, _state, onItemChange) => (
                        <TickerEditDialogContent
                            item={item}
                            onItemChange={onItemChange}
                            exchanges={exchanges}
                        />
                    )}
                </AdminManagement>
            }
            userContent={
                <div>権限がありません。</div>
            }
        />
    );
}
