import ConvertTransferService from '@tools/services/ConvertTransferService';

describe('ConvertTransferService', () => {
  let service: ConvertTransferService;

  beforeEach(() => {
    service = new ConvertTransferService();
  });

  describe('convert without date', () => {
    it('should convert the string correctly when markers are present', () => {
      const input = 'Some text\n■ Transfer Details\n---\nMore details here\n(運賃内訳) End of text';
      const expectedOutput = '■ Transfer Details\nMore details here\n';
      expect(service.convert(input)).toBe(expectedOutput);
    });

    it('should return the original string if start marker is missing', () => {
      const input = 'Some text\nNo start marker here\n(運賃内訳) End of text';
      expect(service.convert(input)).toBe(input);
    });

    it('should return the original string if end marker is missing', () => {
      const input = 'Some text\n■ Transfer Details\n---\nMore details here\nNo end marker here';
      expect(service.convert(input)).toBe(input);
    });

    it('should return the original string if start marker is after end marker', () => {
      const input = 'Some text\n(運賃内訳) End of text\n■ Transfer Details\n---\nMore details here';
      expect(service.convert(input)).toBe(input);
    });

    it('should handle strings without any markers', () => {
      const input = 'Some text without any markers';
      expect(service.convert(input)).toBe(input);
    });
  });

  describe('convert with date', () => {
    it('should prepend formatted date when date is provided', () => {
      const input = 'Some text\n■ Transfer Details\n---\nMore details here\n(運賃内訳) End of text';
      const date = new Date(2024, 0, 15); // January 15, 2024
      const expectedOutput = '2024/01/15\n■ Transfer Details\nMore details here\n';
      expect(service.convert(input, date)).toBe(expectedOutput);
    });

    it('should format date correctly with zero-padding', () => {
      const input = 'Some text\n■ Transfer Details\n---\nMore details here\n(運賃内訳) End of text';
      const date = new Date(2024, 8, 5); // September 5, 2024 (month is 0-indexed)
      const expectedOutput = '2024/09/05\n■ Transfer Details\nMore details here\n';
      expect(service.convert(input, date)).toBe(expectedOutput);
    });

    it('should work normally without date when undefined is passed explicitly', () => {
      const input = 'Some text\n■ Transfer Details\n---\nMore details here\n(運賃内訳) End of text';
      const expectedOutput = '■ Transfer Details\nMore details here\n';
      expect(service.convert(input, undefined)).toBe(expectedOutput);
    });

    it('should return original string with date prepended when markers are missing', () => {
      const input = 'Some text without any markers';
      const date = new Date(2024, 0, 15);
      expect(service.convert(input, date)).toBe(input); // Should fallback to original without date
    });
  });
});
