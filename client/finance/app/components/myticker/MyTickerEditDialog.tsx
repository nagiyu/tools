/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import { useEffect, useState } from 'react';

import DateUtil from '@common/utils/DateUtil';
import ErrorUtil from '@common/utils/ErrorUtil';

import { MyTickerDataType } from '@finance/interfaces/data/MyTickerDataType';

import AuthFetchService from '@client-common/services/auth/AuthFetchService.client';
import BasicDatePicker from '@client-common/components/inputs/Dates/BasicDatePicker';
import BasicDialog from '@client-common/components/feedback/dialog/BasicDialog';
import BasicNumberField from '@client-common/components/inputs/TextFields/BasicNumberField';
import BasicSelect from '@client-common/components/inputs/Selects/BasicSelect';
import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import ControlledCheckbox from '@client-common/components/inputs/checkbox/ControlledCheckbox';
import ErrorAlert from '@client-common/components/feedback/alert/ErrorAlert';

import ExchangeUtil from '@/utils/ExchangeUtil';
import MyTickerFetchService from '@/services/myticker/MyTickerFetchService.client';
import TickerUtil from '@/utils/TickerUtil';
import { ExchangeDataType } from '@/interfaces/data/ExchangeDataType';
import { TickerDataType } from '@/interfaces/data/TickerDataType';

interface TargetMyTicker {
    exchangeId: string;
    tickerId: string;
    purchaseDate: number;
    purchasePrice: number;
    quantity: number;
    sellDate: number | null;
    sellPrice: number | null;
}

type MyTickerEditDialogProps = {
    open: boolean;
    onClose: () => void;
    isNew: boolean;
    myTicker: MyTickerDataType | null;
    exchanges: ExchangeDataType[];
    allTickers: TickerDataType[];
    createMyTicker: (data: MyTickerDataType) => void;
    updateMyTicker: (data: MyTickerDataType) => void;
}

export default function MyTickerEditDialog({
    open,
    onClose,
    isNew,
    myTicker,
    exchanges,
    allTickers,
    createMyTicker,
    updateMyTicker
}: MyTickerEditDialogProps) {
    const [tickers, setTickers] = useState<TickerDataType[]>([]);
    const [targetMyTicker, setTargetMyTicker] = useState<TargetMyTicker>({
        exchangeId: '',
        tickerId: '',
        purchaseDate: DateUtil.getTodayStartTimestamp(),
        purchasePrice: 0,
        quantity: 0,
        sellDate: null,
        sellPrice: null
    });
    const [isSell, setIsSell] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setTargetMyTicker({
            exchangeId: myTicker?.exchangeId || exchanges[0]?.id || '',
            tickerId: myTicker?.tickerId || '',
            purchaseDate: myTicker?.purchaseDate || DateUtil.getTodayStartTimestamp(),
            purchasePrice: myTicker?.purchasePrice || 0,
            quantity: myTicker?.quantity || 0,
            sellDate: myTicker?.sellDate || null,
            sellPrice: myTicker?.sellPrice || null
        });

        // sellDateまたはsellPriceが設定されていればisSellをtrueにする
        if (myTicker && (myTicker.sellDate || myTicker.sellPrice)) {
            setIsSell(true);
        } else {
            setIsSell(false);
        }
    }, [open]);

    useEffect(() => {
        const filteredTickers = allTickers.filter(t => t.exchange === targetMyTicker.exchangeId);

        setTickers(filteredTickers);

        if (filteredTickers.length > 0) {
            setTargetMyTicker(prev => ({
                ...prev,
                tickerId: filteredTickers[0].id
            }));
        }
    }, [targetMyTicker.exchangeId]);

    const onConfirm = async () => {
        setError(null);
        try {
            if (!targetMyTicker.exchangeId) {
                ErrorUtil.throwError('Exchange is required');
            }

            if (!targetMyTicker.tickerId) {
                ErrorUtil.throwError('Ticker is required');
            }

            if (targetMyTicker.purchasePrice < 0) {
                ErrorUtil.throwError('Purchase price must be non-negative');
            }

            if (targetMyTicker.quantity <= 0) {
                ErrorUtil.throwError('Quantity must be greater than zero');
            }

            // isSellがオフの場合は売却情報をクリア
            const fixedTargetMyTicker = !isSell
                ? { ...targetMyTicker, sellDate: null, sellPrice: null }
                : targetMyTicker;

            const fetchService = new MyTickerFetchService();

            const authFetchService = new AuthFetchService();
            const user = await authFetchService.getUserByGoogle();
            const userId = user.id;

            const now = Date.now();

            if (isNew) {
                const fetchRequest: MyTickerDataType = {
                    ...fixedTargetMyTicker,
                    id: '',
                    userId,
                    create: now,
                    update: now
                };

                const returnMyTicker = await fetchService.create(fetchRequest);

                createMyTicker(returnMyTicker);
            } else {
                if (!myTicker) {
                    ErrorUtil.throwError('MyTicker not found');
                }

                const fetchRequest: MyTickerDataType = {
                    ...fixedTargetMyTicker,
                    id: myTicker.id,
                    userId,
                    create: myTicker.create,
                    update: now
                };

                const returnMyTicker = await fetchService.update(fetchRequest);

                updateMyTicker(returnMyTicker);
            }

            onClose();
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("不明なエラーが発生しました");
            }
        }
    };

    return (
        <BasicDialog
            open={open}
            title={isNew ? 'Create My Ticker' : 'Edit My Ticker'}
            onClose={onClose}
            onConfirm={onConfirm}
            confirmText={isNew ? 'Create' : 'Update'}
            closeText='Cancel'
        >
            {error && <ErrorAlert message={error} />}
            <BasicStack>
                <BasicSelect
                    label='Exchange'
                    options={ExchangeUtil.dataToSelectOptions(exchanges)}
                    value={targetMyTicker.exchangeId}
                    defaultValue={targetMyTicker.exchangeId}
                    onChange={(value) => setTargetMyTicker({ ...targetMyTicker, exchangeId: value })}
                />
                <BasicSelect
                    label='Ticker'
                    options={TickerUtil.dataToSelectOptions(tickers)}
                    value={targetMyTicker.tickerId}
                    defaultValue={targetMyTicker.tickerId}
                    onChange={(value) => setTargetMyTicker({ ...targetMyTicker, tickerId: value })}
                />
                <BasicDatePicker
                    label='Purchase Date'
                    value={new Date(targetMyTicker.purchaseDate)}
                    onChange={(date) => setTargetMyTicker({ ...targetMyTicker, purchaseDate: date ? DateUtil.toStartOfDay(date) : DateUtil.getTodayStartTimestamp() })}
                />
                <BasicNumberField
                    label='Purchase Price'
                    value={targetMyTicker.purchasePrice}
                    onChange={(e) => setTargetMyTicker({ ...targetMyTicker, purchasePrice: Number(e.target.value) })}
                />
                <BasicNumberField
                    label='Quantity'
                    value={targetMyTicker.quantity}
                    onChange={(e) => setTargetMyTicker({ ...targetMyTicker, quantity: Number(e.target.value) })}
                />
                <ControlledCheckbox
                    label='Sell'
                    checked={isSell}
                    onChange={(e) => {
                        setIsSell(e.target.checked);
                        if (!e.target.checked) {
                            setTargetMyTicker({ ...targetMyTicker, sellDate: null, sellPrice: null });
                        }
                    }}
                />
                {isSell && (
                    <>
                        <BasicDatePicker
                            label='Sell Date'
                            value={targetMyTicker.sellDate ? new Date(targetMyTicker.sellDate) : null}
                            onChange={(date) => setTargetMyTicker({ ...targetMyTicker, sellDate: date ? DateUtil.toStartOfDay(date) : null })}
                        />
                        <BasicNumberField
                            label='Sell Price'
                            value={targetMyTicker.sellPrice || 0}
                            onChange={(e) => setTargetMyTicker({ ...targetMyTicker, sellPrice: Number(e.target.value) })}
                        />
                    </>
                )}
            </BasicStack>
        </BasicDialog >
    );
}
