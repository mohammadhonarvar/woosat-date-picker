import { css, PropertyValues } from 'lit';
import { customElement } from 'lit/decorators.js';

import CalendarBaseElement from './calendar-base';
import { calendarBaseStyle } from '../base-style';
import { convertStringToNumberArray } from '../utils/convert-string-to-number-array';

// This class is based on gregorian, then we can use the following:
import { weekDayList, monthsDaysCount, monthList } from '../data/gregorian';

@customElement('gregorian-calendar-element')
export class GregorianCalendarElement extends CalendarBaseElement {
  protected leapMonthIndex: number;

  static styles = [
    calendarBaseStyle,
    css`
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
        border-radius: 50% 0 0 50%;
      }

      .calendar-row .range-edge-day-end {
        border-radius: 0 50% 50% 0;
      }

      .calendar-row .in-range-date-highlight {
        background: rgba(var(--theme-primary-color), 0.09);
        border-radius: 0;
      }
    `,
  ];

  constructor() {
    super();

    this.minDate = '1900-1-1';
    this.maxDate = '2200-1-1';

    this.minDateArray = convertStringToNumberArray(this.minDate, '-');
    this.maxDateArray = convertStringToNumberArray(this.maxDate, '-');

    this.monthList = monthList;
    this.monthsDaysCount = monthsDaysCount;
    this.weekDayList = weekDayList;
    this.leapMonthIndex = 1;
  }

  protected update(changedProperties: PropertyValues): void {
    this._log('update');

    // Create array of initDate when it's changed
    if (changedProperties.has('initDate')) {
      if (
        new Date(this.initDate as string).getTime() >
        new Date(`${this.maxDateArray[0]}-${this.maxDateArray[1]}-${this.maxDateArray[2]}`).getTime()
      ) {
        this.initDate = this.maxDate as string;
      }

      if (
        new Date(this.initDate as string).getTime() <
        new Date(`${this.minDateArray[0]}-${this.minDateArray[1]}-${this.minDateArray[2]}`).getTime()
      ) {
        this.initDate = this.minDate as string;
      }

      this._log('update: %o', this.initDate);
      this.onScreenDate = this.initDate;

      const initDateArray = convertStringToNumberArray(this.initDate as string, '-');
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

  protected leapYearCalculation(year: number): number {
    this._log('leapYearCalculation');

    let isLeap = 0;
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      isLeap = 1;
    }
    return isLeap;
  }

  protected calculateCalendar(): number[][] {
    this._log('calculateCalendar');

    const date = new Date(`${this.calendarOnScreenDate[0]}-${this.calendarOnScreenDate[1]}-1`);

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
    this._log('startWeekAtIndex: %s', startWeekAtIndex);
    // console.log(startWeekAtIndex);

    const totalCells = currentMonthDaysCount + startWeekAtIndex;
    // this._log('totalCells: %s', totalCells);

    const calendar: Array<number[]> = [];
    let week = Array.from(
      { length: startWeekAtIndex },
      (_v, k) => previousMonthDaysCount - startWeekAtIndex + k + 1,
    );

    for (let i = startWeekAtIndex + 1; calendar.length < 6; ++i) {
      const day = i > totalCells ? i - totalCells : i - startWeekAtIndex;
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

  // protected calculateSelectedDayList() {
  //   this._log('calculateSelectedDayList');
  //   let days: Array<number> = [];
  //   let [onScreenYear, onScreenMonth]: Array<number> = this.calendarOnScreenDate;

  //   this.selectedDateList.forEach(([selectedDateYear, selectedDateMonth, selectedDateDay]: Array<number>) => {
  //     if (selectedDateYear === onScreenYear &&
  //       selectedDateMonth === onScreenMonth)
  //       days.push(selectedDateDay);
  //   });

  //   return days;
  // };

  prevMonth(): void {
    this._log('prevMonth');

    super.prevMonth();
    this._fire('date-changed', this.calendarOnScreenDate.join('-'), true);
  }

  nextMonth(): void {
    this._log('nextMonth');

    super.nextMonth();
    this._fire('date-changed', this.calendarOnScreenDate.join('-'), true);
  }

  prevYear(): void {
    this._log('prevYear');

    super.prevYear();
    this._fire('date-changed', this.calendarOnScreenDate.join('-'), true);
  }

  nextYear(): void {
    this._log('nextYear');

    super.nextYear();
    this._fire('date-changed', this.calendarOnScreenDate.join('-'), true);
  }

  protected calculateCalendarWeekList(): void {
    this._log('calculateCalendarWeekList');

    this.calendarWeekList = this.calculateCalendar();
    super.calculateCalendarWeekList();
  }
}
