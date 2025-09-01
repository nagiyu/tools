import { SelectOptionType } from '@client-common/interfaces/SelectOptionType';

type TimeFrame = "1" | "3" | "5" | "15" | "30" | "45" | "60" | "120" | "180" | "240";

export interface TimeFrameOption {
  value: TimeFrame;
  label: string;
}

export default class TimeFrameUtil {
  // Available timeframes with user-friendly labels
  private static readonly TIMEFRAME_OPTIONS: TimeFrameOption[] = [
    { value: "1", label: "1分" },
    { value: "3", label: "3分" },
    { value: "5", label: "5分" },
    { value: "15", label: "15分" },
    { value: "30", label: "30分" },
    { value: "45", label: "45分" },
    { value: "60", label: "1時間" },
    { value: "120", label: "2時間" },
    { value: "180", label: "3時間" },
    { value: "240", label: "4時間" },
  ];

  /**
   * Convert timeframe options to SelectOption format for use with BasicSelect component
   */
  public static toSelectOptions(): SelectOptionType[] {
    return this.TIMEFRAME_OPTIONS.map(option => ({
      label: option.label,
      value: option.value
    }));
  }

  /**
   * Get the default timeframe
   */
  public static getDefaultTimeFrame(): TimeFrame {
    return "1";
  }

  /**
   * Validate if a string is a valid timeframe
   */
  public static isValidTimeFrame(value: string): value is TimeFrame {
    return this.TIMEFRAME_OPTIONS.some(option => option.value === value);
  }
}