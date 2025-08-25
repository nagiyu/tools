'use client';

import React from 'react';

import { Column } from '@client-common/components/data/table/BasicTable';

import { MyTickerDataType } from '@finance/interfaces/data/MyTickerDataType';

import AdminManagement from '@/app/components/admin/AdminManagement';
import ExchangeAPIUtil from '@/app/exchanges/ExchangeAPIUtil';
import MyTickerEditDialog from '@/app/components/myticker/MyTickerEditDialog';
import MyTickerFetchService from '@/services/myticker/MyTickerFetchService.client';
import TickerAPIUtil from '@/app/tickers/TickerAPIUtil';
import { ExchangeDataType } from '@/interfaces/data/ExchangeDataType';
import { TickerDataType } from '@/interfaces/data/TickerDataType';

interface MyTickerTableType extends MyTickerDataType {
    action: React.ReactNode;
}

export default function MyTickerTable() {
    const [exchanges, setExchanges] = React.useState<ExchangeDataType[]>([]);
    const [tickers, setTickers] = React.useState<TickerDataType[]>([]);

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

    const fetchData = async (): Promise<MyTickerDataType[]> => {
        // Load exchanges and tickers first
        const [exchangeData, tickerData] = await Promise.all([
            ExchangeAPIUtil.get(),
            TickerAPIUtil.get()
        ]);
        setExchanges(exchangeData);
        setTickers(tickerData);

        const service = new MyTickerFetchService();
        return await service.get();
    };

    const handleDelete = async (id: string): Promise<void> => {
        const fetchService = new MyTickerFetchService();
        await fetchService.delete(id);
    };

    const getItemId = (item: MyTickerDataType): string => item.id;
    
    const getItemDisplayName = (item: MyTickerDataType | null): string => {
        if (!item) return '';
        const exchange = exchanges.find(e => e.id === item.exchangeId);
        const ticker = tickers.find(t => t.id === item.tickerId);
        return `${exchange?.name || 'Unknown'} - ${ticker?.name || 'Unknown'}`;
    };

    return (
        <AdminManagement
            columns={columns}
            fetchData={fetchData}
            getItemId={getItemId}
            getItemDisplayName={getItemDisplayName}
            onCreate={() => {}} // Handled by dialog
            onUpdate={() => {}} // Handled by dialog
            onDelete={handleDelete}
            EditDialog={MyTickerEditDialog}
            editDialogProps={{
                exchanges,
                allTickers: tickers
            }}
            createButtonLabel="Create"
            itemName="MyTicker"
        />
    );
}
