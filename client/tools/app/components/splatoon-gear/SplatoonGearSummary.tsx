'use client';

import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

interface GearPower {
  id: string;
  name: string;
  value: number;
}

interface SplatoonGearSummaryProps {
  gearPowers: GearPower[];
}

interface GearPowerSummary {
  mainSlots: number;
  subSlots: number;
  mainPoints: number;
  subPoints: number;
  totalPoints: number;
}

export default function SplatoonGearSummary({ gearPowers }: SplatoonGearSummaryProps) {
  const calculateSummary = (): GearPowerSummary => {
    let mainPoints = 0;
    let subPoints = 0;

    gearPowers.forEach(gearPower => {
      const value = gearPower.value;
      // Calculate how many main slots (10 points each) and sub slots (3 points each)
      const mainSlots = Math.floor(value / 10);
      const remainingPoints = value % 10;
      const subSlots = Math.floor(remainingPoints / 3);
      
      mainPoints += mainSlots * 10;
      subPoints += subSlots * 3;
    });

    return {
      mainSlots: Math.floor(mainPoints / 10),
      subSlots: Math.floor(subPoints / 3),
      mainPoints,
      subPoints,
      totalPoints: mainPoints + subPoints
    };
  };

  const summary = calculateSummary();

  if (gearPowers.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom align="center">
        ギアパワーサマリー
      </Typography>
      
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  メインギアパワー
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {summary.mainSlots}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  スロット ({summary.mainPoints}ポイント)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  最大3スロット (30ポイント)
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="secondary" gutterBottom>
                  サブギアパワー
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {summary.subSlots}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  スロット ({summary.subPoints}ポイント)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  最大9スロット (27ポイント)
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, textAlign: 'center', borderTop: 1, borderColor: 'divider', pt: 2 }}>
            <Typography variant="body1">
              合計使用ポイント: <strong>{summary.totalPoints}</strong> / 57
            </Typography>
            <Typography variant="caption" color="text.secondary">
              残り{57 - summary.totalPoints}ポイント
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}