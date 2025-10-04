'use client';

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import { SelectOptionType } from '@client-common/interfaces/SelectOptionType';
import SplatoonGearService from '@tools/services/SplatoonGearService';
import { GearPower } from '@tools/types/SplatoonGearTypes';
import SplatoonGearControls from './SplatoonGearControls';
import SplatoonGearPower from './SplatoonGearPower';
import SplatoonGearSummary from './SplatoonGearSummary';

export default function SplatoonGearTool() {
  const [gearPowers, setGearPowers] = useState<GearPower[]>([]);
  const [nextId, setNextId] = useState(1);

  const service = new SplatoonGearService();
  
  const remaining = service.calculateRemainingPower(gearPowers);

  const GEAR_POWER_NAMES = service.getGearPowerNames();
  const gearPowerOptions: SelectOptionType[] = GEAR_POWER_NAMES.map(power => ({
    value: power,
    label: power
  }));

  const addGearPower = () => {
    const newGearPower: GearPower = {
      id: `gp-${nextId}`,
      name: GEAR_POWER_NAMES[0],
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

  const updateGearPowerValue = (id: string, delta: number) => {
    setGearPowers(gearPowers.map(gp => {
      if (gp.id === id) {
        const newValue = service.validateGearPowerValue(gp.name, gp.value, delta);
        return { ...gp, value: newValue };
      }
      return gp;
    }));
  };

  const validateGearPowerValue = (gearPowerName: string, currentValue: number, delta: number): number => {
    return service.validateGearPowerValue(gearPowerName, currentValue, delta);
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