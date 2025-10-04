export interface GearPower {
  id: string;
  name: string;
  value: number;
}

export const GEAR_POWER_CATEGORIES = ['normal', 'head', 'clothing', 'shoes'] as const;
export type GearPowerCategory = typeof GEAR_POWER_CATEGORIES[number];

export interface GearPowerSummary {
  mainSlots: number;
  subSlots: number;
  mainPoints: number;
  subPoints: number;
  totalPoints: number;
}

export default class SplatoonGearService {
  private readonly TOTAL_GEAR_POWER = 57; // 10*3 + 3*3*3 = 57
  private readonly MAIN_SLOT_POINTS = 10;
  private readonly SUB_SLOT_POINTS = 3;
  private readonly MAX_MAIN_SLOTS = 3;
  private readonly MAX_SUB_SLOTS = 9;
  private readonly MAX_EXCLUSIVE_GEAR_VALUE = 10; // Head/Clothing/Shoes exclusive gear powers max value

  // Normal gear powers (can go up to 57)
  private readonly NORMAL_GEAR_POWERS = [
    'インク効率アップ(メイン)',
    'インク効率アップ(サブ)',
    'インク回復力アップ',
    'ヒト移動速度アップ',
    'イカダッシュ速度アップ',
    'スペシャル増加量アップ',
    'スペシャル減少量ダウン',
    'スペシャル性能アップ',
    '復活時間短縮',
    'スーパージャンプ時間短縮',
    'サブ性能アップ',
    '相手インク影響軽減',
    'サブ影響軽減',
    'アクション強化'
  ];

  // Head-only gear powers (max 10 points)
  private readonly HEAD_GEAR_POWERS = [
    'スタートダッシュ',
    'ラストスパート',
    '逆境強化',
    'カムバック'
  ];

  // Clothing-only gear powers (max 10 points)
  private readonly CLOTHING_GEAR_POWERS = [
    'イカニンジャ',
    'リベンジ',
    'サーマルインク',
    '復活ペナルティアップ',
    '追加ギアパワー倍化'
  ];

  // Shoes-only gear powers (max 10 points)
  private readonly SHOES_GEAR_POWERS = [
    'ステルスジャンプ',
    '対物攻撃力アップ',
    '受け身術'
  ];

  // All gear powers combined
  private readonly GEAR_POWERS = [
    ...this.NORMAL_GEAR_POWERS,
    ...this.HEAD_GEAR_POWERS,
    ...this.CLOTHING_GEAR_POWERS,
    ...this.SHOES_GEAR_POWERS
  ];

  /**
   * Calculate remaining gear power points
   * @param gearPowers Array of gear powers
   * @returns Remaining points (can be negative if over limit)
   */
  public calculateRemainingPower(gearPowers: GearPower[]): number {
    const currentTotal = gearPowers.reduce((sum, gp) => sum + gp.value, 0);
    return this.TOTAL_GEAR_POWER - currentTotal;
  }

  /**
   * Get gear power category
   * @param gearPowerName Name of the gear power
   * @returns Category of the gear power
   */
  public getGearPowerCategory(gearPowerName: string): GearPowerCategory {
    if (this.NORMAL_GEAR_POWERS.includes(gearPowerName)) {
      return 'normal';
    }
    if (this.HEAD_GEAR_POWERS.includes(gearPowerName)) {
      return 'head';
    }
    if (this.CLOTHING_GEAR_POWERS.includes(gearPowerName)) {
      return 'clothing';
    }
    if (this.SHOES_GEAR_POWERS.includes(gearPowerName)) {
      return 'shoes';
    }
    return 'normal'; // Default to normal
  }

  /**
   * Get maximum value for a gear power based on its category
   * @param gearPowerName Name of the gear power
   * @returns Maximum allowed value
   */
  public getMaxGearPowerValue(gearPowerName: string): number {
    const category = this.getGearPowerCategory(gearPowerName);
    if (category === 'normal') {
      return this.TOTAL_GEAR_POWER;
    }
    // Head, clothing, and shoes exclusive powers are limited to max 10 (1 main slot)
    return this.MAX_EXCLUSIVE_GEAR_VALUE;
  }

  /**
   * Validate if a gear power value change is valid based on Splatoon3 rules
   * @param gearPowerName Name of the gear power
   * @param currentValue Current gear power value
   * @param delta Change amount to apply
   * @returns New valid value (returns currentValue if invalid)
   */
  public validateGearPowerValue(gearPowerName: string, currentValue: number, delta: number): number {
    const newValue = currentValue + delta;
    const maxValue = this.getMaxGearPowerValue(gearPowerName);
    
    // Basic bounds check
    if (newValue < 0) return currentValue;
    if (newValue > maxValue) return currentValue;
    
    // For each possible combination of main and sub slots, check if it's valid
    for (let mainSlots = 0; mainSlots <= this.MAX_MAIN_SLOTS; mainSlots++) {
      const remainingPoints = newValue - (mainSlots * this.MAIN_SLOT_POINTS);
      if (remainingPoints < 0) continue;
      
      const subSlots = remainingPoints / this.SUB_SLOT_POINTS;
      if (subSlots === Math.floor(subSlots) && subSlots <= this.MAX_SUB_SLOTS) {
        // Valid combination found
        return newValue;
      }
    }
    
    // No valid combination found
    return currentValue;
  }

  /**
   * Calculate gear power summary (main/sub slots and points)
   * @param gearPowers Array of gear powers
   * @returns Summary with main/sub slots and points breakdown
   */
  public calculateSummary(gearPowers: GearPower[]): GearPowerSummary {
    let mainPoints = 0;
    let subPoints = 0;

    gearPowers.forEach(gearPower => {
      const value = gearPower.value;
      // Calculate how many main slots (10 points each) and sub slots (3 points each)
      const mainSlots = Math.floor(value / this.MAIN_SLOT_POINTS);
      const remainingPoints = value % this.MAIN_SLOT_POINTS;
      const subSlots = Math.floor(remainingPoints / this.SUB_SLOT_POINTS);
      
      mainPoints += mainSlots * this.MAIN_SLOT_POINTS;
      subPoints += subSlots * this.SUB_SLOT_POINTS;
    });

    return {
      mainSlots: Math.floor(mainPoints / this.MAIN_SLOT_POINTS),
      subSlots: Math.floor(subPoints / this.SUB_SLOT_POINTS),
      mainPoints,
      subPoints,
      totalPoints: mainPoints + subPoints
    };
  }

  /**
   * Get the total gear power constant
   * @returns Total gear power (57)
   */
  public getTotalGearPower(): number {
    return this.TOTAL_GEAR_POWER;
  }

  /**
   * Get available gear power names
   * @returns Array of gear power names
   */
  public getGearPowerNames(): string[] {
    return [...this.GEAR_POWERS];
  }
}
