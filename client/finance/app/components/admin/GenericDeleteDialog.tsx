'use client';

import React from 'react';

import ErrorUtil from '@common/utils/ErrorUtil';

import BasicDialog from '@client-common/components/feedback/dialog/BasicDialog';

type GenericDeleteDialogProps<T> = {
    open: boolean;
    onClose: () => void;
    item: T | null;
    itemName: string;
    getItemDisplayName: (item: T) => string;
    onDelete: (id: string) => Promise<void> | void;
    getItemId: (item: T) => string;
};

export default function GenericDeleteDialog<T>({
    open,
    onClose,
    item,
    itemName,
    getItemDisplayName,
    onDelete,
    getItemId
}: GenericDeleteDialogProps<T>) {
    const onConfirm = async () => {
        if (!item) {
            ErrorUtil.throwError(`${itemName} not found`);
        }

        await onDelete(getItemId(item));
        onClose();
    }

    return (
        <BasicDialog
            open={open}
            title={`Delete ${itemName}`}
            onClose={onClose}
            onConfirm={onConfirm}
            confirmText='Delete'
            closeText='Cancel'
        >
            <div>{getItemDisplayName(item)}を削除しますか？</div>
        </BasicDialog>
    );
}