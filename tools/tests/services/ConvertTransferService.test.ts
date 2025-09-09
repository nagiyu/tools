import ConvertTransferService from '@tools/services/ConvertTransferService';

describe('ConvertTransferService', () => {
  let service: ConvertTransferService;

  beforeEach(() => {
    service = new ConvertTransferService();
  });

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
