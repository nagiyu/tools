/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useEffect, useState } from 'react';

import BasicTable, { Column } from '@client-common/components/data/table/BasicTable';
import ContainsButton from '@client-common/components/inputs/Buttons/ContainedButton';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';

import { ExchangeDataType } from '@/interfaces/data/ExchangeDataType';
import { TickerDataType } from '@/interfaces/data/TickerDataType';

import ExchangeAPIUtil from '@/app/exchanges/ExchangeAPIUtil';
import TickerAPIUtil from '@/app/tickers/TickerAPIUtil';
import TickerDeleteDialog from '@/app/components/ticker/TickerDeleteDialog';
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
    const [exchanges, setExchanges] = useState<ExchangeDataType[]>([]);
    const [tickers, setTickers] = useState<TickerTableType[]>([]);
    const [selectedTicker, setSelectedTicker] = useState<TickerDataType | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const convertTicker = (data: TickerDataType): TickerTableType => {
        return {
            ...data,
            action: (
                <DirectionStack>
                    <ContainsButton label='Edit' onClick={() => onEditClick(data)} />
                    <ContainsButton label='Delete' onClick={() => onDeleteClick(data)} />
                </DirectionStack>
            )
        };
    };

    const onCreateClick = () => {
        setSelectedTicker(null);
        setIsNew(true);
        setEditDialogOpen(true);
    };

    const onEditClick = (ticker: TickerDataType) => {
        setSelectedTicker(ticker);
        setIsNew(false);
        setEditDialogOpen(true);
    };

    const onDeleteClick = (ticker: TickerDataType) => {
        setSelectedTicker(ticker);
        setDeleteDialogOpen(true);
    };

    const handleCreateTicker = (ticker: TickerDataType) => {
        setTickers([...tickers, convertTicker(ticker)]);
        setEditDialogOpen(false);
    };

    const handleUpdateTicker = (ticker: TickerDataType) => {
        setTickers(tickers.map(t => (t.id === ticker.id ? convertTicker(ticker) : t)));
        setEditDialogOpen(false);
    };

    const handleDeleteTicker = (id: string) => {
        setTickers(tickers.filter(t => t.id !== id));
        setDeleteDialogOpen(false);
    }

    useEffect(() => {
        (async () => {
            setExchanges(await ExchangeAPIUtil.get());

            const tickers = await TickerAPIUtil.get();
            setTickers(tickers.map(convertTicker));
        })();
    }, []);

    return (
        <>
            <ContainsButton label='Create' onClick={onCreateClick} />
            <BasicTable columns={columns} data={tickers} />
            <TickerEditDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                isNew={isNew}
                ticker={selectedTicker}
                exchanges={exchanges}
                createTicker={handleCreateTicker}
                updateTicker={handleUpdateTicker}
            />
            <TickerDeleteDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                ticker={selectedTicker}
                deleteTicker={handleDeleteTicker}
            />
        </>
    );
}
