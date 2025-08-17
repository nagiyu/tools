'use client';

import React from 'react';

import ErrorUtil from '@common/utils/ErrorUtil';

import BasicDialog from '@client-common/components/feedback/dialog/BasicDialog';

import TickerAPIUtil from '@/app/tickers/TickerAPIUtil';
import { TickerDataType } from '@/interfaces/data/TickerDataType';

type TickerDeleteDialogProps = {
    open: boolean;
    onClose: () => void;
    ticker: TickerDataType | null;
    deleteTicker: (id: string) => void;
};

export default function TickerDeleteDialog({
    open,
    onClose,
    ticker,
    deleteTicker
}: TickerDeleteDialogProps) {
    const onConfirm = async () => {
        if (!ticker) {
            ErrorUtil.throwError('Ticker not found');
        }

        await TickerAPIUtil.delete(ticker.id);

        deleteTicker(ticker.id);
        onClose();
    }

    return (
        <BasicDialog
            open={open}
            title="Delete Ticker"
            onClose={onClose}
            onConfirm={onConfirm}
            confirmText="Delete"
            closeText="Cancel"
        >
            <div>{ticker?.name}を削除しますか？</div>
        </BasicDialog>
    )
}
