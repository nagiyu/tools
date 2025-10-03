export interface GearPower {
  id: string;
  name: string;
  value: number;
}

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

  private readonly GEAR_POWERS = [
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
   * Validate if a gear power value change is valid based on Splatoon3 rules
   * @param currentValue Current gear power value
   * @param delta Change amount to apply
   * @returns New valid value (returns currentValue if invalid)
   */
  public validateGearPowerValue(currentValue: number, delta: number): number {
    const newValue = currentValue + delta;
    
    // Basic bounds check
    if (newValue < 0) return currentValue;
    if (newValue > this.TOTAL_GEAR_POWER) return currentValue;
    
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
