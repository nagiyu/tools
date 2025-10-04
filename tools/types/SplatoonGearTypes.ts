import { GEAR_POWER_CATEGORIES } from '../consts/SplatoonGearConsts';

export interface GearPower {
  id: string;
  name: string;
  value: number;
}

export type GearPowerCategory = typeof GEAR_POWER_CATEGORIES[number];

export interface GearPowerSummary {
  mainSlots: number;
  subSlots: number;
  mainPoints: number;
  subPoints: number;
  totalPoints: number;
}
