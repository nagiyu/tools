'use client';

import React from 'react';

import ErrorUtil from '@common/utils/ErrorUtil';

import BasicDialog from '@client-common/components/feedback/dialog/BasicDialog';

import { ExchangeDataType } from '@/interfaces/data/ExchangeDataType';

type DeleteDialogProps = {
    open: boolean;
    onClose: () => void;
    exchange: ExchangeDataType | null;
    deleteExchange: (id: string) => Promise<void>;
};

export default function DeleteDialog({
    open,
    onClose,
    exchange,
    deleteExchange
}: DeleteDialogProps) {
    const onConfirm = async () => {
        if (!exchange) {
            ErrorUtil.throwError("Exchange data is missing");
        }

        await deleteExchange(exchange.id);

        onClose();
    }

    return (
        <BasicDialog
            open={open}
            title='Delete Exchange'
            onClose={onClose}
            onConfirm={onConfirm}
            confirmText='Delete'
            closeText='Cancel'
        >
            <div>{exchange?.name}を削除しますか？</div>
        </BasicDialog>
    )
}
