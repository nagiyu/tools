/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import { useEffect, useState } from 'react';

import ErrorUtil from '@common/utils/ErrorUtil';
import { DataTypeBase } from '@common/interfaces/data/DataTypeBase';

import BasicDialog from '@client-common/components/feedback/dialog/BasicDialog';
import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import ErrorAlert from '@client-common/components/feedback/alert/ErrorAlert';

// Base props without state management  
interface BaseEditDialogProps<ItemType extends DataTypeBase> {
    open: boolean;
    title: string;
    onClose: () => void;
    isNew: boolean;
    initItem: ItemType;
    defaultItem: ItemType;
    validateItem: (data: ItemType) => string | null;
    onCreate: (data: ItemType) => Promise<void>;
    onUpdate: (data: ItemType) => Promise<void>;
}

// Props with state management
interface StatefulEditDialogProps<ItemType extends DataTypeBase, StateType extends Record<string, unknown>> extends BaseEditDialogProps<ItemType> {
    initState: StateType;
    defaultState: StateType;
    children: (
        item: ItemType,
        state: StateType,
        onItemChange: (updates: ItemType) => void,
        onStateChange: (updates: StateType) => void
    ) => React.ReactNode;
}

// Props without state management (simplified)
interface StatelessEditDialogProps<ItemType extends DataTypeBase> extends BaseEditDialogProps<ItemType> {
    initState?: never;
    defaultState?: never;
    children: (
        item: ItemType,
        onItemChange: (updates: ItemType) => void
    ) => React.ReactNode;
}

type EditDialogProps<ItemType extends DataTypeBase, StateType extends Record<string, unknown> = Record<string, unknown>> =
    | StatefulEditDialogProps<ItemType, StateType>
    | StatelessEditDialogProps<ItemType>;

// Function overloads for type safety
function EditDialog<ItemType extends DataTypeBase, StateType extends Record<string, unknown>>(
    props: StatefulEditDialogProps<ItemType, StateType>
): React.ReactElement;
function EditDialog<ItemType extends DataTypeBase>(
    props: StatelessEditDialogProps<ItemType>
): React.ReactElement;
function EditDialog<ItemType extends DataTypeBase, StateType extends Record<string, unknown> = Record<string, unknown>>({
    open,
    title,
    onClose,
    isNew,
    initItem,
    initState,
    defaultItem,
    defaultState,
    validateItem,
    onCreate,
    onUpdate,
    children
}: EditDialogProps<ItemType, StateType>) {
    const [item, setItem] = useState<ItemType>(defaultItem);
    const [error, setError] = useState<string | null>(null);

    // Check if this is a stateful component
    const isStateful = initState !== undefined && defaultState !== undefined;
    const actualInitState = initState || ({} as StateType);
    const actualDefaultState = defaultState || ({} as StateType);
    
    const [state, setState] = useState<StateType>(actualDefaultState);

    useEffect(() => {
        if (!open) return;

        const itemData = isNew ? { ...defaultItem } : { ...initItem };
        const stateData = isNew ? { ...actualDefaultState } : { ...actualInitState };

        setItem(itemData);
        setState(stateData);
        setError(null);
    }, [open]);

    const onItemChange = (updates: ItemType) => {
        setItem((prev) => ({ ...prev, ...updates }));
    };

    const onStateChange = (updates: Record<string, unknown>) => {
        setState((prev) => ({ ...prev, ...updates }));
    };

    const onConfirm = async () => {
        setError(null);

        try {
            const formError = validateItem(item);

            if (formError) {
                ErrorUtil.throwError(formError);
            }

            if (isNew) {
                await onCreate(item);
            } else {
                await onUpdate(item);
            }

            onClose();
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('不明なエラーが発生しました');
            }
        }
    };

    return (
        <BasicDialog
            open={open}
            title={title}
            onClose={onClose}
            onConfirm={onConfirm}
            confirmText={isNew ? 'Create' : 'Update'}
            closeText='Cancel'
        >
            {error && <ErrorAlert message={error} />}
            <BasicStack>
                {isStateful 
                    ? (children as any)(item, state, onItemChange, onStateChange)
                    : (children as any)(item, onItemChange)
                }
            </BasicStack>
        </BasicDialog>
    );
}

export default EditDialog;
