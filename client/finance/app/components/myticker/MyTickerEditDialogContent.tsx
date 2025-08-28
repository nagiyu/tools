import React from 'react';

import DateUtil from '@common/utils/DateUtil';

import { MyTickerDataType } from '@finance/interfaces/data/MyTickerDataType';

import BasicSelect from '@client-common/components/inputs/Selects/BasicSelect';
import BasicDatePicker from '@client-common/components/inputs/Dates/BasicDatePicker';
import BasicNumberField from '@client-common/components/inputs/TextFields/BasicNumberField';
import ControlledCheckbox from '@client-common/components/inputs/checkbox/ControlledCheckbox';

import ExchangeUtil from '@/utils/ExchangeUtil';
import TickerUtil from '@/utils/TickerUtil';
import { TickerDataType } from '@/interfaces/data/TickerDataType';
import { ExchangeDataType } from '@/interfaces/data/ExchangeDataType';
import { StateType } from '@/app/myticker/page';

interface MyTickerEditDialogContentProps {
    item: MyTickerDataType;
    state: StateType;
    onItemChange: (item: MyTickerDataType) => void;
    onStateChange: (state: StateType) => void;
    exchanges: ExchangeDataType[];
    tickers: TickerDataType[];
}

export default function MyTickerEditDialogContent({
    item,
    state,
    onItemChange,
    onStateChange,
    exchanges,
    tickers,
}: MyTickerEditDialogContentProps) {
    return (
        <>
            <BasicSelect
                label='Exchange'
                options={ExchangeUtil.dataToSelectOptions(exchanges)}
                value={item.exchangeId}
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
                onChange={(value) => onItemChange({ ...item, tickerId: value })}
            />
            <BasicDatePicker
                label='Purchase Date'
                value={new Date(item.purchaseDate)}
                onChange={(date) => onItemChange({ ...item, purchaseDate: date ? DateUtil.toStartOfDay(date) : DateUtil.getTodayStartTimestamp() })}
            />
            <BasicNumberField
                label='Purchase Price'
                value={item.purchasePrice}
                onChange={(e) => onItemChange({ ...item, purchasePrice: Number(e.target.value) })}
            />
            <BasicNumberField
                label='Quantity'
                value={item.quantity}
                onChange={(e) => onItemChange({ ...item, quantity: Number(e.target.value) })}
            />
            <ControlledCheckbox
                label='Sell'
                checked={state.isSell}
                onChange={(e) => {
                    onStateChange({ ...state, isSell: e.target.checked });
                    if (!e.target.checked) {
                        onItemChange({ ...item, sellDate: null, sellPrice: null });
                    }
                }}
            />
            {state.isSell && (
                <>
                    <BasicDatePicker
                        label='Sell Date'
                        value={item.sellDate ? new Date(item.sellDate) : null}
                        onChange={(date) => onItemChange({ ...item, sellDate: date ? DateUtil.toStartOfDay(date) : null })}
                    />
                    <BasicNumberField
                        label='Sell Price'
                        value={item.sellPrice || 0}
                        onChange={(e) => onItemChange({ ...item, sellPrice: Number(e.target.value) })}
                    />
                </>
            )}
        </>
    );
}
