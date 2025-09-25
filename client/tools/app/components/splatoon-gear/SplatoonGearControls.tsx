'use client';

import React from 'react';
import { Chip } from '@mui/material';


import ContainedButton from '@client-common/components/inputs/Buttons/ContainedButton';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';

interface SplatoonGearControlsProps {
  remainingPower: number;
  hasGearPowers: boolean;
  onAddGearPower: () => void;
  onReset: () => void;
}

export default function SplatoonGearControls({
  remainingPower,
  hasGearPowers,
  onAddGearPower,
  onReset
}: SplatoonGearControlsProps) {
  const getChipColor = (): "primary" | "success" | "error" => {
    if (remainingPower < 0) return 'error';
    if (remainingPower === 0) return 'success';
    return 'primary';
  };

  return (
    <DirectionStack spacing={2} justifyContent="space-between">
      <ContainedButton
        label="ギアパワー追加"
        onClick={onAddGearPower}
        disabled={remainingPower <= 0}
      />
      
      <Chip 
        label={`残りギアパワー: ${remainingPower}`}
        color={getChipColor()}
        size="medium"
      />
      
      <ContainedButton
        label="リセット"
        onClick={onReset}
        disabled={!hasGearPowers}
      />
    </DirectionStack>
  );
}