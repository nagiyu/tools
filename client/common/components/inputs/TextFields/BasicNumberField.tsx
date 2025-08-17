import React from 'react';

import { TextField } from '@mui/material';

type BasicNumberFieldProps = {
    label?: string;
    value?: number;
    readonly?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export default function BasicNumberField({
    label = '',
    value = 0,
    readonly = false,
    onChange = () => { },
}: BasicNumberFieldProps) {
    return (
        <TextField
            label={label}
            value={value}
            type='number'
            slotProps={{
                input: {
                    readOnly: readonly,
                }
            }}
            onChange={onChange}
        />
    );
}
