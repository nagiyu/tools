'use client';

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import { SelectOptionType } from '@client-common/interfaces/SelectOptionType';
import SplatoonGearControls from './SplatoonGearControls';
import SplatoonGearPower from './SplatoonGearPower';
import SplatoonGearSummary from './SplatoonGearSummary';

// Splatoon3 gear powers (common ones)
const GEAR_POWERS = [
  'インク効率アップ(メイン)',
  'インク効率アップ(サブ)', 
  'インク回復力アップ',
  'ヒト移動速度アップ',
  'イカダッシュ速度アップ',
  'スペシャル増加量アップ',
  'スペシャル減少量ダウン',
  'スペシャル性能アップ',
  'スーパージャンプ時間短縮',
  'サブ性能アップ',
  'メイン性能アップ',
  'カムバック',
  'ラストスパート',
  'イカニンジャ',
  'サーマルインク',
  'ステルスジャンプ',
  'スタートダッシュ',
  'ゾンビ',
  'リベンジ',
  'おこたえください'
];

interface GearPower {
  id: string;
  name: string;
  value: number;
}

export default function SplatoonGearTool() {
  const [gearPowers, setGearPowers] = useState<GearPower[]>([]);
  const [nextId, setNextId] = useState(1);

  const TOTAL_GEAR_POWER = 57; // 10*3 + 3*3*3 = 57
  
  const currentTotal = gearPowers.reduce((sum, gp) => sum + gp.value, 0);
  const remaining = TOTAL_GEAR_POWER - currentTotal;

  const gearPowerOptions: SelectOptionType[] = GEAR_POWERS.map(power => ({
    value: power,
    label: power
  }));

  const addGearPower = () => {
    const newGearPower: GearPower = {
      id: `gp-${nextId}`,
      name: GEAR_POWERS[0],
      value: 0
    };
    setGearPowers([...gearPowers, newGearPower]);
    setNextId(nextId + 1);
  };

  const removeGearPower = (id: string) => {
    setGearPowers(gearPowers.filter(gp => gp.id !== id));
  };

  const updateGearPowerName = (id: string, name: string) => {
    setGearPowers(gearPowers.map(gp => 
      gp.id === id ? { ...gp, name } : gp
    ));
  };

  // Validate gear power constraints based on Splatoon3 rules
  const validateGearPowerValue = (currentValue: number, delta: number): number => {
    const newValue = currentValue + delta;
    
    // Basic bounds check
    if (newValue < 0) return currentValue;
    if (newValue > 57) return currentValue;
    
    // For each possible combination of main and sub slots, check if it's valid
    for (let mainSlots = 0; mainSlots <= 3; mainSlots++) {
      const remainingPoints = newValue - (mainSlots * 10);
      if (remainingPoints < 0) continue;
      
      const subSlots = remainingPoints / 3;
      if (subSlots === Math.floor(subSlots) && subSlots <= 9) {
        // Valid combination found
        return newValue;
      }
    }
    
    // No valid combination found
    return currentValue;
  };

  const updateGearPowerValue = (id: string, delta: number) => {
    setGearPowers(gearPowers.map(gp => {
      if (gp.id === id) {
        const newValue = validateGearPowerValue(gp.value, delta);
        return { ...gp, value: newValue };
      }
      return gp;
    }));
  };

  const resetAll = () => {
    setGearPowers([]);
    setNextId(1);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        Splatoon3 ギア検討ツール
      </Typography>
      
      <Typography variant="body1" gutterBottom align="center" color="text.secondary">
        ギアパワーを選択して、合計57のギアパワーでギア構成を検討できます
      </Typography>

      <Box sx={{ mb: 3 }}>
        <SplatoonGearControls
          remainingPower={remaining}
          hasGearPowers={gearPowers.length > 0}
          onAddGearPower={addGearPower}
          onReset={resetAll}
        />
      </Box>

      <BasicStack spacing={2}>
        {gearPowers.map((gearPower) => (
          <SplatoonGearPower
            key={gearPower.id}
            gearPower={gearPower}
            gearPowerOptions={gearPowerOptions}
            remainingPower={remaining}
            onNameChange={updateGearPowerName}
            onValueChange={updateGearPowerValue}
            onRemove={removeGearPower}
            validateValue={validateGearPowerValue}
          />
        ))}
      </BasicStack>

      {gearPowers.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
          <Typography variant="h6">
            「ギアパワー追加」ボタンでギアパワーを追加してください
          </Typography>
        </Box>
      )}

      {remaining < 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography color="error" variant="body2" align="center">
            ⚠️ ギアパワーの合計が57を超えています。調整してください。
          </Typography>
        </Box>
      )}

      <SplatoonGearSummary gearPowers={gearPowers} />
    </Box>
  );
}