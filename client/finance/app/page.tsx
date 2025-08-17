'use client';

import React, { useEffect, useState } from 'react';

import BasicSelect from '@client-common/components/inputs/Selects/BasicSelect';
import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';
import { SelectOptionType } from '@client-common/interfaces/SelectOptionType';

import ExchangeUtil from '@/utils/ExchangeUtil';
import TickerUtil from '@/utils/TickerUtil';
import { ExchangeDataType } from '@/interfaces/data/ExchangeDataType';
import { TickerDataType } from '@/interfaces/data/TickerDataType';

import ExchangeAPIUtil from '@/app/exchanges/ExchangeAPIUtil';
import Graph from '@/app/components/graph';
import TickerAPIUtil from '@/app/tickers/TickerAPIUtil';

export default function Home() {
  const [exchanges, setExchanges] = useState<ExchangeDataType[]>([]);
  const [tickers, setTickers] = useState<TickerDataType[]>([]);
  const [exchangeOptions, setExchangeOptions] = useState<SelectOptionType[]>([]);
  const [tickerOptions, setTickerOptions] = useState<SelectOptionType[]>([]);
  const [exchange, setExchange] = useState('');
  const [ticker, setTicker] = useState('');

  const getExchangeKey = (id: string): string => {
    return exchanges.find(exchange => exchange.id === id)?.key || '';
  }

  const getTickerKey = (id: string): string => {
    return tickers.find(ticker => ticker.id === id)?.key || '';
  }

  useEffect(() => {
    (async () => {
      setExchanges(await ExchangeAPIUtil.get());
      setTickers(await TickerAPIUtil.get());
    })();
  }, []);

  useEffect(() => {
    setExchangeOptions(ExchangeUtil.dataToSelectOptions(exchanges));
  }, [exchanges]);

  useEffect(() => {
    const filteredTickers = tickers.filter(t => t.exchange === exchange);
    setTickerOptions(TickerUtil.dataToSelectOptions(filteredTickers));
  }, [tickers, exchange])

  useEffect(() => {
    if (exchangeOptions.length > 0) {
      setExchange(exchangeOptions[0].value);
    }
  }, [exchangeOptions]);

  useEffect(() => {
    if (tickerOptions.length > 0) {
      setTicker(tickerOptions[0].value);
    }
  }, [tickerOptions]);;

  return (
    <BasicStack>
      <DirectionStack>
        <BasicSelect label='Exchange' options={exchangeOptions} value={exchange} onChange={(value) => setExchange(value)} />
        <BasicSelect label='Ticker' options={tickerOptions} value={ticker} onChange={(value) => setTicker(value)} />
      </DirectionStack>
      <Graph exchange={getExchangeKey(exchange)} ticker={getTickerKey(ticker)} />
    </BasicStack>
  );
}
