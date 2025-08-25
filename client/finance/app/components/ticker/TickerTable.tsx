'use client';

import React from 'react';

import { Column } from '@client-common/components/data/table/BasicTable';

import { ExchangeDataType } from '@/interfaces/data/ExchangeDataType';
import { TickerDataType } from '@/interfaces/data/TickerDataType';

import AdminManagement from '@/app/components/admin/AdminManagement';
import ExchangeAPIUtil from '@/app/exchanges/ExchangeAPIUtil';
import TickerAPIUtil from '@/app/tickers/TickerAPIUtil';
import TickerEditDialog from '@/app/components/ticker/TickerEditDialog';

interface TickerTableType extends TickerDataType {
    action: React.ReactNode;
}

const columns: Column<TickerTableType>[] = [
    { id: 'name', label: 'Name' },
    { id: 'key', label: 'Key' },
    { id: 'action', label: 'Action' }
];

export default function TickerTable() {
    const [exchanges, setExchanges] = React.useState<ExchangeDataType[]>([]);

    const fetchData = async (): Promise<TickerDataType[]> => {
        const [exchangeData, tickerData] = await Promise.all([
            ExchangeAPIUtil.get(),
            TickerAPIUtil.get()
        ]);
        setExchanges(exchangeData);
        return tickerData;
    };

    const handleDelete = async (id: string): Promise<void> => {
        await TickerAPIUtil.delete(id);
    };

    const getItemId = (item: TickerDataType): string => item.id;
    
    const getItemDisplayName = (item: TickerDataType | null): string => {
        return item?.name || '';
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
            EditDialog={TickerEditDialog}
            editDialogProps={{
                exchanges
            }}
            createButtonLabel="Create"
            itemName="Ticker"
        />
    );
}
