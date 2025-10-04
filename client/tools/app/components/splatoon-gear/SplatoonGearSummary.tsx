'use client';

import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import SplatoonGearService from '@tools/services/SplatoonGearService';
import { GearPower, GearPowerSummary } from '@tools/types/SplatoonGearTypes';

interface SplatoonGearSummaryProps {
  gearPowers: GearPower[];
}

export default function SplatoonGearSummary({ gearPowers }: SplatoonGearSummaryProps) {
  const service = new SplatoonGearService();
  const summary: GearPowerSummary = service.calculateSummary(gearPowers);

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
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
            <Box sx={{ flex: 1, textAlign: 'center' }}>
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
            
            <Box sx={{ flex: 1, textAlign: 'center' }}>
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
          </Box>
          
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