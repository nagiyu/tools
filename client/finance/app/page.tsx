'use client';

import React, { useEffect, useState } from 'react';

import BasicSelect from '@client-common/components/inputs/Selects/BasicSelect';
import { SelectOptionType } from '@client-common/interfaces/SelectOptionType';
import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';
import ResponseValidator from '@client-common/utils/ResponseValidator';

import { ExchangeDataType } from '@/interfaces/data/ExchangeDataType';

import Graph from '@/app/components/graph';

function convertSelectOptions(data: ExchangeDataType[]): SelectOptionType[] {
  return data.map(item => ({
    label: item.name,
    value: item.key
  }));
}

export default function Home() {
  const [exchanges, setExchanges] = useState<SelectOptionType[]>([]);
  const [tickers, setTickers] = useState<SelectOptionType[]>([]);
  const [exchange, setExchange] = useState('');
  const [ticker, setTicker] = useState('');

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/exchange', {
        method: 'GET'
      });

      ResponseValidator.ValidateResponse(response);

      const exchange: ExchangeDataType[] = await response.json();

      setExchanges(convertSelectOptions(exchange));
    })();
  }, []);

  useEffect(() => {
    setExchange(exchanges[0]?.value || '');
  }, [exchanges]);

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/ticker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exchange }),
      });

      const tickerData = await response.json();

      setTickers(tickerData);
    })();
  }, [exchange]);

  useEffect(() => {
    setTicker(tickers[0]?.value || '');
  }, [tickers]);

  const handleExchangeChange = async (exchange: string) => {
    setExchange(exchange);
  };

  const handleTickerChange = (ticker: string) => {
    setTicker(ticker);
  };

  return (
    <BasicStack>
      <DirectionStack>
        <BasicSelect label='Exchange' options={exchanges} value={exchange} onChange={handleExchangeChange} />
        <BasicSelect label='Ticker' options={tickers} value={ticker} onChange={handleTickerChange} />
      </DirectionStack>
      <Graph exchange={exchange} ticker={ticker} />
    </BasicStack>
  );
}
