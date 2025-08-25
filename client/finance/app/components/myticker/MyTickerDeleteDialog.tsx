'use client';

import React from 'react';

import ErrorUtil from '@common/utils/ErrorUtil';

import { MyTickerDataType } from '@finance/interfaces/data/MyTickerDataType';

import BasicDialog from '@client-common/components/feedback/dialog/BasicDialog';

import MyTickerFetchService from '@/services/myticker/MyTickerFetchService.client';

type MyTickerDeleteDialogProps = {
    open: boolean;
    onClose: () => void;
    myTicker: MyTickerDataType | null;
    deleteMyTicker: (id: string) => void;
};

export default function MyTickerDeleteDialog({
    open,
    onClose,
    myTicker,
    deleteMyTicker
}: MyTickerDeleteDialogProps) {
    const onConfirm = async () => {
        if (!myTicker) {
            ErrorUtil.throwError('MyTicker not found');
        }

        const fetchService = new MyTickerFetchService();
        await fetchService.delete(myTicker.id);

        deleteMyTicker(myTicker.id);
        onClose();
    }

    return (
        <BasicDialog
            open={open}
            title='Delete MyTicker'
            onClose={onClose}
            onConfirm={onConfirm}
            confirmText='Delete'
            closeText='Cancel'
        >
            <div>削除しますか？</div>
        </BasicDialog>
    );
}
