/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useEffect } from 'react';
import { RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, Box, Typography } from '@mui/material';

import { FinanceNotificationConditionType, FINANCE_NOTIFICATION_CONDITION_TYPE, FinanceNotificationModeType, FINANCE_NOTIFICATION_MODE, BUY_CONDITIONS, SELL_CONDITIONS } from '@finance/types/FinanceNotificationType';
import { FinanceNotificationDataType } from '@finance/interfaces/data/FinanceNotificationDataType';

import BasicSelect from '@client-common/components/inputs/Selects/BasicSelect';
import BasicNumberField from '@client-common/components/inputs/TextFields/BasicNumberField';
import ControlledCheckbox from '@client-common/components/inputs/checkbox/ControlledCheckbox';
import { SelectOptionType } from '@client-common/interfaces/SelectOptionType';

import ExchangeUtil from '@/utils/ExchangeUtil';
import TickerUtil from '@/utils/TickerUtil';
import { ExchangeDataType } from '@/interfaces/data/ExchangeDataType';
import { TickerDataType } from '@/interfaces/data/TickerDataType';
import { StateType } from '@/app/finance-notification/page';

interface FinanceNotificationEditDialogContentProps {
    item: FinanceNotificationDataType;
    state: StateType;
    onItemChange: (item: FinanceNotificationDataType) => void;
    onStateChange: (state: StateType) => void;
    loading?: boolean;
    exchanges: ExchangeDataType[];
    tickers: TickerDataType[];
}

// Legacy condition options for backward compatibility
const legacyConditionTypeOptions: SelectOptionType[] = [
    { value: FINANCE_NOTIFICATION_CONDITION_TYPE.GREATER_THAN, label: FINANCE_NOTIFICATION_CONDITION_TYPE.GREATER_THAN },
    { value: FINANCE_NOTIFICATION_CONDITION_TYPE.LESS_THAN, label: FINANCE_NOTIFICATION_CONDITION_TYPE.LESS_THAN },
    { value: FINANCE_NOTIFICATION_CONDITION_TYPE.THREE_RED_SOLDIERS, label: 'Three Red Soldiers (赤三兵)' },
    { value: FINANCE_NOTIFICATION_CONDITION_TYPE.THREE_RIVER_EVENING_STAR, label: 'Three River Evening Star (三川明けの明星)' },
];

// Condition labels for the new system
const conditionLabels: Record<FinanceNotificationConditionType, string> = {
    [FINANCE_NOTIFICATION_CONDITION_TYPE.GREATER_THAN]: '指定価格を上回る',
    [FINANCE_NOTIFICATION_CONDITION_TYPE.LESS_THAN]: '指定価格を下回る', 
    [FINANCE_NOTIFICATION_CONDITION_TYPE.THREE_RED_SOLDIERS]: 'Three Red Soldiers (赤三兵)',
    [FINANCE_NOTIFICATION_CONDITION_TYPE.THREE_RIVER_EVENING_STAR]: 'Three River Evening Star (三川明けの明星)',
};

// Condition descriptions - function to provide context-aware descriptions
const getConditionDescription = (conditionType: FinanceNotificationConditionType, mode?: FinanceNotificationModeType): string => {
    switch (conditionType) {
        case FINANCE_NOTIFICATION_CONDITION_TYPE.GREATER_THAN:
            if (mode === FINANCE_NOTIFICATION_MODE.BUY) {
                return '株価が指定した価格を上回った時に通知します（ブレイクアウト買いなど）';
            } else if (mode === FINANCE_NOTIFICATION_MODE.SELL) {
                return '株価が指定した価格を上回った時に通知します（利益確定売りなど）';
            } else {
                return '株価が指定した価格を上回った時に通知します';
            }
        case FINANCE_NOTIFICATION_CONDITION_TYPE.LESS_THAN:
            if (mode === FINANCE_NOTIFICATION_MODE.BUY) {
                return '株価が指定した価格を下回った時に通知します（押し目買いなど）';
            } else if (mode === FINANCE_NOTIFICATION_MODE.SELL) {
                return '株価が指定した価格を下回った時に通知します（損切り売りなど）';
            } else {
                return '株価が指定した価格を下回った時に通知します';
            }
        case FINANCE_NOTIFICATION_CONDITION_TYPE.THREE_RED_SOLDIERS:
            return '3本の連続する強気ローソク足パターンを検出した時に通知します';
        case FINANCE_NOTIFICATION_CONDITION_TYPE.THREE_RIVER_EVENING_STAR:
            return '潜在的な反転シグナルパターンを検出した時に通知します';
        default:
            return '';
    }
};

export default function FinanceNotificationEditDialogContent({
    item,
    state,
    onItemChange,
    onStateChange,
    loading,
    exchanges,
    tickers,
}: FinanceNotificationEditDialogContentProps) {
    // Helper function to parse selected conditions
    const getSelectedConditions = (): FinanceNotificationConditionType[] => {
        if (item.conditions) {
            try {
                return JSON.parse(item.conditions);
            } catch (error) {
                console.error('Error parsing conditions:', error);
                return [];
            }
        }
        return [];
    };

    // Helper function to update selected conditions
    const updateConditions = (conditionType: FinanceNotificationConditionType, checked: boolean) => {
        let selectedConditions = getSelectedConditions();
        
        if (checked) {
            if (!selectedConditions.includes(conditionType)) {
                selectedConditions.push(conditionType);
            }
        } else {
            selectedConditions = selectedConditions.filter(c => c !== conditionType);
        }
        
        onItemChange({
            ...item,
            conditions: JSON.stringify(selectedConditions)
        });
    };

    // Check if using new mode-based system
    const isLegacyMode = !item.mode;
    
    // Determine if condition value is needed
    const selectedConditions = getSelectedConditions();
    const needsConditionValue = isLegacyMode 
        ? (item.conditionType === FINANCE_NOTIFICATION_CONDITION_TYPE.GREATER_THAN || item.conditionType === FINANCE_NOTIFICATION_CONDITION_TYPE.LESS_THAN)
        : selectedConditions.includes(FINANCE_NOTIFICATION_CONDITION_TYPE.GREATER_THAN) || selectedConditions.includes(FINANCE_NOTIFICATION_CONDITION_TYPE.LESS_THAN);

    useEffect(() => {
        if (exchanges.length === 0 || tickers.length === 0) {
            return;
        }

        const exchangeId = item.exchangeId.trim() === '' ? exchanges[0].id : item.exchangeId;
        const filteredTickers = tickers.filter(t => t.exchange === exchangeId);
        const tickerId = filteredTickers.find(t => t.id === item.tickerId)
            ? item.tickerId
            : (filteredTickers.length > 0 ? filteredTickers[0].id : '');

        onItemChange({
            ...item,
            exchangeId: exchangeId,
            tickerId: tickerId
        });
        onStateChange({ ...state, filteredTickers });
    }, [exchanges, tickers]);

    return (
        <>
            <BasicSelect
                label='Exchange'
                options={ExchangeUtil.dataToSelectOptions(exchanges)}
                value={item.exchangeId}
                disabled={loading}
                onChange={(value) => {
                    const filteredTickers = tickers.filter(t => t.exchange === value);
                    onItemChange({ ...item, exchangeId: value, tickerId: filteredTickers.length > 0 ? filteredTickers[0].id : '' });
                    onStateChange({ ...state, filteredTickers });
                }}
            />
            <BasicSelect
                label='Ticker'
                options={TickerUtil.dataToSelectOptions(state.filteredTickers)}
                value={item.tickerId}
                disabled={loading || !item.exchangeId}
                onChange={(value) => onItemChange({ ...item, tickerId: value })}
            />
            
            {/* Mode Selection */}
            <FormControl component="fieldset" disabled={loading}>
                <FormLabel component="legend">通知モード</FormLabel>
                <RadioGroup
                    row
                    value={item.mode || 'legacy'}
                    onChange={(e) => {
                        const newMode = e.target.value;
                        if (newMode === 'legacy') {
                            // Switch to legacy mode
                            onItemChange({
                                ...item,
                                mode: undefined,
                                conditions: undefined,
                                conditionType: FINANCE_NOTIFICATION_CONDITION_TYPE.GREATER_THAN
                            });
                        } else {
                            // Switch to new mode
                            onItemChange({
                                ...item,
                                mode: newMode as FinanceNotificationModeType,
                                conditions: JSON.stringify([])
                            });
                        }
                    }}
                >
                    <FormControlLabel value="legacy" control={<Radio />} label="シンプルモード" />
                    <FormControlLabel value={FINANCE_NOTIFICATION_MODE.BUY} control={<Radio />} label="買い" />
                    <FormControlLabel value={FINANCE_NOTIFICATION_MODE.SELL} control={<Radio />} label="売り" />
                </RadioGroup>
            </FormControl>

            {isLegacyMode ? (
                // Legacy single condition selection
                <>
                    <BasicSelect
                        label='Condition Type'
                        options={legacyConditionTypeOptions}
                        value={item.conditionType}
                        disabled={loading}
                        onChange={(value) => onItemChange({ ...item, conditionType: value as FinanceNotificationConditionType })}
                    />
                    {(item.conditionType === FINANCE_NOTIFICATION_CONDITION_TYPE.GREATER_THAN || 
                      item.conditionType === FINANCE_NOTIFICATION_CONDITION_TYPE.LESS_THAN) && (
                        <BasicNumberField
                            label='Condition Value'
                            value={item.conditionValue}
                            disabled={loading}
                            onChange={(value) => onItemChange({ ...item, conditionValue: Number(value.target.value) })}
                        />
                    )}
                </>
            ) : (
                // New mode-based condition selection
                <>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            {item.mode === FINANCE_NOTIFICATION_MODE.BUY ? '買い条件' : '売り条件'}
                        </Typography>
                        
                        {(item.mode === FINANCE_NOTIFICATION_MODE.BUY ? BUY_CONDITIONS : SELL_CONDITIONS).map((conditionType) => (
                            <Box key={conditionType} sx={{ mb: 1 }}>
                                <ControlledCheckbox
                                    label={conditionLabels[conditionType]}
                                    checked={selectedConditions.includes(conditionType)}
                                    onChange={(e) => updateConditions(conditionType, e.target.checked)}
                                />
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5 }}>
                                    {getConditionDescription(conditionType, item.mode)}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                    
                    {needsConditionValue && (
                        <BasicNumberField
                            label='目標価格'
                            value={item.conditionValue}
                            disabled={loading}
                            onChange={(value) => onItemChange({ ...item, conditionValue: Number(value.target.value) })}
                        />
                    )}
                </>
            )}
        </>
    );
}
