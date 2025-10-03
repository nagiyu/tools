import SplatoonGearService, { GearPower } from '@tools/services/SplatoonGearService';

describe('SplatoonGearService', () => {
  let service: SplatoonGearService;

  beforeEach(() => {
    service = new SplatoonGearService();
  });

  describe('getTotalGearPower', () => {
    it('should return 57 as the total gear power', () => {
      expect(service.getTotalGearPower()).toBe(57);
    });
  });

  describe('getGearPowerNames', () => {
    it('should return array of 26 gear power names', () => {
      const names = service.getGearPowerNames();
      expect(names).toHaveLength(26);
    });

    it('should include expected gear power names', () => {
      const names = service.getGearPowerNames();
      expect(names).toContain('インク効率アップ(メイン)');
      expect(names).toContain('ヒト移動速度アップ');
      expect(names).toContain('イカダッシュ速度アップ');
      expect(names).toContain('スペシャル増加量アップ');
    });

    it('should return a copy of the array (not the original)', () => {
      const names1 = service.getGearPowerNames();
      const names2 = service.getGearPowerNames();
      expect(names1).not.toBe(names2); // Different references
      expect(names1).toEqual(names2); // But same content
    });
  });

  describe('getGearPowerCategory', () => {
    it('should return "normal" for normal gear powers', () => {
      expect(service.getGearPowerCategory('インク効率アップ(メイン)')).toBe('normal');
      expect(service.getGearPowerCategory('ヒト移動速度アップ')).toBe('normal');
      expect(service.getGearPowerCategory('アクション強化')).toBe('normal');
    });

    it('should return "head" for head-only gear powers', () => {
      expect(service.getGearPowerCategory('スタートダッシュ')).toBe('head');
      expect(service.getGearPowerCategory('ラストスパート')).toBe('head');
      expect(service.getGearPowerCategory('逆境強化')).toBe('head');
      expect(service.getGearPowerCategory('カムバック')).toBe('head');
    });

    it('should return "clothing" for clothing-only gear powers', () => {
      expect(service.getGearPowerCategory('イカニンジャ')).toBe('clothing');
      expect(service.getGearPowerCategory('リベンジ')).toBe('clothing');
      expect(service.getGearPowerCategory('サーマルインク')).toBe('clothing');
      expect(service.getGearPowerCategory('復活ペナルティアップ')).toBe('clothing');
      expect(service.getGearPowerCategory('追加ギアパワー倍化')).toBe('clothing');
    });

    it('should return "shoes" for shoes-only gear powers', () => {
      expect(service.getGearPowerCategory('ステルスジャンプ')).toBe('shoes');
      expect(service.getGearPowerCategory('対物攻撃力アップ')).toBe('shoes');
      expect(service.getGearPowerCategory('受け身術')).toBe('shoes');
    });
  });

  describe('getMaxGearPowerValue', () => {
    it('should return 57 for normal gear powers', () => {
      expect(service.getMaxGearPowerValue('インク効率アップ(メイン)')).toBe(57);
      expect(service.getMaxGearPowerValue('ヒト移動速度アップ')).toBe(57);
    });

    it('should return 10 for head-only gear powers', () => {
      expect(service.getMaxGearPowerValue('スタートダッシュ')).toBe(10);
      expect(service.getMaxGearPowerValue('カムバック')).toBe(10);
    });

    it('should return 10 for clothing-only gear powers', () => {
      expect(service.getMaxGearPowerValue('イカニンジャ')).toBe(10);
      expect(service.getMaxGearPowerValue('リベンジ')).toBe(10);
    });

    it('should return 10 for shoes-only gear powers', () => {
      expect(service.getMaxGearPowerValue('ステルスジャンプ')).toBe(10);
      expect(service.getMaxGearPowerValue('対物攻撃力アップ')).toBe(10);
    });
  });

  describe('calculateRemainingPower', () => {
    it('should return 57 when no gear powers are present', () => {
      const gearPowers: GearPower[] = [];
      expect(service.calculateRemainingPower(gearPowers)).toBe(57);
    });

    it('should calculate remaining power correctly with one gear power', () => {
      const gearPowers: GearPower[] = [
        { id: 'gp-1', name: 'インク効率アップ(メイン)', value: 10 }
      ];
      expect(service.calculateRemainingPower(gearPowers)).toBe(47);
    });

    it('should calculate remaining power correctly with multiple gear powers', () => {
      const gearPowers: GearPower[] = [
        { id: 'gp-1', name: 'インク効率アップ(メイン)', value: 10 },
        { id: 'gp-2', name: 'ヒト移動速度アップ', value: 13 },
        { id: 'gp-3', name: 'イカダッシュ速度アップ', value: 20 }
      ];
      // Total: 10 + 13 + 20 = 43
      expect(service.calculateRemainingPower(gearPowers)).toBe(14);
    });

    it('should return 0 when total equals 57', () => {
      const gearPowers: GearPower[] = [
        { id: 'gp-1', name: 'インク効率アップ(メイン)', value: 30 },
        { id: 'gp-2', name: 'ヒト移動速度アップ', value: 27 }
      ];
      // Total: 30 + 27 = 57
      expect(service.calculateRemainingPower(gearPowers)).toBe(0);
    });

    it('should return negative value when total exceeds 57', () => {
      const gearPowers: GearPower[] = [
        { id: 'gp-1', name: 'インク効率アップ(メイン)', value: 30 },
        { id: 'gp-2', name: 'ヒト移動速度アップ', value: 30 }
      ];
      // Total: 30 + 30 = 60
      expect(service.calculateRemainingPower(gearPowers)).toBe(-3);
    });
  });

  describe('validateGearPowerValue', () => {
    it('should allow valid increase by 3 (sub slot) for normal gear powers', () => {
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 0, 3)).toBe(3);
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 3, 3)).toBe(6);
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 10, 3)).toBe(13);
    });

    it('should allow valid increase by 10 (main slot) for normal gear powers', () => {
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 0, 10)).toBe(10);
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 10, 10)).toBe(20);
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 20, 10)).toBe(30);
    });

    it('should allow valid decrease by 3 (sub slot)', () => {
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 3, -3)).toBe(0);
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 13, -3)).toBe(10);
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 27, -3)).toBe(24);
    });

    it('should allow valid decrease by 10 (main slot)', () => {
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 10, -10)).toBe(0);
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 20, -10)).toBe(10);
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 30, -10)).toBe(20);
    });

    it('should reject decrease below 0', () => {
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 0, -3)).toBe(0);
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 3, -10)).toBe(3);
    });

    it('should reject increase above 57 for normal gear powers', () => {
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 57, 3)).toBe(57);
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 50, 10)).toBe(50);
    });

    it('should reject invalid combinations (not divisible by 3 or 10)', () => {
      // 1 is invalid (cannot be made with 3s and 10s)
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 0, 1)).toBe(0);
      // 2 is invalid
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 0, 2)).toBe(0);
      // 4 is invalid
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 0, 4)).toBe(0);
      // 5 is invalid
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 0, 5)).toBe(0);
    });

    it('should allow all valid combinations up to 57 for normal gear powers', () => {
      const validValues = [
        0, 3, 6, 9,           // 0 main, 0-3 sub
        10, 13, 16, 19,       // 1 main, 0-3 sub
        20, 23, 26,           // 2 main, 0-2 sub
        30, 33, 36, 39,       // 3 main, 0-3 sub
        40, 43, 46,           // 4 main (invalid but check)
        50, 53, 56,           // 5 main (invalid but check)
      ];

      // Actually, max main is 3 (30 points) + max sub is 9 (27 points) = 57
      // Valid combinations: 
      // 0 main: 0, 3, 6, 9, 12, 15, 18, 21, 24, 27
      // 1 main: 10, 13, 16, 19, 22, 25, 28, 31, 34, 37
      // 2 main: 20, 23, 26, 29, 32, 35, 38, 41, 44, 47
      // 3 main: 30, 33, 36, 39, 42, 45, 48, 51, 54, 57
      
      const actualValidValues = [];
      for (let main = 0; main <= 3; main++) {
        for (let sub = 0; sub <= 9; sub++) {
          const value = main * 10 + sub * 3;
          if (value <= 57) {
            actualValidValues.push(value);
          }
        }
      }

      actualValidValues.forEach(value => {
        expect(service.validateGearPowerValue('インク効率アップ(メイン)', 0, value)).toBe(value);
      });
    });

    it('should maintain current value for invalid intermediate values', () => {
      // From 10, trying to add 1 should maintain 10 (11 is invalid)
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 10, 1)).toBe(10);
      // From 13, trying to subtract 1 gives 12 which is valid (0 main + 4 sub)
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 13, -1)).toBe(12);
      // From 3, trying to subtract 1 gives 2 which is invalid, should maintain 3
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 3, -1)).toBe(3);
      // From 10, trying to add 2 gives 12 which is valid (0 main + 4 sub)
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 10, 2)).toBe(12);
      // From 10, trying to subtract 2 gives 8 which is invalid, should maintain 10
      expect(service.validateGearPowerValue('インク効率アップ(メイン)', 10, -2)).toBe(10);
    });

    it('should restrict head-only gear powers to max 10', () => {
      expect(service.validateGearPowerValue('スタートダッシュ', 0, 10)).toBe(10);
      expect(service.validateGearPowerValue('スタートダッシュ', 10, 3)).toBe(10);
      expect(service.validateGearPowerValue('スタートダッシュ', 10, 10)).toBe(10);
      expect(service.validateGearPowerValue('カムバック', 0, 10)).toBe(10);
      expect(service.validateGearPowerValue('カムバック', 10, 3)).toBe(10);
    });

    it('should restrict clothing-only gear powers to max 10', () => {
      expect(service.validateGearPowerValue('イカニンジャ', 0, 10)).toBe(10);
      expect(service.validateGearPowerValue('イカニンジャ', 10, 3)).toBe(10);
      expect(service.validateGearPowerValue('リベンジ', 0, 10)).toBe(10);
      expect(service.validateGearPowerValue('リベンジ', 10, 3)).toBe(10);
    });

    it('should restrict shoes-only gear powers to max 10', () => {
      expect(service.validateGearPowerValue('ステルスジャンプ', 0, 10)).toBe(10);
      expect(service.validateGearPowerValue('ステルスジャンプ', 10, 3)).toBe(10);
      expect(service.validateGearPowerValue('対物攻撃力アップ', 0, 10)).toBe(10);
      expect(service.validateGearPowerValue('対物攻撃力アップ', 10, 3)).toBe(10);
    });
  });

  describe('calculateSummary', () => {
    it('should return zero summary for empty gear powers', () => {
      const gearPowers: GearPower[] = [];
      const summary = service.calculateSummary(gearPowers);
      
      expect(summary.mainSlots).toBe(0);
      expect(summary.subSlots).toBe(0);
      expect(summary.mainPoints).toBe(0);
      expect(summary.subPoints).toBe(0);
      expect(summary.totalPoints).toBe(0);
    });

    it('should calculate summary for single main slot', () => {
      const gearPowers: GearPower[] = [
        { id: 'gp-1', name: 'インク効率アップ(メイン)', value: 10 }
      ];
      const summary = service.calculateSummary(gearPowers);
      
      expect(summary.mainSlots).toBe(1);
      expect(summary.subSlots).toBe(0);
      expect(summary.mainPoints).toBe(10);
      expect(summary.subPoints).toBe(0);
      expect(summary.totalPoints).toBe(10);
    });

    it('should calculate summary for single sub slot', () => {
      const gearPowers: GearPower[] = [
        { id: 'gp-1', name: 'ヒト移動速度アップ', value: 3 }
      ];
      const summary = service.calculateSummary(gearPowers);
      
      expect(summary.mainSlots).toBe(0);
      expect(summary.subSlots).toBe(1);
      expect(summary.mainPoints).toBe(0);
      expect(summary.subPoints).toBe(3);
      expect(summary.totalPoints).toBe(3);
    });

    it('should calculate summary for mixed main and sub slots', () => {
      const gearPowers: GearPower[] = [
        { id: 'gp-1', name: 'インク効率アップ(メイン)', value: 13 } // 1 main + 1 sub
      ];
      const summary = service.calculateSummary(gearPowers);
      
      expect(summary.mainSlots).toBe(1);
      expect(summary.subSlots).toBe(1);
      expect(summary.mainPoints).toBe(10);
      expect(summary.subPoints).toBe(3);
      expect(summary.totalPoints).toBe(13);
    });

    it('should calculate summary for multiple gear powers', () => {
      const gearPowers: GearPower[] = [
        { id: 'gp-1', name: 'インク効率アップ(メイン)', value: 10 }, // 1 main
        { id: 'gp-2', name: 'ヒト移動速度アップ', value: 13 },      // 1 main + 1 sub
        { id: 'gp-3', name: 'イカダッシュ速度アップ', value: 6 }     // 2 sub
      ];
      const summary = service.calculateSummary(gearPowers);
      
      // Total: 2 main (20 points) + 3 sub (9 points) = 29 points
      expect(summary.mainSlots).toBe(2);
      expect(summary.subSlots).toBe(3);
      expect(summary.mainPoints).toBe(20);
      expect(summary.subPoints).toBe(9);
      expect(summary.totalPoints).toBe(29);
    });

    it('should calculate summary for maximum valid configuration', () => {
      const gearPowers: GearPower[] = [
        { id: 'gp-1', name: 'インク効率アップ(メイン)', value: 30 }, // 3 main + 0 sub
        { id: 'gp-2', name: 'ヒト移動速度アップ', value: 27 }       // 2 main + 2 sub (7 remainder, 7/3=2)
      ];
      const summary = service.calculateSummary(gearPowers);
      
      // 30: 3 main (30 points) + 0 sub (0 points)
      // 27: 2 main (20 points) + 2 sub (6 points), 1 point unused
      // Total: 5 main (50 points) + 2 sub (6 points) = 56 points
      expect(summary.mainSlots).toBe(5);
      expect(summary.subSlots).toBe(2);
      expect(summary.mainPoints).toBe(50);
      expect(summary.subPoints).toBe(6);
      expect(summary.totalPoints).toBe(56);
    });

    it('should calculate summary that reaches exactly 57 points', () => {
      const gearPowers: GearPower[] = [
        { id: 'gp-1', name: 'インク効率アップ(メイン)', value: 30 }, // 3 main + 0 sub = 30 points
        { id: 'gp-2', name: 'ヒト移動速度アップ', value: 27 }       // 0 main + 9 sub = 27 points... wait
      ];
      // Actually, 27 = 2*10 + 7, and 7/3 = 2, so it's 20 + 6 = 26 used, 1 wasted
      // Let me use a proper combination
      const gearPowers2: GearPower[] = [
        { id: 'gp-1', name: 'インク効率アップ(メイン)', value: 39 }, // 3 main + 3 sub = 39 points
        { id: 'gp-2', name: 'ヒト移動速度アップ', value: 18 }       // 1 main + 2 sub = 18 points... wait
      ];
      // 39 = 3*10 + 9, 9/3 = 3 sub, so 30 + 9 = 39
      // 18 = 1*10 + 8, 8/3 = 2 sub, so 10 + 6 = 16... 2 wasted
      // Better approach: use values that don't waste points
      const gearPowers3: GearPower[] = [
        { id: 'gp-1', name: 'インク効率アップ(メイン)', value: 19 }, // 1 main + 3 sub = 19 points
        { id: 'gp-2', name: 'ヒト移動速度アップ', value: 19 },      // 1 main + 3 sub = 19 points
        { id: 'gp-3', name: 'イカダッシュ速度アップ', value: 19 }    // 1 main + 3 sub = 19 points
      ];
      const summary = service.calculateSummary(gearPowers3);
      
      // Total: 3 main (30 points) + 9 sub (27 points) = 57 points
      expect(summary.mainSlots).toBe(3);
      expect(summary.subSlots).toBe(9);
      expect(summary.mainPoints).toBe(30);
      expect(summary.subPoints).toBe(27);
      expect(summary.totalPoints).toBe(57);
    });

    it('should handle gear powers with remainder points correctly', () => {
      // Value 11 would be 1 main (10) + remainder 1 (not a valid sub)
      // But since we only allow valid values, this shouldn't happen in practice
      // However, the calculation should handle it gracefully
      const gearPowers: GearPower[] = [
        { id: 'gp-1', name: 'Test', value: 11 }
      ];
      const summary = service.calculateSummary(gearPowers);
      
      // 11 / 10 = 1 main (10 points)
      // 11 % 10 = 1 remainder / 3 = 0 sub (0 points)
      // Total calculated: 10 points
      expect(summary.mainSlots).toBe(1);
      expect(summary.subSlots).toBe(0);
      expect(summary.mainPoints).toBe(10);
      expect(summary.subPoints).toBe(0);
      expect(summary.totalPoints).toBe(10);
    });

    it('should calculate summary for complex scenario', () => {
      const gearPowers: GearPower[] = [
        { id: 'gp-1', name: 'インク効率アップ(メイン)', value: 23 },  // 2 main + 1 sub
        { id: 'gp-2', name: 'ヒト移動速度アップ', value: 19 },       // 1 main + 3 sub
        { id: 'gp-3', name: 'イカダッシュ速度アップ', value: 9 }      // 3 sub
      ];
      const summary = service.calculateSummary(gearPowers);
      
      // Total: 3 main (30 points) + 7 sub (21 points) = 51 points
      expect(summary.mainSlots).toBe(3);
      expect(summary.subSlots).toBe(7);
      expect(summary.mainPoints).toBe(30);
      expect(summary.subPoints).toBe(21);
      expect(summary.totalPoints).toBe(51);
    });
  });
});
