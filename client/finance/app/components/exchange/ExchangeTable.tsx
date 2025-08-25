'use client';

import React from 'react';

import TimeUtil from '@common/utils/TimeUtil';
import ResponseValidator from '@client-common/utils/ResponseValidator';

import { Column } from '@client-common/components/data/table/BasicTable';

import { ExchangeDataType } from '@/interfaces/data/ExchangeDataType';

import AdminManagement from '@/app/components/admin/AdminManagement';
import ExchangeAPIUtil from '@/app/exchanges/ExchangeAPIUtil';
import EditDialog from '@/app/components/exchange/EditDialog';

interface ExchangeTableType extends ExchangeDataType {
    action: React.ReactNode;
}

const columns: Column<ExchangeTableType>[] = [
    { id: 'name', label: 'Name' },
    { id: 'key', label: 'Key' },
    { id: 'start', label: 'Start Time', format: TimeUtil.formatTime },
    { id: 'end', label: 'End Time', format: TimeUtil.formatTime },
    { id: 'action', label: 'Actions' }
];

export default function ExchangeTable() {
    const fetchData = async (): Promise<ExchangeDataType[]> => {
        return await ExchangeAPIUtil.get();
    };

    const handleDelete = async (id: string): Promise<void> => {
        const response = await fetch(`/api/exchange/${id}`, {
            method: 'DELETE'
        });
        ResponseValidator.ValidateResponse(response);
    };

    const getItemId = (item: ExchangeDataType): string => item.id;
    
    const getItemDisplayName = (item: ExchangeDataType | null): string => {
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
            EditDialog={EditDialog}
            editDialogProps={{}}
            createButtonLabel="Create"
            itemName="Exchange"
        />
    );
}