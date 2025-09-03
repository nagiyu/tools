/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useEffect } from 'react';

import { FinanceNotificationConditionType, FINANCE_NOTIFICATION_CONDITION_TYPE, FinanceNotificationModeType, FINANCE_NOTIFICATION_MODE, BUY_CONDITIONS, SELL_CONDITIONS, FINANCE_NOTIFICATION_FREQUENCY, FinanceNotificationFrequencyType } from '@finance/types/FinanceNotificationType';
import { FinanceNotificationDataType } from '@finance/interfaces/data/FinanceNotificationDataType';

import BasicSelect from '@client-common/components/inputs/Selects/BasicSelect';
import BasicNumberField from '@client-common/components/inputs/TextFields/BasicNumberField';
import ControlledCheckbox from '@client-common/components/inputs/checkbox/ControlledCheckbox';

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

// Condition labels for the notification system
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

    // Helper function to update selected conditions with mutual exclusivity for price conditions
    const updateConditions = (conditionType: FinanceNotificationConditionType, checked: boolean) => {
        let selectedConditions = getSelectedConditions();
        
        if (checked) {
            // If selecting a price condition, remove the other price condition first
            if (conditionType === FINANCE_NOTIFICATION_CONDITION_TYPE.GREATER_THAN) {
                selectedConditions = selectedConditions.filter(c => c !== FINANCE_NOTIFICATION_CONDITION_TYPE.LESS_THAN);
            } else if (conditionType === FINANCE_NOTIFICATION_CONDITION_TYPE.LESS_THAN) {
                selectedConditions = selectedConditions.filter(c => c !== FINANCE_NOTIFICATION_CONDITION_TYPE.GREATER_THAN);
            }
            
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

    // Determine if condition value is needed
    const selectedConditions = getSelectedConditions();
    const needsConditionValue = selectedConditions.includes(FINANCE_NOTIFICATION_CONDITION_TYPE.GREATER_THAN) || selectedConditions.includes(FINANCE_NOTIFICATION_CONDITION_TYPE.LESS_THAN);

    useEffect(() => {
        if (exchanges.length === 0 || tickers.length === 0) {
            return;
        }

        const exchangeId = item.exchangeId.trim() === '' ? exchanges[0].id : item.exchangeId;
        const filteredTickers = tickers.filter(t => t.exchange === exchangeId);
        const tickerId = filteredTickers.find(t => t.id === item.tickerId)
            ? item.tickerId
            : (filteredTickers.length > 0 ? filteredTickers[0].id : '');

        // Ensure new items have a default mode if not set
        const mode = item.mode || FINANCE_NOTIFICATION_MODE.BUY;

        onItemChange({
            ...item,
            exchangeId: exchangeId,
            tickerId: tickerId,
            mode: mode,
            conditions: item.conditions || JSON.stringify([])
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
            <fieldset disabled={loading} style={{ border: 'none', padding: 0, margin: '16px 0' }}>
                <legend style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '8px' }}>通知モード</legend>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input
                            type="radio"
                            name="notificationMode"
                            value={FINANCE_NOTIFICATION_MODE.BUY}
                            checked={(item.mode || FINANCE_NOTIFICATION_MODE.BUY) === FINANCE_NOTIFICATION_MODE.BUY}
                            disabled={loading}
                            onChange={(e) => {
                                const newMode = e.target.value as FinanceNotificationModeType;
                                onItemChange({
                                    ...item,
                                    mode: newMode,
                                    conditions: JSON.stringify([])
                                });
                            }}
                        />
                        買い
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input
                            type="radio"
                            name="notificationMode"
                            value={FINANCE_NOTIFICATION_MODE.SELL}
                            checked={(item.mode || FINANCE_NOTIFICATION_MODE.BUY) === FINANCE_NOTIFICATION_MODE.SELL}
                            disabled={loading}
                            onChange={(e) => {
                                const newMode = e.target.value as FinanceNotificationModeType;
                                onItemChange({
                                    ...item,
                                    mode: newMode,
                                    conditions: JSON.stringify([])
                                });
                            }}
                        />
                        売り
                    </label>
                </div>
            </fieldset>

            {/* Notification Frequency Selection */}
            <fieldset disabled={loading} style={{ border: 'none', padding: 0, margin: '16px 0' }}>
                <legend style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '8px' }}>通知頻度</legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input
                            type="radio"
                            name="notificationFrequency"
                            value={FINANCE_NOTIFICATION_FREQUENCY.MINUTE_LEVEL}
                            checked={(item.frequency || FINANCE_NOTIFICATION_FREQUENCY.MINUTE_LEVEL) === FINANCE_NOTIFICATION_FREQUENCY.MINUTE_LEVEL}
                            disabled={loading}
                            onChange={(e) => {
                                const newFrequency = e.target.value as FinanceNotificationFrequencyType;
                                onItemChange({
                                    ...item,
                                    frequency: newFrequency
                                });
                            }}
                        />
                        <span>
                            1分ごと
                            <br />
                            <small style={{ color: '#666', fontSize: '0.75rem' }}>
                                価格条件は1分ごと、パターン条件は取引開始時のみ通知
                            </small>
                        </span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input
                            type="radio"
                            name="notificationFrequency"
                            value={FINANCE_NOTIFICATION_FREQUENCY.EXCHANGE_START_ONLY}
                            checked={(item.frequency || FINANCE_NOTIFICATION_FREQUENCY.MINUTE_LEVEL) === FINANCE_NOTIFICATION_FREQUENCY.EXCHANGE_START_ONLY}
                            disabled={loading}
                            onChange={(e) => {
                                const newFrequency = e.target.value as FinanceNotificationFrequencyType;
                                onItemChange({
                                    ...item,
                                    frequency: newFrequency
                                });
                            }}
                        />
                        <span>
                            取引開始時のみ
                            <br />
                            <small style={{ color: '#666', fontSize: '0.75rem' }}>
                                すべての条件で取引開始時にのみ通知
                            </small>
                        </span>
                    </label>
                </div>
            </fieldset>

            {/* New mode-based condition selection */}
            <div style={{ marginTop: '16px' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '1.25rem', fontWeight: 500 }}>
                    {item.mode === FINANCE_NOTIFICATION_MODE.BUY ? '買い条件' : '売り条件'}
                </h3>
                
                {(item.mode === FINANCE_NOTIFICATION_MODE.BUY ? BUY_CONDITIONS : SELL_CONDITIONS).map((conditionType) => {
                    // Check if this is a price condition that should be disabled due to mutual exclusivity
                    const isPriceCondition = conditionType === FINANCE_NOTIFICATION_CONDITION_TYPE.GREATER_THAN || conditionType === FINANCE_NOTIFICATION_CONDITION_TYPE.LESS_THAN;
                    const isOtherPriceConditionSelected = isPriceCondition && selectedConditions.some(c => 
                        c !== conditionType && (c === FINANCE_NOTIFICATION_CONDITION_TYPE.GREATER_THAN || c === FINANCE_NOTIFICATION_CONDITION_TYPE.LESS_THAN)
                    );
                    const isCurrentlySelected = selectedConditions.includes(conditionType);
                    const isDisabled = loading || (isPriceCondition && isOtherPriceConditionSelected && !isCurrentlySelected);

                    return (
                        <div key={conditionType} style={{ marginBottom: '8px' }}>
                            <ControlledCheckbox
                                label={conditionLabels[conditionType]}
                                checked={isCurrentlySelected}
                                disabled={isDisabled}
                                onChange={(e) => updateConditions(conditionType, e.target.checked)}
                            />
                            <p style={{ marginLeft: '32px', marginTop: '4px', fontSize: '0.875rem', color: '#666' }}>
                                {getConditionDescription(conditionType, item.mode)}
                            </p>
                        </div>
                    );
                })}
            </div>
            
            {needsConditionValue && (
                <BasicNumberField
                    label='目標価格'
                    value={item.conditionValue}
                    disabled={loading}
                    onChange={(value) => onItemChange({ ...item, conditionValue: Number(value.target.value) })}
                />
            )}
        </>
    );
}
