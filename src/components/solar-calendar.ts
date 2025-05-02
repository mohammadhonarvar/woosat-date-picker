import { css, PropertyValues } from 'lit';
import { customElement } from 'lit/decorators.js';

import CalendarBaseElement from './calendar-base';
import { calendarBaseStyle } from '../base-style';

import { convertStringToNumberArray } from '../utils/convert-string-to-number-array';

// This class is based on gregorian, then we can use the following:
import { weekDayList, monthsDaysCount, monthList } from '../data/solar';

@customElement('solar-calendar-element')
export class SolarCalendarElement extends CalendarBaseElement {
  protected leapMonthIndex: number;

  static styles = [
    calendarBaseStyle,
    css`
      :host() {
        direction: rtl;
      }

      week-labels {
        direction: rtl;
      }

      .calendar-row {
        direction: rtl;
      }

      .container {
        background-color: rgb(var(--theme-background-color));
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }

      .calendar-row .selected-date {
        background: rgb(var(--theme-primary-color));
        color: rgba(var(--theme-on-primary-color), 0.87);
      }

      .calendar-row .range-edge-day {
        background: rgb(var(--theme-primary-color));
        color: rgba(var(--theme-on-primary-color), 0.87);
        transition: ease-in 0.15s;
      }

      .calendar-row .range-edge-day-start {
        border-radius: 0 50% 50% 0;
      }

      .calendar-row .range-edge-day-end {
        border-radius: 50% 0 0 50%;
      }

      .calendar-row .in-range-date-highlight {
        background: rgba(var(--theme-primary-color), 0.09);
        border-radius: 0;
      }
    `,
  ];

  constructor() {
    super();

    this.minDate = '1300/1/1';
    this.maxDate = '1500/1/1';

    this.minDateArray = convertStringToNumberArray(this.minDate as string, '/');

    this.maxDateArray = convertStringToNumberArray(this.maxDate, '/');

    this.monthList = monthList;
    this.monthsDaysCount = monthsDaysCount;
    this.weekDayList = weekDayList;
    this.leapMonthIndex = 11;
  }

  protected update(changedProperties: PropertyValues): void {
    this._log('update');

    if (changedProperties.has('minDate')) {
      this.minDateArray = convertStringToNumberArray(this.minDate as string, '/');
    }

    if (changedProperties.has('maxDate')) {
      this.maxDateArray = convertStringToNumberArray(this.maxDate as string, '/');
    }

    // Create array of initDate when it's changed
    if (changedProperties.has('initDate')) {
      const initDateArray = convertStringToNumberArray(this.initDate as string, '/');
      if (
        initDateArray[0] > this.maxDateArray[0] ||
        (initDateArray[0] === this.maxDateArray[0] && initDateArray[1] > this.maxDateArray[1]) ||
        (initDateArray[0] === this.maxDateArray[0] &&
          initDateArray[1] === this.maxDateArray[1] &&
          initDateArray[2] > this.maxDateArray[2])
      ) {
        this.initDate = this.maxDate as string;
      }

      if (
        initDateArray[0] < this.minDateArray[0] ||
        (initDateArray[0] === this.minDateArray[0] && initDateArray[1] < this.minDateArray[1]) ||
        (initDateArray[0] === this.minDateArray[0] &&
          initDateArray[1] === this.minDateArray[1] &&
          initDateArray[2] < this.minDateArray[2])
      ) {
        this.initDate = this.minDate as string;
      }

      this.onScreenDate = this.initDate;
      this.calendarInitDate = initDateArray;
      // We need a cloned array here
      this.calendarOnScreenDate = initDateArray.slice(0);
      this.calendarActiveDate = initDateArray.slice(0);
      this.calendarWeekList = this.calculateCalendar();
    }

    if (changedProperties.has('activeDate')) {
      this.calendarActiveDate = convertStringToNumberArray(this.activeDate as string, '/');
    }

    super.update(changedProperties);
  }

  protected calculateCalendar(): number[][] {
    this._log('calculateCalendar');

    const newDate = this.convertToGregorian(this.calendarOnScreenDate[0], this.calendarOnScreenDate[1], 1);
    const date = new Date(newDate[0], newDate[1] - 1, newDate[2]);

    const currentMonthDaysCount =
      this.monthsDaysCount[this.calendarOnScreenDate[1] - 1] +
      (this.calendarOnScreenDate[1] - 1 === this.leapMonthIndex
        ? this.leapYearCalculation(this.calendarOnScreenDate[0])
        : 0);

    let tempYear = this.calendarOnScreenDate[0];
    let previousMonthIndex: number = this.calendarOnScreenDate[1] - 2;
    if (previousMonthIndex <= 0) {
      tempYear--;
      if (tempYear < this.minDateArray[0]) {
        tempYear = this.minDateArray[0];
      }
      previousMonthIndex = 11;
    }
    const previousMonthDaysCount =
      this.monthsDaysCount[previousMonthIndex] +
      (previousMonthIndex === this.leapMonthIndex ? this.leapYearCalculation(tempYear) : 0);

    const startWeekAtIndex = date.getDay();
    // We need to find index of day in the jalali week days
    let startWeekAtIndexInJalali = startWeekAtIndex + 1;
    if (startWeekAtIndexInJalali > 6) {
      startWeekAtIndexInJalali = 0;
    }

    const totalCells = currentMonthDaysCount + startWeekAtIndexInJalali;
    const calendar: Array<number[]> = [];
    let week = Array.from(
      { length: startWeekAtIndexInJalali },
      (_v, k) => previousMonthDaysCount - startWeekAtIndexInJalali + k + 1,
    );

    for (let i = startWeekAtIndexInJalali + 1; calendar.length < 6; ++i) {
      const day = i > totalCells ? i - totalCells : i - startWeekAtIndexInJalali;
      if (i % 7 === 0) {
        week.push(day);
        calendar.push(week);
        week = [];
        if ((this.onlyShowCurrentMonthDays || this.hideLastFadedRow) && 7 * calendar.length >= totalCells)
          break;
        continue;
      }
      week.push(day);
    }

    return calendar;
  }

  private convertToGregorian(year: number, month: number, day: number): number[] {
    this._log('convertToGregorian');

    let gregorianYear;
    if (year > 979) {
      gregorianYear = 1600;
      year -= 979;
    } else {
      gregorianYear = 621;
    }

    let days =
      365 * year +
      Math.floor(year / 33) * 8 +
      ((year % 33) + 3) / 4 +
      78 +
      day +
      (month < 7 ? (month - 1) * 31 : (month - 7) * 30 + 186);

    gregorianYear += 400 * Math.floor(days / 146097);

    days %= 146097;
    if (Math.floor(days) > 36524) {
      gregorianYear += 100 * Math.floor(--days / 36524);
      days %= 36524;
      if (days >= 365) days++;
    }
    gregorianYear += 4 * Math.floor(days / 1461);
    days %= 1461;
    gregorianYear += Math.floor((days - 1) / 365);

    if (days > 365) days = (days - 1) % 365;
    let gregorianDay = Math.floor(days + 1);
    const montDays = [
      0,
      31,
      (gregorianYear % 4 === 0 && gregorianYear % 100 !== 0) || gregorianYear % 400 === 0 ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];

    let index = 0;
    for (; index <= 12; index++) {
      if (gregorianDay <= montDays[index]) break;
      gregorianDay -= montDays[index];
    }

    return [gregorianYear, index, gregorianDay];
  }

  protected leapYearCalculation(year: number): number {
    this._log('Persian-calendar: leapYearCalculation');
    return [1, 5, 9, 13, 17, 22, 26, 30].indexOf(year % 33) > -1 ? 1 : 0;
  }

  prevMonth(): void {
    this._log('prevMonth');

    super.prevMonth();
    this._fire('date-changed', this.calendarOnScreenDate.join('/'), true);
  }

  nextMonth(): void {
    this._log('nextMonth');

    super.nextMonth();
    this._fire('date-changed', this.calendarOnScreenDate.join('/'), true);
  }

  prevYear(): void {
    this._log('prevYear');

    super.prevYear();
    this._fire('date-changed', this.calendarOnScreenDate.join('/'), true);
  }

  nextYear(): void {
    this._log('nextYear');

    super.nextYear();
    this._fire('date-changed', this.calendarOnScreenDate.join('/'), true);
  }

  protected calculateCalendarWeekList(): void {
    this._log('calculateCalendarWeekList');

    this.calendarWeekList = this.calculateCalendar();
    super.calculateCalendarWeekList();
  }
}
