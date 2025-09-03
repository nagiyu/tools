import React from 'react';
import { TextField, Button, Box } from '@mui/material';

import CurrencyUtil from '@common/utils/CurrencyUtil';

type CurrencyNumberFieldProps = {
    label?: string;
    value?: number;
    readonly?: boolean;
    disabled?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onValueChange?: (value: number) => void;
};

export default function CurrencyNumberField({
    label = '',
    value = 0,
    readonly = false,
    disabled = false,
    onChange = () => { },
    onValueChange = () => { },
}: CurrencyNumberFieldProps) {
    const handleUsdToJpy = () => {
        const convertedValue = CurrencyUtil.convertUsdToJpy(value);
        onValueChange(convertedValue);
    };

    const handleJpyToUsd = () => {
        const convertedValue = CurrencyUtil.convertJpyToUsd(value);
        onValueChange(convertedValue);
    };

    return (
        <Box>
            <TextField
                label={label}
                value={value}
                type='number'
                disabled={disabled}
                slotProps={{
                    input: {
                        readOnly: readonly,
                    }
                }}
                onChange={onChange}
                fullWidth
            />
            {!readonly && !disabled && (
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={handleUsdToJpy}
                        sx={{ fontSize: '0.75rem', minWidth: 'auto', px: 1 }}
                    >
                        USD→円
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={handleJpyToUsd}
                        sx={{ fontSize: '0.75rem', minWidth: 'auto', px: 1 }}
                    >
                        円→USD
                    </Button>
                </Box>
            )}
        </Box>
    );
}