'use client';

import React, { useEffect, useState } from 'react';

import { TimeType } from '@common/interfaces/TimeType';
import TimeUtil from '@common/utils/TimeUtil';

import BasicTable, { Column } from '@client-common/components/data/table/BasicTable';
import ContainsButton from '@client-common/components/inputs/Buttons/ContainedButton';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';

import { ExchangeType as ExchangeRecordType } from '@/interfaces/records/ExchangeType';

interface ExchangeType {
    id: string;
    name: string;
    start: TimeType;
    end: TimeType;
    create: number;
    update: number;
    action: React.ReactNode;
}

const columns: Column<ExchangeType>[] = [
    { id: 'name', label: 'Name' },
    { id: 'start', label: 'Start Time', format: TimeUtil.formatTime },
    { id: 'end', label: 'End Time', format: TimeUtil.formatTime },
    { id: 'action', label: 'Actions' }
];

function ConvertExchange(record: ExchangeRecordType): ExchangeType {
    return {
        id: record.ID,
        name: record.Name,
        start: TimeUtil.parseTime(record.Start),
        end: TimeUtil.parseTime(record.End),
        create: record.Create,
        update: record.Update,
        action: (
            <DirectionStack>
                <ContainsButton label='Edit' onClick={() => alert(`Edit ${record.Name}`)} />
                <ContainsButton label='Delete' onClick={() => alert(`Delete ${record.Name}`)} />
            </DirectionStack>
        )
    };
}

function ConvertExchangeRecord(exchange: ExchangeType): ExchangeRecordType {
    return {
        ID: exchange.id,
        DataType: 'Exchange',
        Name: exchange.name,
        Start: TimeUtil.formatTime(exchange.start),
        End: TimeUtil.formatTime(exchange.end),
        Create: exchange.create,
        Update: exchange.update
    };
}

function getExchangeRecords(): ExchangeRecordType[] {
    const exchangeRecords: ExchangeRecordType[] = [
        {
            ID: '1',
            DataType: 'Exchange',
            Name: 'Exchange 1',
            Start: TimeUtil.formatTime({ hour: 9, minute: 0 }),
            End: TimeUtil.formatTime({ hour: 17, minute: 0 }),
            Create: Date.now(),
            Update: Date.now()
        },
        {
            ID: '2',
            DataType: 'Exchange',
            Name: 'Exchange 2',
            Start: TimeUtil.formatTime({ hour: 10, minute: 0 }),
            End: TimeUtil.formatTime({ hour: 18, minute: 0 }),
            Create: Date.now(),
            Update: Date.now()
        }
    ]

    return exchangeRecords;
}

export default function ExchangesPage() {
    const [exchanges, setExchanges] = useState<ExchangeType[]>([]);

    useEffect(() => {
        const exchangeRecords = getExchangeRecords();
        const exchanges = exchangeRecords.map(ConvertExchange);
        setExchanges(exchanges);
    }, []);

    return (
        <BasicTable columns={columns} data={exchanges} />
    );
}
