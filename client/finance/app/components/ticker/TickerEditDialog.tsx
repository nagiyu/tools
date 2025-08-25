/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useEffect } from 'react';

import BasicDialog from '@client-common/components/feedback/dialog/BasicDialog';
import BasicSelect from '@client-common/components/inputs/Selects/BasicSelect';
import BasicTextField from '@client-common/components/inputs/TextFields/BasicTextField';
import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import ErrorAlert from '@client-common/components/feedback/alert/ErrorAlert';

import ErrorUtil from '@common/utils/ErrorUtil';
import ExchangeUtil from '@/utils/ExchangeUtil';
import { ExchangeDataType } from "@/interfaces/data/ExchangeDataType";
import { TickerDataType } from '@/interfaces/data/TickerDataType';

import TickerAPIUtil from '@/app/tickers/TickerAPIUtil';

interface TargetTicker {
    name: string,
    key: string,
    exchange: string
}

type TickerEditDialogProps = {
    open: boolean;
    onClose: () => void;
    isNew: boolean;
    ticker: TickerDataType | null;
    exchanges: ExchangeDataType[];
    createTicker: (ticker: TickerDataType) => void;
    updateTicker: (ticker: TickerDataType) => void;
}

export default function TickerEditDialog({
    open,
    onClose,
    isNew,
    ticker,
    exchanges,
    createTicker,
    updateTicker
}: TickerEditDialogProps) {
    const [targetTicker, setTargetTicker] = React.useState<TargetTicker>({
        name: '',
        key: '',
        exchange: ''
    });
    const [error, setError] = React.useState<string | null>(null);

    useEffect(() => {
        setTargetTicker({
            name: ticker?.name || '',
            key: ticker?.key || '',
            exchange: ticker?.exchange || ''
        });
    }, [open]);

    const onConfirm = async () => {
        setError(null);
        try {
            if (targetTicker.name.trim() === '') {
                ErrorUtil.throwError('Name is required');
            }

            if (targetTicker.key.trim() === '') {
                ErrorUtil.throwError('Key is required');
            }

            if (targetTicker.exchange.trim() === '') {
                ErrorUtil.throwError('Exchange is required');
            }

            if (isNew) {
                const returnTicker = await TickerAPIUtil.create({
                    name: targetTicker.name,
                    key: targetTicker.key,
                    exchange: targetTicker.exchange
                });

                createTicker(returnTicker);
            } else {
                if (!ticker) {
                    ErrorUtil.throwError('Ticker not found');
                }

                const returnTicker = await TickerAPIUtil.update(ticker.id, {
                    name: targetTicker.name,
                    key: targetTicker.key,
                    exchange: targetTicker.exchange,
                    create: ticker.create || Date.now(),
                });

                updateTicker(returnTicker);
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
            title={isNew ? 'Create' : 'Edit'}
            onClose={onClose}
            onConfirm={onConfirm}
            confirmText={isNew ? 'Create' : 'Update'}
            closeText="Cancel"
        >
            {error && <ErrorAlert message={error} />}
            <BasicStack>
                <BasicTextField
                    label='Name'
                    value={targetTicker.name}
                    onChange={(e) => setTargetTicker({ ...targetTicker, name: e.target.value })}
                />
                <BasicTextField
                    label='Key'
                    value={targetTicker.key}
                    onChange={(e) => setTargetTicker({ ...targetTicker, key: e.target.value })}
                />
                <BasicSelect
                    label='Exchange'
                    options={ExchangeUtil.dataToSelectOptions(exchanges)}
                    value={targetTicker.exchange}
                    defaultValue={targetTicker.exchange}
                    onChange={(value) => setTargetTicker({ ...targetTicker, exchange: value })}
                />
            </BasicStack>
        </BasicDialog >
    )
}
