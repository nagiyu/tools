export default class ConvertTransferService {
  public convert(before: string): string {
    const startIndex = before.indexOf('■');
    const endIndex = before.indexOf('(運賃内訳)');

    if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
      return before; // fallback to original if markers not found
    }

    return before.slice(startIndex, endIndex).replace('---\n', '');
  }
}
