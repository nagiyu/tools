'use client';

import React, { useEffect, useState } from 'react';

import ErrorUtil from '@common/utils/ErrorUtil';
import { TimeType } from '@common/interfaces/TimeType';
import TimeUtil from '@common/utils/TimeUtil';

import BasicDialog from '@client-common/components/feedback/dialog/BasicDialog';
import BasicNumberField from '@client-common/components/inputs/TextFields/BasicNumberField';
import BasicTextField from '@client-common/components/inputs/TextFields/BasicTextField';
import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';

import { CreateExchangeRequestType, UpdateExchangeRequestType } from "@/interfaces/requests/ExchangeRequestType";
import { ExchangeDataType } from '@/interfaces/data/ExchangeDataType';

type EditDialogProps = {
    open: boolean;
    onClose: () => void;
    isNew: boolean;
    exchange: ExchangeDataType | null;
    setExchange: React.Dispatch<React.SetStateAction<ExchangeDataType | null>>;
    create: (request: CreateExchangeRequestType) => Promise<ExchangeDataType>;
    update: (id: string, request: UpdateExchangeRequestType) => Promise<ExchangeDataType>;
};

function getDefaultTime(): TimeType {
    return TimeUtil.parseTime('0:00');
}

export default function EditDialog({
    open,
    onClose,
    isNew,
    exchange,
    setExchange,
    create,
    update
}: EditDialogProps) {
    const [name, setName] = useState(exchange?.name || '');
    const [start, setStart] = useState(exchange?.start || getDefaultTime());
    const [end, setEnd] = useState(exchange?.end || getDefaultTime());

    useEffect(() => {
        setName(exchange?.name || '');
        setStart(exchange?.start || getDefaultTime());
        setEnd(exchange?.end || getDefaultTime());
    }, [open])

    useEffect(() => {
        setExchange({
            id: exchange?.id || '',
            name: name,
            start: start,
            end: end,
            create: exchange?.create || Date.now(),
            update: Date.now(),
        })
    }, [name, start, end])

    const onConfirm = async () => {
        if (!exchange) {
            ErrorUtil.throwError("Exchange data is missing");
        }

        if (isNew) {
            await create({
                name: exchange.name,
                start: exchange.start,
                end: exchange.end
            });
        } else {
            await update(exchange.id, {
                name: exchange.name,
                start: exchange.start,
                end: exchange.end,
                create: exchange.create
            });
        }

        onClose();
    }

    return (
        <BasicDialog
            open={open}
            title={isNew ? "Create Exchange" : "Edit Exchange"}
            onClose={onClose}
            onConfirm={onConfirm}
            confirmText={isNew ? "Create" : "Update"}
            closeText="Cancel"
        >
            <div>{JSON.stringify(exchange)}</div>
            <BasicStack>
                <BasicTextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <DirectionStack>
                    <BasicNumberField
                        label="Start Hour"
                        value={exchange?.start.hour || 0}
                        onChange={(e) => setStart({ hour: Number(e.target.value), minute: start.minute })}
                    />
                    <BasicNumberField
                        label="Start Minute"
                        value={exchange?.start.minute || 0}
                        onChange={(e) => setStart({ hour: start.hour, minute: Number(e.target.value) })}
                    />
                </DirectionStack>
                <DirectionStack>
                    <BasicNumberField
                        label="End Hour"
                        value={exchange?.end.hour || 0}
                        onChange={(e) => setEnd({ hour: Number(e.target.value), minute: end.minute })}
                    />
                    <BasicNumberField
                        label="End Minute"
                        value={exchange?.end.minute || 0}
                        onChange={(e) => setEnd({ hour: end.hour, minute: Number(e.target.value) })}
                    />
                </DirectionStack>
            </BasicStack>
        </BasicDialog>
    );
}
