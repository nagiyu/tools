'use client';

import React, { useEffect, useState } from 'react';

import BasicSelect, { Option } from '@client-common/components/inputs/Selects/BasicSelect';
import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';

import Graph from '@/app/components/graph';

export default function Home() {
  const [exchanges, setExchanges] = useState<Option[]>([]);
  const [tickers, setTickers] = useState<Option[]>([]);
  const [exchange, setExchange] = useState('');
  const [ticker, setTicker] = useState('');

  useEffect(() => {
    (async () => {
      const exchangeResponse = await fetch('/api/exchange');

      const exchangeData = await exchangeResponse.json();

      setExchanges(exchangeData);
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
