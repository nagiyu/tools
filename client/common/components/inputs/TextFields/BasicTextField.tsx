import React from 'react';

import { TextField } from '@mui/material';

type BasicTextFieldProps = {
    label?: string;
    value?: string;
    readonly?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export default function BasicTextField({
    label = '',
    value = '',
    readonly = false,
    onChange = () => { },
}: BasicTextFieldProps) {
    return (
        <TextField
            label={label}
            value={value}
            slotProps={{
                input: {
                    readOnly: readonly,
                }
            }}
            onChange={onChange}
        />
    );
}
