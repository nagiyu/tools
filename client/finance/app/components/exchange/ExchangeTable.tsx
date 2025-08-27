'use client';

import React from 'react';

import TimeUtil from '@common/utils/TimeUtil';

import { Column } from '@client-common/components/data/table/BasicTable';
import AdminManagement from '@client-common/components/admin/AdminManagement';
import BasicNumberField from '@client-common/components/inputs/TextFields/BasicNumberField';
import BasicTextField from '@client-common/components/inputs/TextFields/BasicTextField';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';

import { ExchangeDataType } from '@/interfaces/data/ExchangeDataType';
import ExchangeAPIUtil from '@/app/exchanges/ExchangeAPIUtil';

interface ExchangeTableType extends ExchangeDataType {
    action: React.ReactNode;
}



export default function ExchangeTable() {
    const columns: Column<ExchangeTableType>[] = [
        { id: 'name', label: 'Name' },
        { id: 'key', label: 'Key' },
        { id: 'start', label: 'Start Time', format: TimeUtil.formatTime },
        { id: 'end', label: 'End Time', format: TimeUtil.formatTime },
        { id: 'action', label: 'Actions' }
    ];

    const defaultItem: ExchangeDataType = {
        id: '',
        name: '',
        key: '',
        start: { hour: 0, minute: 0 },
        end: { hour: 0, minute: 0 },
        create: 0,
        update: 0
    };

    const fetchData = async (): Promise<ExchangeDataType[]> => {
        return await ExchangeAPIUtil.get();
    };

    const onCreate = async (item: ExchangeDataType): Promise<ExchangeDataType> => {
        return await ExchangeAPIUtil.create({
            name: item.name,
            key: item.key,
            start: item.start,
            end: item.end
        });
    };

    const onUpdate = async (item: ExchangeDataType): Promise<ExchangeDataType> => {
        return await ExchangeAPIUtil.update(item.id, {
            name: item.name,
            key: item.key,
            start: item.start,
            end: item.end,
            create: item.create
        });
    };

    const onDelete = async (id: string): Promise<void> => {
        await ExchangeAPIUtil.delete(id);
    };

    const validateItem = (item: ExchangeDataType): string | null => {
        if (!item.name.trim()) return 'Name is required.';
        if (!item.key.trim()) return 'Key is required.';
        if (item.start.hour < 0 || item.start.hour > 23) return 'Start hour must be between 0 and 23.';
        if (item.start.minute < 0 || item.start.minute > 59) return 'Start minute must be between 0 and 59.';
        if (item.end.hour < 0 || item.end.hour > 23) return 'End hour must be between 0 and 23.';
        if (item.end.minute < 0 || item.end.minute > 59) return 'End minute must be between 0 and 59.';
        return null;
    };

    return (
        <AdminManagement<ExchangeDataType>
            columns={columns}
            fetchData={fetchData}
            itemName='Exchange'
            defaultItem={defaultItem}
            validateItem={validateItem}
            onCreate={onCreate}
            onUpdate={onUpdate}
            onDelete={onDelete}
        >
            {(item, _state, onItemChange) => {
                return (
                    <>
                        <BasicTextField
                            label='Name'
                            value={item.name}
                            onChange={(e) => onItemChange({ ...item, name: e.target.value })}
                        />
                        <BasicTextField
                            label='Key'
                            value={item.key}
                            onChange={(e) => onItemChange({ ...item, key: e.target.value })}
                        />
                        <DirectionStack>
                            <BasicNumberField
                                label='Start Hour'
                                value={item.start.hour}
                                onChange={(e) => onItemChange({ ...item, start: { ...item.start, hour: Number(e.target.value) } })}
                            />
                            <BasicNumberField
                                label='Start Minute'
                                value={item.start.minute}
                                onChange={(e) => onItemChange({ ...item, start: { ...item.start, minute: Number(e.target.value) } })}
                            />
                        </DirectionStack>
                        <DirectionStack>
                            <BasicNumberField
                                label='End Hour'
                                value={item.end.hour}
                                onChange={(e) => onItemChange({ ...item, end: { ...item.end, hour: Number(e.target.value) } })}
                            />
                            <BasicNumberField
                                label='End Minute'
                                value={item.end.minute}
                                onChange={(e) => onItemChange({ ...item, end: { ...item.end, minute: Number(e.target.value) } })}
                            />
                        </DirectionStack>
                    </>
                )
            }}
        </AdminManagement>
    );
}