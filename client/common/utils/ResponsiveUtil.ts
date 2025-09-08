import { useMediaQuery, useTheme } from '@mui/material';

/**
 * Responsive configuration for layout components
 */
export interface ResponsiveConfig {
  isMobile: boolean;
  groupSize: number;
  buttonSize: string;
}

/**
 * Custom hook for responsive layout detection and configuration
 * @returns ResponsiveConfig object with mobile detection and responsive values
 */
export function useResponsiveLayout(): ResponsiveConfig {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const groupSize = isMobile ? 3 : 4;
  const buttonSize = isMobile ? '30vw' : '20vw';
  
  return {
    isMobile,
    groupSize,
    buttonSize
  };
}

/**
 * Utility class for responsive layout operations
 */
export default class ResponsiveUtil {
  /**
   * Groups an array into chunks of specified size
   * @param array - Array to group
   * @param groupSize - Size of each group
   * @returns Array of grouped arrays
   */
  public static groupArray<T>(array: T[], groupSize: number): T[][] {
    return Array.from(
      { length: Math.ceil(array.length / groupSize) },
      (_, i) => array.slice(i * groupSize, i * groupSize + groupSize)
    );
  }
  
  /**
   * Get responsive group size based on mobile detection
   * @param isMobile - Whether the screen is mobile
   * @returns Group size for layout
   */
  public static getGroupSize(isMobile: boolean): number {
    return isMobile ? 3 : 4;
  }
  
  /**
   * Get responsive button size based on mobile detection
   * @param isMobile - Whether the screen is mobile
   * @returns Button size string
   */
  public static getButtonSize(isMobile: boolean): string {
    return isMobile ? '30vw' : '20vw';
  }
}