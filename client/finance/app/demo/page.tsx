'use client';

import React, { useState } from 'react';

import BasicSelect from '@client-common/components/inputs/Selects/BasicSelect';
import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';
import { SelectOptionType } from '@client-common/interfaces/SelectOptionType';

import TimeFrameUtil from '@finance/utils/TimeFrameUtil';

export default function DemoPage() {
  // Mock data for demonstration
  const exchangeOptions: SelectOptionType[] = [
    { label: 'NYSE', value: 'nyse' },
    { label: 'NASDAQ', value: 'nasdaq' },
  ];

  const tickerOptions: SelectOptionType[] = [
    { label: 'Apple Inc. (AAPL)', value: 'aapl' },
    { label: 'Microsoft Corp. (MSFT)', value: 'msft' },
  ];

  const [exchange, setExchange] = useState('nyse');
  const [ticker, setTicker] = useState('aapl');
  const [timeframe, setTimeframe] = useState<string>(TimeFrameUtil.getDefaultTimeFrame());

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Finance Demo - Timeframe Selector</h1>
      <p>This demo shows the new timeframe selector functionality for candlestick charts.</p>
      
      <BasicStack>
        <DirectionStack>
          <BasicSelect 
            label='Exchange' 
            options={exchangeOptions} 
            value={exchange} 
            onChange={(value) => setExchange(value)} 
          />
          <BasicSelect 
            label='Ticker' 
            options={tickerOptions} 
            value={ticker} 
            onChange={(value) => setTicker(value)} 
          />
          <BasicSelect 
            label='時間軸' 
            options={TimeFrameUtil.toSelectOptions()} 
            value={timeframe} 
            onChange={(value) => setTimeframe(value)} 
          />
        </DirectionStack>
        
        <div style={{ 
          border: '2px dashed #ccc', 
          borderRadius: '8px', 
          padding: '40px', 
          textAlign: 'center',
          marginTop: '20px',
          backgroundColor: '#f9f9f9'
        }}>
          <h3>Candlestick Chart Area</h3>
          <p>Exchange: {exchange}</p>
          <p>Ticker: {ticker}</p>
          <p>Selected Timeframe: {timeframe}</p>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Chart would display here with data for the selected timeframe
          </p>
        </div>
      </BasicStack>
    </div>
  );
}