/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useEffect, useState } from 'react';

import { DataTypeBase } from '@common/interfaces/data/DataTypeBase';

import BasicTable, { Column } from '@client-common/components/data/table/BasicTable';
import EditDialog from '@client-common/components/feedback/dialog/EditDialog';
import ContainsButton from '@client-common/components/inputs/Buttons/ContainedButton';
import DeleteDialog from '@client-common/components/feedback/dialog/DeleteDialog';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';

interface AdminManagementTableType {
    action: React.ReactNode;
}

// Base props without state management
interface BaseAdminManagementProps<ItemType extends DataTypeBase> {
    columns: Column<ItemType & AdminManagementTableType>[];
    fetchData: () => Promise<ItemType[]>;
    itemName: string;
    defaultItem: ItemType;
    validateItem: (data: ItemType) => string | null;
    onCreate: (item: ItemType) => Promise<ItemType>;
    onUpdate: (item: ItemType) => Promise<ItemType>;
    onDelete: (id: string) => Promise<void>;
}

// Props with state management
interface StatefulAdminManagementProps<ItemType extends DataTypeBase, StateType extends Record<string, unknown>> extends BaseAdminManagementProps<ItemType> {
    defaultState: StateType;
    generateState: (item: ItemType) => StateType;
    children: (
        item: ItemType,
        state: StateType,
        onItemChange: (updates: ItemType) => void,
        onStateChange: (updates: StateType) => void
    ) => React.ReactNode;
}

// Props without state management (simplified)
interface StatelessAdminManagementProps<ItemType extends DataTypeBase> extends BaseAdminManagementProps<ItemType> {
    defaultState?: never;
    generateState?: never;
    children: (
        item: ItemType,
        onItemChange: (updates: ItemType) => void
    ) => React.ReactNode;
}

type AdminManagementProps<ItemType extends DataTypeBase, StateType extends Record<string, unknown> = Record<string, unknown>> =
    | StatefulAdminManagementProps<ItemType, StateType>
    | StatelessAdminManagementProps<ItemType>;

// Function overloads for type safety
function AdminManagement<ItemType extends DataTypeBase, StateType extends Record<string, unknown>>(
    props: StatefulAdminManagementProps<ItemType, StateType>
): React.ReactElement;
function AdminManagement<ItemType extends DataTypeBase>(
    props: StatelessAdminManagementProps<ItemType>
): React.ReactElement;
function AdminManagement<ItemType extends DataTypeBase, StateType extends Record<string, unknown> = Record<string, unknown>>({
    columns,
    fetchData,
    itemName,
    defaultItem,
    defaultState,
    generateState,
    validateItem,
    onCreate,
    onUpdate,
    onDelete,
    children
}: AdminManagementProps<ItemType, StateType>) {
    const [items, setItems] = useState<(ItemType & AdminManagementTableType)[]>([]);
    const [item, setItem] = useState<ItemType>(defaultItem);
    const [isNew, setIsNew] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Check if this is a stateful component
    const isStateful = defaultState !== undefined && generateState !== undefined;
    const actualDefaultState = defaultState || ({} as StateType);
    const actualGenerateState = generateState || (() => ({} as StateType));

    const itemToTable = (item: ItemType): ItemType & AdminManagementTableType => {
        return {
            ...item,
            action: (
                <DirectionStack>
                    <ContainsButton label='Edit' onClick={() => onEditClick(item)} />
                    <ContainsButton label='Delete' onClick={() => onDeleteClick(item)} />
                </DirectionStack>
            )
        };
    };

    const onCreateClick = async () => {
        setItem(defaultItem);
        setIsNew(true);
        setEditDialogOpen(true);
    };

    const onEditClick = async (item: ItemType) => {
        setItem(item);
        setIsNew(false);
        setEditDialogOpen(true);
    };

    const onDeleteClick = (item: ItemType) => {
        setItem(item);
        setDeleteDialogOpen(true);
    };

    const handleCreate = async (item: ItemType) => {
        const createdItem = await onCreate(item);
        setItems([...items, itemToTable(createdItem)]);
        setEditDialogOpen(false);
    };

    const handleUpdate = async (item: ItemType) => {
        const updatedItem = await onUpdate(item);
        setItems(items.map(t => (t.id === item.id ? itemToTable(updatedItem) : t)));
        setEditDialogOpen(false);
    };

    const handleDelete = async (id: string) => {
        await onDelete(id);
        setItems(items.filter(t => t.id !== id));
        setDeleteDialogOpen(false);
    };

    useEffect(() => {
        (async () => {
            const data = await fetchData();
            setItems(data.map(itemToTable));
        })();
    }, []);

    return (
        <>
            <ContainsButton label='Create' onClick={onCreateClick} />
            <BasicTable columns={columns} data={items} />
            <EditDialog
                open={editDialogOpen}
                title={isNew ? `Create ${itemName}` : `Edit ${itemName}`}
                onClose={() => setEditDialogOpen(false)}
                isNew={isNew}
                initItem={item}
                initState={isStateful ? actualGenerateState(item) : undefined}
                defaultItem={defaultItem}
                defaultState={isStateful ? actualDefaultState : undefined}
                validateItem={validateItem}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                children={children as any} // Type assertion needed for union type
            />
            <DeleteDialog
                open={deleteDialogOpen}
                title={`Delete ${itemName}`}
                onClose={() => setDeleteDialogOpen(false)}
                itemID={item.id}
                itemName={itemName}
                onDelete={handleDelete}
            />
        </>
    );
}

export default AdminManagement;