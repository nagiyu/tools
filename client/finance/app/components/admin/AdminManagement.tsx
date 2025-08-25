/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useEffect, useState } from 'react';

import BasicTable, { Column } from '@client-common/components/data/table/BasicTable';
import ContainsButton from '@client-common/components/inputs/Buttons/ContainedButton';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';

import GenericDeleteDialog from './GenericDeleteDialog';

interface AdminManagementTableType {
    action: React.ReactNode;
}

export type AdminManagementProps<T> = {
    // Data and columns
    columns: Column<T & AdminManagementTableType>[];
    fetchData: () => Promise<T[]>;
    
    // Item operations
    getItemId: (item: T) => string;
    getItemDisplayName: (item: T) => string;
    
    // CRUD operations
    onCreate: (item: T) => void;
    onUpdate: (item: T) => void;
    onDelete: (id: string) => Promise<void> | void;
    
    // Dialog components
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    EditDialog: React.ComponentType<any>;
    
    // Additional props for EditDialog
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editDialogProps?: Record<string, any>;
    
    // Labels
    createButtonLabel?: string;
    itemName: string;
};

export default function AdminManagement<T>({
    columns,
    fetchData,
    getItemId,
    getItemDisplayName,
    onCreate,
    onUpdate,
    onDelete,
    EditDialog,
    editDialogProps = {},
    createButtonLabel = 'Create',
    itemName,
}: AdminManagementProps<T>) {
    const [items, setItems] = useState<(T & AdminManagementTableType)[]>([]);
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const dataToTable = (data: T): T & AdminManagementTableType => {
        return {
            ...data,
            action: (
                <DirectionStack>
                    <ContainsButton label='Edit' onClick={() => onEditClick(data)} />
                    <ContainsButton label='Delete' onClick={() => onDeleteClick(data)} />
                </DirectionStack>
            )
        };
    };

    const onCreateClick = () => {
        setSelectedItem(null);
        setIsNew(true);
        setEditDialogOpen(true);
    };

    const onEditClick = (item: T) => {
        setSelectedItem(item);
        setIsNew(false);
        setEditDialogOpen(true);
    };

    const onDeleteClick = (item: T) => {
        setSelectedItem(item);
        setDeleteDialogOpen(true);
    };

    const handleCreate = (item: T) => {
        setItems([...items, dataToTable(item)]);
        setEditDialogOpen(false);
        onCreate(item);
    };

    const handleUpdate = (item: T) => {
        setItems(items.map(t => (getItemId(t) === getItemId(item) ? dataToTable(item) : t)));
        setEditDialogOpen(false);
        onUpdate(item);
    };

    const handleDelete = async (id: string) => {
        await onDelete(id);
        setItems(items.filter(t => getItemId(t) !== id));
        setDeleteDialogOpen(false);
    };

    useEffect(() => {
        (async () => {
            const data = await fetchData();
            setItems(data.map(dataToTable));
        })();
    }, []);

    return (
        <>
            <ContainsButton label={createButtonLabel} onClick={onCreateClick} />
            <BasicTable columns={columns} data={items} />
            <EditDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                isNew={isNew}
                item={selectedItem}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                {...editDialogProps}
            />
            <GenericDeleteDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                item={selectedItem}
                itemName={itemName}
                getItemDisplayName={getItemDisplayName}
                onDelete={handleDelete}
                getItemId={getItemId}
            />
        </>
    );
}