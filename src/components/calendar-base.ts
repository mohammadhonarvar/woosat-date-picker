/**
 * This class is based on gregorian, then you can write your calendar with your data.
 * For example you can write persian calendar with your persian data (days label, months label & etc...)
 */

import { TemplateResult, html, PropertyValues } from 'lit';
import { nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

import { BaseElement } from '../base-element';
import './month-list';
import { YearList } from './year-list';
import './year-list';
import { DecadeList } from './decade-list';
import './decade-list';
import { HeaderElement } from './header';
import './header';
import './clock';
import './week-labels';
import { arrowBackward, clock } from '../utils/icon';

import { MonthInterface, WeekDayInterface } from '../data/solar';
import { property, query, queryAll } from 'lit/decorators.js';

export default class CalendarBaseElement extends BaseElement {
  @property({ type: String, attribute: 'date' })
  initDate: string | undefined;

  @property({ type: String, attribute: 'min-date' })
  minDate: string | undefined;

  @property({ type: String, attribute: 'max-date' })
  maxDate: string | undefined;

  @property({ type: String })
  activeView: string;

  @property({ type: String, attribute: 'active-date' })
  activeDate: string | undefined;

  @property({ type: Array })
  selectedDateList: number[][];

  @property({ type: String })
  onScreenDate: string | undefined;

  @property({ type: Boolean })
  shortWeekLabel: boolean;

  @property({ type: Boolean, attribute: 'range-picker' })
  rangePicker: boolean;

  @property({ type: Boolean, attribute: 'time-picker' })
  timePicker: boolean;

  @property({ type: Boolean })
  onlyShowCurrentMonthDays: boolean;

  @property({ type: Boolean })
  hideLastFadedRow: boolean;

  @property({ type: Boolean })
  highlightToday: boolean;

  @property({ type: Array })
  monthsDaysCount: number[];

  @property({ type: Array })
  monthList: MonthInterface[];

  @query('week-labels')
  weekLabelsElement!: HTMLElement;

  @query('header-element')
  headerElement: HeaderElement | undefined;

  @query('year-list')
  yearListElement: YearList | undefined;

  @query('decade-list')
  decadeListElement: DecadeList | undefined;

  @queryAll('.calendar-day')
  calendarDayElementList: HTMLDivElement[] | undefined;

  protected calendarInitDate: number[];
  protected calendarActiveDate: number[];
  protected calendarGregorianInitDate: number[];
  protected calendarOnScreenDate: number[];
  protected selectedDayList: number[];
  protected calendarWeekList: number[][];
  protected leapMonthIndex: number;
  protected weekDayList: WeekDayInterface[] | undefined;
  protected minDateArray: number[];
  protected maxDateArray: number[];

  constructor() {
    super();
    this.activeView = 'calendar';
    this.selectedDateList = [];
    this.shortWeekLabel = true;
    this.rangePicker = false;
    this.timePicker = false;
    this.onlyShowCurrentMonthDays = false;
    this.hideLastFadedRow = false;
    this.highlightToday = true;
    this.monthsDaysCount = [];
    this.monthList = [];
    this.calendarInitDate = [];
    this.calendarActiveDate = [];
    this.calendarGregorianInitDate = [];
    this.calendarOnScreenDate = [];
    this.selectedDayList = [];
    this.calendarWeekList = [];
    this.leapMonthIndex = 11;
    this.weekDayList;
    this.minDateArray = [];
    this.maxDateArray = [];
  }

  protected shouldUpdate(): boolean {
    if (
      !(
        this.initDate &&
        (this.initDate.split('-').length === 3 || this.initDate.split('/').length === 3) &&
        this.minDate &&
        (this.minDate.split('-').length === 3 || this.minDate.split('/').length === 3) &&
        this.maxDate &&
        (this.maxDate.split('-').length === 3 || this.maxDate.split('/').length === 3)
      )
    ) {
      this._warn('Invalid date format: %o', {
        initDate: this.initDate,
        minDate: this.minDate,
        maxDate: this.maxDate,
      });
      return false;
    }
    return true;
  }

  protected render(): TemplateResult {
    this._log('render');

    const today = this.ifActiveDateExist() ? this.calendarInitDate[2] : -1;

    return html`
      <header-element
        ?hidden="${this.activeView === 'clock'}"
        @prev-month=${this.prevMonth}
        @next-month=${this.nextMonth}
        @prev-year=${this.prevYear}
        @next-year=${this.nextYear}
        @prev-decade=${this.prevDecade}
        @next-decade=${this.nextDecade}
        @show-month-list=${(): void => {
          this.activeView = 'monthList';
        }}
        @show-year-list=${(): void => {
          this.activeView = 'yearList';
        }}
        @show-decade-list=${(): void => {
          this.activeView = 'decadeList';
        }}
      >
      </header-element>
      <div class="views-container">
        <div class="view" ?hidden="${this.activeView !== 'calendar'}">
          <week-labels .weekLabelList=${this.weekDayList}></week-labels>
          ${this.calendarWeekList.map((week: number[], index: number) => {
            return html`
              <div class="calendar-row">
                ${week.map((day: number) => {
                  return this.getWeekDaysTemplate(day, index, today);
                })}
              </div>
            `;
          })}
        </div>
        <month-list
          class="view"
          ?hidden="${this.activeView !== 'monthList'}"
          .monthList=${this.monthList}
          @month-changed-to=${this.onMonthChangedTo}
        >
        </month-list>
        <year-list
          class="view"
          ?hidden="${this.activeView !== 'yearList'}"
          .currentYear=${this.calendarOnScreenDate[0]}
          .minYear=${this.minDateArray[0]}
          .maxYear=${this.maxDateArray[0]}
          @year-changed-to=${this.onYearChangedTo}
        >
        </year-list>
        <decade-list
          class="view"
          ?hidden="${this.activeView !== 'decadeList'}"
          .currentYear=${this.calendarOnScreenDate[0]}
          .minYear=${this.minDateArray[0]}
          .maxYear=${this.maxDateArray[0]}
          @decade-changed-to=${this.onDecadeChangedTo}
          @decade-changed=${this.decadeChanged}
        >
        </decade-list>
        <clock-element debug ?hidden="${this.activeView !== 'clock'}"> </clock-element>
      </div>
      ${this.timePicker
        ? html`
            <div
              class="goto-time-view"
              @click=${(): void => {
                this.activeView === 'clock' ? (this.activeView = 'calendar') : (this.activeView = 'clock');
              }}
            >
              ${this.activeView === 'clock' ? arrowBackward : clock}
            </div>
          `
        : nothing}
    `;
  }

  protected firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);
    this._log('firstUpdated');

    this._fire('current-month-changed', this.calendarOnScreenDate[1], true);
  }

  protected updated(changedProperties: PropertyValues): void {
    this._log('updated');

    if (changedProperties.has('activeView')) {
      this.handleHeaderTitle();
    }

    // Prevent re-rendering when shortWeekLabel is changed
    if (changedProperties.has('shortWeekLabel')) {
      if (!this.shortWeekLabel) {
        this.weekLabelsElement.removeAttribute('short-name');
      } else {
        this.weekLabelsElement.setAttribute('short-name', '');
      }
    }

    if (this.selectedDateList.length === 2) {
      this.removeSomeClassFormDayElementList([
        'in-range-date-highlight',
        'selected-date',
        'range-edge-day',
        'range-edge-day-start',
        'range-edge-day-end',
      ]);
      this.highlightInRangeDayList();
    }
  }

  protected getWeekDaysTemplate(day: number, index: number, today: number): TemplateResult {
    // this._log('getCalendarWeekTemplate');

    const notForThisMonth = (index === 0 && day > 7) || (index > 2 && day < 15);
    const classList = {
      'calendar-day': true,
      fade: (index === 0 && day > 7) || (index > 2 && day < 15),
      'current-date-highlight': this.highlightToday && today === day,
      'selected-date':
        !notForThisMonth &&
        this.selectedDateList[0] &&
        this.selectedDateList[0][2] === day &&
        this.calendarOnScreenDate[1] === this.selectedDateList[0][1] &&
        this.calendarOnScreenDate[0] === this.selectedDateList[0][0],
    };

    return html`
      <div
        class="${classMap(classList)}"
        .date="${!notForThisMonth
          ? [this.calendarOnScreenDate[0], this.calendarOnScreenDate[1], day]
          : undefined}"
        @click="${this.onDayClick}"
      >
        <div class="calendar-day-data">
          ${this.onlyShowCurrentMonthDays && notForThisMonth ? nothing : day}
        </div>
      </div>
    `;
  }

  protected onDayClick(event: MouseEvent): void {
    this._log('onDayClick');

    const currentDate = event.currentTarget?.['date'];
    if (!currentDate) return;

    this._fire('date-changed', (currentDate as []).join('-'), true);

    if (!this.rangePicker) {
      (event.currentTarget as HTMLDivElement).classList.add('selected-date');
      this.selectedDateList = [currentDate];
    } else {
      this.selectedDateList.push(currentDate);
      (event.currentTarget as HTMLDivElement).classList.add('selected-date');
      if (this.selectedDateList.length === 2) {
        this.selectedDateList = [...this.selectedDateList];
        this._log('onDayClick: %o', this.selectedDateList);
      }

      if (this.selectedDateList.length > 2) {
        this.removeSomeClassFormDayElementList([
          'in-range-date-highlight',
          'selected-date',
          'range-edge-day',
          'range-edge-day-start',
          'range-edge-day-end',
        ]);
        this.selectedDateList = [];
      }
    }
  }

  protected highlightInRangeDayList(): void {
    this._log('highlightInRangeDayList');

    if (
      this.selectedDateList[0][0] > this.selectedDateList[1][0] ||
      (this.selectedDateList[0][0] === this.selectedDateList[1][0] &&
        this.selectedDateList[0][1] > this.selectedDateList[1][1]) ||
      (this.selectedDateList[0][0] === this.selectedDateList[1][0] &&
        this.selectedDateList[0][1] === this.selectedDateList[1][1] &&
        this.selectedDateList[0][2] > this.selectedDateList[1][2])
    ) {
      this.selectedDateList.reverse();
    }

    const calendarDayElementListArray = Array.from(this.calendarDayElementList as HTMLDivElement[]);
    for (const dayElement of calendarDayElementListArray) {
      if (!dayElement['date']) continue;
      this.checkEdgeSelectedDate(dayElement);
      if (!this.isInRange(dayElement['date'])) continue;
      dayElement.classList.add('in-range-date-highlight');
    }
  }

  private checkEdgeSelectedDate(dayElement: HTMLDivElement): void {
    // this._log('checkEdgeSelectedDate');

    const rangeStartEdge = this.isEdgeSelectedDate(0, dayElement['date']);
    const rangeEndEdge = this.isEdgeSelectedDate(1, dayElement['date']);

    // Example: [[1399, 7, 30], [1399, 7, 30]]
    if (rangeStartEdge && rangeEndEdge) {
      dayElement.classList.add('range-edge-day');
      return;
    }

    if (rangeStartEdge) {
      dayElement.classList.add('range-edge-day', 'range-edge-day-start');
    } else if (rangeEndEdge) {
      dayElement.classList.add('range-edge-day', 'range-edge-day-end');
    }
  }

  private isEdgeSelectedDate(index: number, date: Array<number>): boolean {
    return (
      this.selectedDateList[index][0] === date[0] &&
      this.selectedDateList[index][1] === date[1] &&
      this.selectedDateList[index][2] === date[2]
    );
  }

  private isInRange(dayDate: number[]): boolean {
    // this._log('ifIsInRange');
    return (
      ((this.selectedDateList[0][0] <= dayDate[0] && this.selectedDateList[0][1] < dayDate[1]) ||
        (this.selectedDateList[0][1] === dayDate[1] && this.selectedDateList[0][2] < dayDate[2])) &&
      ((this.selectedDateList[1][0] >= dayDate[0] && this.selectedDateList[1][1] > dayDate[1]) ||
        (this.selectedDateList[1][1] === dayDate[1] && this.selectedDateList[1][2] > dayDate[2]))
    );
  }

  protected sortRangeSelectedDates(selectedDates: number[][] | undefined): number[][] {
    if (!selectedDates) return [];
    this._log('sortRangeSelectedDates');

    const startDate = Date.parse(selectedDates[0].toString());
    const endDate = Date.parse(selectedDates[1].toString());

    return startDate > endDate ? [selectedDates[1], selectedDates[0]] : selectedDates;
  }

  protected removeSomeClassFormDayElementList(classNameList: string[]): void {
    this._log('removeSomeClassFormDayElementList');
    Array.from(this.calendarDayElementList as HTMLDivElement[]).map((dayElement) => {
      dayElement.classList.remove(...classNameList);
    });
  }

  protected ifActiveDateExist(): boolean {
    this._log('ifActiveDateExist');

    return (
      this.calendarActiveDate[0] === this.calendarOnScreenDate[0] &&
      this.calendarActiveDate[1] === this.calendarOnScreenDate[1]
    );
  }

  protected calculateCalendarWeekList(): void {
    this._log('calculateCalendarWeekList');

    this._fire('current-month-changed', this.calendarOnScreenDate[1], true);
    this._fire('current-year-changed', this.calendarOnScreenDate[0], true);
    this.removeSomeClassFormDayElementList(['selected-date']);
    this.requestUpdate();
  }

  prevMonth(): void {
    this._log('prevMonth');

    if (this.calendarOnScreenDate[1] - 1 === 0) {
      if (this.calendarOnScreenDate[0] - 1 > this.minDateArray[0]) {
        this.calendarOnScreenDate = [this.calendarOnScreenDate[0] - 1, 12, 1];
      } else {
        this.calendarOnScreenDate = this.minDateArray;
      }
    } else {
      this.calendarOnScreenDate = [this.calendarOnScreenDate[0], --this.calendarOnScreenDate[1], 1];
    }

    this.calculateCalendarWeekList();
    this.handleHeaderTitle();
  }

  nextMonth(): void {
    this._log('nextMonth');

    if (this.calendarOnScreenDate[1] + 1 > 12) {
      if (this.calendarOnScreenDate[0] + 1 < this.maxDateArray[0]) {
        this.calendarOnScreenDate = [this.calendarOnScreenDate[0] + 1, 1, 1];
      } else {
        this.calendarOnScreenDate = this.maxDateArray;
      }
    } else {
      this.calendarOnScreenDate = [this.calendarOnScreenDate[0], ++this.calendarOnScreenDate[1], 1];
    }

    this.calculateCalendarWeekList();
    this.handleHeaderTitle();
  }

  prevYear(): void {
    this._log('prevYear');

    this.calendarOnScreenDate[0] = this.calendarOnScreenDate[0] - 1;
    if (this.calendarOnScreenDate[0] <= this.minDateArray[0]) {
      this.calendarOnScreenDate[0] = this.minDateArray[0];
    }

    this.calculateCalendarWeekList();
    this.handleHeaderTitle();
  }

  nextYear(): void {
    this._log('nextYear');

    this.calendarOnScreenDate[0] = this.calendarOnScreenDate[0] + 1;
    if (this.calendarOnScreenDate[0] >= this.maxDateArray[0]) {
      this.calendarOnScreenDate[0] = this.maxDateArray[0];
    }

    this.calculateCalendarWeekList();
    this.handleHeaderTitle();
  }

  prevDecade(): void {
    this._log('prevDecade');

    this.calendarOnScreenDate[0] = this.calendarOnScreenDate[0] - (this.calendarOnScreenDate[0] % 10) - 10;
    if (this.calendarOnScreenDate[0] < this.minDateArray[0]) {
      this.calendarOnScreenDate[0] = this.minDateArray[0];
      return;
    }
    this.calculateCalendarWeekList();
  }

  nextDecade(): void {
    this._log('nextDecade');

    this.calendarOnScreenDate[0] = this.calendarOnScreenDate[0] - (this.calendarOnScreenDate[0] % 10) + 10;
    if (this.calendarOnScreenDate[0] > this.maxDateArray[0]) {
      this.calendarOnScreenDate[0] = this.maxDateArray[0];
      return;
    }
    this.calculateCalendarWeekList();
  }

  protected onMonthChangedTo(event: CustomEvent): void {
    this._log('onMonthChangedTo');

    this.calendarOnScreenDate[1] = event.detail;
    this.calculateCalendarWeekList();
    this.activeView = 'calendar';
  }

  protected onYearChangedTo(event: CustomEvent): void {
    this._log('onYearChangedTo');

    this.calendarOnScreenDate[0] = event.detail;
    this.activeView = 'monthList';
    this.calculateCalendarWeekList();
  }

  protected decadeChanged(event: CustomEvent): void {
    this._log('decadeChanged');

    if (!(this.headerElement && ['yearList', 'decadeList'].includes(this.activeView))) return;

    this.headerElement.headerTitle = `${event.detail[0]}-${event.detail[1]}`;
  }

  protected onDecadeChangedTo(event: CustomEvent): void {
    this._log('onDecadeChangedTo');

    this.calendarOnScreenDate[0] = event.detail[0] as number;
    if (this.yearListElement) {
      this.yearListElement.currentYear = event.detail[0] as number;
    }
    requestAnimationFrame(() => {
      this.activeView = 'yearList';
      this.calculateCalendarWeekList();
    });
  }

  protected handleHeaderTitle(): void {
    this._log('handleHeaderTitle');

    if (!this.headerElement) return;

    switch (this.activeView) {
      case 'calendar':
        this.headerElement.calendarActiveView = this.activeView;
        this.headerElement.headerTitle = `${this.monthList[this.calendarOnScreenDate[1] - 1]?.name} ${
          this.calendarOnScreenDate[0]
        }`;
        break;

      case 'monthList':
        this.headerElement.calendarActiveView = this.activeView;
        this.headerElement.headerTitle = this.calendarOnScreenDate[0] + '';
        break;

      case 'yearList':
      case 'decadeList':
        this.headerElement.calendarActiveView = this.activeView;
        if (this.decadeListElement) {
          this.headerElement.headerTitle = `${this.decadeListElement.activeDecade[0]}-${this.decadeListElement.activeDecade[1]}`;
        }
        break;

      default:
        this._warn('Invalid view');
        break;
    }
  }
}
