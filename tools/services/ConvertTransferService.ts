export default class ConvertTransferService {
  public convert(before: string, date?: Date, includeDayOfWeek?: boolean): string {
    const startIndex = before.indexOf('■');
    const endIndex = before.indexOf('(運賃内訳)');

    if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
      return before; // fallback to original if markers not found
    }

    let result = before.slice(startIndex, endIndex).replace('---\n', '');
    
    // Add date if provided
    if (date) {
      const dateStr = this.formatDate(date, includeDayOfWeek);
      result = `${dateStr}\n${result}`;
    }
    
    return result;
  }

  private formatDate(date: Date, includeDayOfWeek?: boolean): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    let dateStr = `${year}/${month}/${day}`;
    
    if (includeDayOfWeek) {
      const dayOfWeek = this.getDayOfWeekJapanese(date);
      dateStr += `(${dayOfWeek})`;
    }
    
    return dateStr;
  }

  private getDayOfWeekJapanese(date: Date): string {
    const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
    return daysOfWeek[date.getDay()];
  }
}
