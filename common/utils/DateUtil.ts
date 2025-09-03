// 共通日付ユーティリティ
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// プラグインを有効化
dayjs.extend(utc);
dayjs.extend(timezone);

export default class DateUtil {
  // 日本時間を統一タイムゾーンとして使用
  private static readonly JST_TIMEZONE = 'Asia/Tokyo';

  /**
   * 現在の日本時間を取得
   */
  static nowInJST(): dayjs.Dayjs {
    return dayjs().tz(this.JST_TIMEZONE);
  }

  /**
   * 日本時間の現在時刻のDateオブジェクトを取得
   */
  static getNowJSTAsDate(): Date {
    return this.nowInJST().toDate();
  }

  /**
   * 本日00:00:00のタイムスタンプを返す（JST基準）
   */
  static getTodayStartTimestamp(): number {
    return this.nowInJST().startOf('day').valueOf();
  }

  /**
   * 任意の日付を0:00:00にしてタイムスタンプを返す（JST基準）
   */
  static toStartOfDay(date: Date): number {
    return dayjs(date).tz(this.JST_TIMEZONE).startOf('day').valueOf();
  }

  /**
   * 日本時間でDateオブジェクトを作成
   */
  static createJSTDate(year?: number, month?: number, day?: number, hour?: number, minute?: number, second?: number): Date {
    const dateString = `${year || dayjs().year()}-${(month || 0) + 1}-${day || 1} ${hour || 0}:${minute || 0}:${second || 0}`;
    const jstDate = dayjs.tz(dateString, this.JST_TIMEZONE);
    return jstDate.toDate();
  }

  /**
   * DateオブジェクトをJSTで解釈してdayjsオブジェクトに変換
   */
  static toJSTDayjs(date: Date): dayjs.Dayjs {
    return dayjs(date).tz(this.JST_TIMEZONE);
  }
}
