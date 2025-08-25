/* eslint-disable react-hooks/exhaustive-deps */

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
import ErrorAlert from '@client-common/components/feedback/alert/ErrorAlert';

import { CreateExchangeRequestType, UpdateExchangeRequestType } from "@/interfaces/requests/ExchangeRequestType";
import { ExchangeDataType } from '@/interfaces/data/ExchangeDataType';
import ResponseValidator from '@client-common/utils/ResponseValidator';

type EditDialogProps = {
    open: boolean;
    onClose: () => void;
    isNew: boolean;
    item: ExchangeDataType | null;
    onCreate: (exchange: ExchangeDataType) => void;
    onUpdate: (exchange: ExchangeDataType) => void;
};

function getDefaultTime(): TimeType {
    return TimeUtil.parseTime('0:00');
}

export default function EditDialog({
    open,
    onClose,
    isNew,
    item: exchange,
    onCreate,
    onUpdate
}: EditDialogProps) {
    const [name, setName] = useState(exchange?.name || '');
    const [key, setKey] = useState(exchange?.key || '');
    const [start, setStart] = useState(exchange?.start || getDefaultTime());
    const [end, setEnd] = useState(exchange?.end || getDefaultTime());
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setName(exchange?.name || '');
        setKey(exchange?.key || '');
        setStart(exchange?.start || getDefaultTime());
        setEnd(exchange?.end || getDefaultTime());
    }, [open])

    const onConfirm = async () => {
        setError(null);
        try {
            if (isNew) {
                const request: CreateExchangeRequestType = {
                    name,
                    key,
                    start,
                    end
                };
                
                const response = await fetch('/api/exchange', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(request)
                });

                ResponseValidator.ValidateResponse(response);
                const newExchange = await response.json();
                
                onCreate(newExchange);
            } else {
                if (!exchange) {
                    ErrorUtil.throwError("Exchange data is missing");
                }
                
                const request: UpdateExchangeRequestType = {
                    name,
                    key,
                    start,
                    end,
                    create: exchange.create
                };
                
                const response = await fetch(`/api/exchange/${exchange.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(request)
                });

                ResponseValidator.ValidateResponse(response);
                const updatedExchange = await response.json();
                
                onUpdate(updatedExchange);
            }

            onClose();
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("不明なエラーが発生しました");
            }
        }
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
            {error && <ErrorAlert message={error} />}
            <BasicStack>
                <BasicTextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <BasicTextField
                    label="Key"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
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
