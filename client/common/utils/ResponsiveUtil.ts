import { useMediaQuery, useTheme } from '@mui/material';

/**
 * Custom hook for mobile detection
 * @returns boolean indicating if the current screen is mobile
 */
export function useMobileDetection(): boolean {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('md'));
}