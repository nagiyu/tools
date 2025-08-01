/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useEffect, useState } from 'react';

import TimeUtil from '@common/utils/TimeUtil';

import BasicTable, { Column } from '@client-common/components/data/table/BasicTable';
import ContainsButton from '@client-common/components/inputs/Buttons/ContainedButton';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';
import ResponseValidator from '@client-common/utils/ResponseValidator';

import { CreateExchangeRequestType, UpdateExchangeRequestType } from "@/interfaces/requests/ExchangeRequestType";
import { ExchangeDataType } from '@/interfaces/data/ExchangeDataType';

import DeleteDialog from '@/app/components/exchange/DeleteDialog';
import EditDialog from '@/app/components/exchange/EditDialog';

interface ExchangeType extends ExchangeDataType {
    action: React.ReactNode;
}

const columns: Column<ExchangeType>[] = [
    { id: 'name', label: 'Name' },
    { id: 'start', label: 'Start Time', format: TimeUtil.formatTime },
    { id: 'end', label: 'End Time', format: TimeUtil.formatTime },
    { id: 'action', label: 'Actions' }
];

const getExchanges = async (): Promise<ExchangeDataType[]> => {
    const response = await fetch('/api/exchange', {
        method: 'GET'
    });

    ResponseValidator.ValidateResponse(response);

    return await response.json();
}

const createExchange = async (request: CreateExchangeRequestType): Promise<ExchangeDataType> => {
    const response = await fetch('/api/exchange', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    });

    ResponseValidator.ValidateResponse(response);

    return await response.json();
}

const updateExchange = async (id: string, request: UpdateExchangeRequestType): Promise<ExchangeDataType> => {
    const response = await fetch(`/api/exchange/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    });

    ResponseValidator.ValidateResponse(response);

    return await response.json();
}

const deleteExchange = async (id: string): Promise<void> => {
    const response = await fetch(`/api/exchange/${id}`, {
        method: 'DELETE'
    });

    ResponseValidator.ValidateResponse(response);
}

export default function ExchangesPage() {
    const [exchanges, setExchanges] = useState<ExchangeType[]>([]);
    const [exchange, setExchange] = useState<ExchangeDataType | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const convertExchange = (data: ExchangeDataType): ExchangeType => {
        return {
            ...data,
            action: (
                <DirectionStack>
                    <ContainsButton label='Edit' onClick={() => onEditClick(data)} />
                    <ContainsButton label='Delete' onClick={() => onDeleteClick(data)} />
                </DirectionStack>
            )
        };
    }

    const onCreateClick = () => {
        setExchange(null);
        setIsNew(true);
        handleEditDialogOpen();
    };

    const onEditClick = (exchange: ExchangeDataType) => {
        setExchange(exchange);
        setIsNew(false);
        handleEditDialogOpen();
    };

    const onDeleteClick = (exchange: ExchangeDataType) => {
        setExchange(exchange);
        handleDeleteDialogOpen();
    };

    const handleEditDialogOpen = () => {
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
    };

    const handleDeleteDialogOpen = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    };

    useEffect(() => {
        (async () => {
            const exchangeData = await getExchanges();
            const exchanges = exchangeData.map(convertExchange);
            setExchanges(exchanges);
        })();
    }, []);

    return (
        <>
            <ContainsButton label='Create' onClick={onCreateClick} />
            <BasicTable columns={columns} data={exchanges} />
            <EditDialog
                open={editDialogOpen}
                onClose={handleEditDialogClose}
                isNew={isNew}
                exchange={exchange}
                setExchange={setExchange}
                create={createExchange}
                update={updateExchange}
            />
            <DeleteDialog
                open={deleteDialogOpen}
                onClose={handleDeleteDialogClose}
                exchange={exchange}
                deleteExchange={deleteExchange}
            />
        </>
    );
}
