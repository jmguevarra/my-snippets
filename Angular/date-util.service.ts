import { Injectable } from '@angular/core';
import { DateParserFormatterService } from '../date-parser-formatter.service';
import { NotificationService } from '../notification.service';

@Injectable({
  providedIn: 'root'
})
export class DateUtilService {
  constructor(private dateParser: DateParserFormatterService, private notification: NotificationService) {}

  public parseDate(dateString: string | null | undefined): Date | null {
    // Return when already empty string or null to avoid console errors.
    if (!dateString) return null;

    const parsedDate = dateString ? new Date(dateString) : null;
    return isNaN(parsedDate!.getTime()) ? null : parsedDate;
  }

  /**
   * Calculates the previous date for the given date string.
   * @param dateString - The date string to calculate the previous date for.
   * @returns The calculated previous date as a Date object.
   */
  public calculatePreviousDate(dateString: string): Date {
    const startDate: Date = new Date(dateString);
    startDate.setDate(startDate.getDate() - 1);
    return startDate;
  }

  /**
   * Counts the number of months between two date strings.
   * @param fromDate - The starting date.
   * @param toDate - The ending date.
   * @returns The number of months between the two dates.
   */
  public countNoOfMonths(fromDate: string | null | undefined, toDate: string | null | undefined): number {
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = this.dateParser.addDays(new Date(toDate), 1);
      const months = to.getMonth() - from.getMonth() + 12 * (to.getFullYear() - from.getFullYear());
      return months < 0 ? 0 : to.getDate() < from.getDate() ? months - 1 : months;
    }
    return 0;
  }

  public addDays(value: string, days: number): string {
    return this.dateParser.addDays(new Date(value), days).toISOString().split('T')[0];
  }

  public addMonths(value: string, months: number): string {
    const date: Date = new Date(value);
    return this.dateParser.addMonths(date, months).toISOString().split('T')[0];
  }

  public dateIsTodayUntilDays(date: string, days: number) {
    if (!date || !new Date(date).getTime()) return false;
    let startDate = new Date();
      startDate.setUTCHours(0,0,0,0);
      startDate.setDate(startDate.getDate() - 1);
    let endDate = new Date();
      endDate.setUTCHours(0,0,0,0);
      endDate.setDate(endDate.getDate() + days);
    return new Date(date) > startDate && new Date(date) < endDate;
  }

   /**
   * @param dateStr - The starting string date.
   * @param days - negative days.
   * @returns it set true/false if dateStr is included on days before date today.
   */
  public dateIsDaysBeforeToday(dateStr: string, days: number){
    if (!dateStr || !new Date(dateStr).getTime() || days >= 0) return false;

    let date = new Date(dateStr);
    date.setHours(0,0,0,0);

    let startDate = new Date();
      startDate.setUTCHours(0,0,0,0);
      startDate.setDate(startDate.getDate() + days);

    let endDate = new Date();
      endDate.setUTCHours(0,0,0,0);
      endDate.setDate(endDate.getDate());
      
    return date >= startDate && date <= endDate;
  }

  shortDateFormat(dateStr: string, delimiter: string = '-'){
      const parts = dateStr.split(delimiter);
      const monthAbbr = ShortMonth[parseInt(parts[1], 10) - 1];
      return monthAbbr + '. ' + parseInt(parts[2], 10) + ', ' + parts[0];
   }

  generateQuarterDateRange(startDate: string, endDate: string): { quarter: string, start: Date, end: Date }[] {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const quarterList: { quarter: string, start: Date, end: Date }[] = [];

      end.setMonth(end.getMonth() + 1);
      while (start <= end) {
         const year = start.getFullYear();
         const quarter = Math.floor(start.getMonth() / 3) + 1;
         const quarterStart = new Date(start.getFullYear(), Math.floor(start.getMonth() / 3) * 3, 1);
         const quarterEnd = new Date(start.getFullYear(), Math.floor(start.getMonth() / 3) * 3 + 3, 0);
         quarterStart.setHours(0,0,0,0);
         quarterEnd.setHours(0,0,0,0);
         quarterList.push({ quarter: `${year} Q${quarter}`, start: quarterStart, end: quarterEnd });
         start.setMonth(start.getMonth() + 3);
      }

      return quarterList;
   }

  generateQuaterList(startDate: string, endDate: string): string[] {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const quarterSet: Set<string> = new Set();

      end.setMonth(end.getMonth() + 1);
      while (start <= end) {
         const year = start.getFullYear();
         const quarter = Math.floor(start.getMonth() / 3) + 1;
         quarterSet.add(`${year} - Q${quarter}`);
         const nextQuarterMonth = start.getMonth() + 3;
         start.setMonth(nextQuarterMonth);
      }
      return Array.from(quarterSet);
  }

  generateMonthYearList(startDate: string, endDate: string): string[] {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const monthList: string[] = [];
      for (let d = start; d <= end; d.setMonth(d.getMonth() + 1)) {
          monthList.push(`${ShortMonth[d.getMonth()]} ${d.getFullYear()}`);
      }
      return monthList;
  }

  generateMonthYearDateRange(startDate: string, endDate: string): {start: Date, end: Date}[] {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const monthList: {start: Date, end: Date}[] = [];
      for (let d = start; d <= end; d.setMonth(d.getMonth() + 1)) {
         const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
         const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
         monthList.push({ start: monthStart, end: monthEnd });
      }
      return monthList;
   }

  convertDateToNgbDate(date: Date): NgbDate {
      return new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
   }
   convertNgbDateToDate(date: NgbDate): Date {
      return new Date(date.year, date.month - 1, date.day);
   }

   addWorkingDaysByNgbDate(date: Date, addDays: number = 0): NgbDate {
      let currentNbgDate = this.convertDateToNgbDate(date);

      if (addDays < 1) return currentNbgDate;

      let addedDays = currentNbgDate;
      for (let i = 1; i <= addDays; i++) {
         addedDays = this.calendar.getNext(addedDays);
         const dayOfWeek = this.calendar.getWeekday(addedDays);
         if (dayOfWeek === 6 || dayOfWeek === 7) {
            i--;
            continue;
         }
      }
      return addedDays;
   }

  addWorkingDays(date: Date, n: number) {
      if (!n) return date;
      let newDate = new Date(date);
      for (let i = 0; i < Math.abs(n); i++) {
         newDate = this.addDays(newDate, n < 0 ? -1 : 1);
         while (newDate.getDay() == 0 || newDate.getDay() == 6) {
            newDate = this.addDays(newDate, n < 0 ? -1 : 1);
         }
      }
      return newDate;
   }

  function isValidDate(value) {
    // Check if the value is null
    if (value === null) {
        return false;
    }

    // Check if the value is an instance of Date
    if (value instanceof Date) {
        return !isNaN(value.getTime());
    }

    // Convert strings and numbers to Date
    const date = new Date(value);
    return !isNaN(date.getTime());
}

  
}
