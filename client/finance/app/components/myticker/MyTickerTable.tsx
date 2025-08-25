/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useEffect, useState } from 'react';

import BasicTable, { Column } from '@client-common/components/data/table/BasicTable';
import ContainsButton from '@client-common/components/inputs/Buttons/ContainedButton';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';

import { MyTickerDataType } from '@finance/interfaces/data/MyTickerDataType';

import ExchangeAPIUtil from '@/app/exchanges/ExchangeAPIUtil';
import MyTickerDeleteDialog from '@/app/components/myticker/MyTickerDeleteDialog';
import MyTickerEditDialog from '@/app/components/myticker/MyTickerEditDialog';
import MyTickerFetchService from '@/services/myticker/MyTickerFetchService.client';
import TickerAPIUtil from '@/app/tickers/TickerAPIUtil';
import { ExchangeDataType } from '@/interfaces/data/ExchangeDataType';
import { TickerDataType } from '@/interfaces/data/TickerDataType';

interface MyTickerTableType extends MyTickerDataType {
    exchangeName: string;
    tickerName: string;
    action: React.ReactNode;
}

const columns: Column<MyTickerTableType>[] = [
    { id: 'exchangeName', label: 'Exchange Name' },
    { id: 'tickerName', label: 'Ticker Name' },
    { id: 'purchaseDate', label: 'Purchase Date' },
    { id: 'purchasePrice', label: 'Purchase Price' },
    { id: 'quantity', label: 'Quantity' },
    { id: 'sellDate', label: 'Sell Date' },
    { id: 'sellPrice', label: 'Sell Price' },
    { id: 'action', label: 'Action' }
];

export default function MyTickerTable() {
    const [exchanges, setExchanges] = useState<ExchangeDataType[]>([]);
    const [tickers, setTickers] = useState<TickerDataType[]>([]);
    const [myTickers, setMyTickers] = useState<MyTickerTableType[]>([]);
    const [selectedMyTicker, setSelectedMyTicker] = useState<MyTickerDataType | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const dataToTable = (data: MyTickerDataType): MyTickerTableType => {
        return {
            ...data,
            exchangeName: exchanges.find(exchange => exchange.id === data.exchangeId)?.name || '',
            tickerName: tickers.find(ticker => ticker.id === data.tickerId)?.name || '',
            action: (
                <DirectionStack>
                    <ContainsButton label='Edit' onClick={() => onEditClick(data)} />
                    <ContainsButton label='Delete' onClick={() => onDeleteClick(data)} />
                </DirectionStack>
            )
        };
    };

    const onCreateClick = () => {
        setSelectedMyTicker(null);
        setIsNew(true);
        setEditDialogOpen(true);
    }

    const onEditClick = (item: MyTickerDataType) => {
        setSelectedMyTicker(item);
        setIsNew(false);
        setEditDialogOpen(true);
    }

    const onDeleteClick = (item: MyTickerDataType) => {
        setSelectedMyTicker(item);
        setDeleteDialogOpen(true);
    }

    const handleCreateMyTicker = (myTicker: MyTickerDataType) => {
        setMyTickers([...myTickers, dataToTable(myTicker)]);
        setEditDialogOpen(false);
    };

    const handleUpdateMyTicker = (myTicker: MyTickerDataType) => {
        setMyTickers(myTickers.map(t => (t.id === myTicker.id ? dataToTable(myTicker) : t)));
        setEditDialogOpen(false);
    };

    const handleDeleteMyTicker = (id: string) => {
        setMyTickers(myTickers.filter(t => t.id !== id));
        setDeleteDialogOpen(false);
    };

    useEffect(() => {
        (async () => {
            setExchanges(await ExchangeAPIUtil.get());
            setTickers(await TickerAPIUtil.get());

            const service = new MyTickerFetchService();
            const myTickers = await service.get();
            setMyTickers(myTickers.map(dataToTable));
        })();
    }, []);

    return (
        <>
            <ContainsButton label='Create' onClick={onCreateClick} />
            <BasicTable columns={columns} data={myTickers} />
            <MyTickerEditDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                isNew={isNew}
                myTicker={selectedMyTicker}
                exchanges={exchanges}
                allTickers={tickers}
                createMyTicker={handleCreateMyTicker}
                updateMyTicker={handleUpdateMyTicker}
            />
            <MyTickerDeleteDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                myTicker={selectedMyTicker}
                deleteMyTicker={handleDeleteMyTicker}
            />
        </>
    );
}
