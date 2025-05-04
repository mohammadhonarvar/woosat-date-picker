/**
 * This class is based on gregorian, then you can write your calendar with your data.
 * For example you can write persian calendar with your persian data (days label, months label & etc...)
 */
import { TemplateResult, PropertyValues } from 'lit';
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
import type { MonthInterface, WeekDayInterface } from '../data/solar';
export declare type SelectedDateType = {
    rawDate: Date;
    calendarDate: string;
};
export default class CalendarBaseElement extends BaseElement {
    initDate: string | undefined;
    minDate: string | undefined;
    maxDate: string | undefined;
    activeView: string;
    activeDate: string | undefined;
    selectedDateList: number[][];
    onScreenDate: string | undefined;
    shortWeekLabel: boolean;
    rangePicker: boolean;
    timePicker: boolean;
    onlyShowCurrentMonthDays: boolean;
    hideLastFadedRow: boolean;
    highlightToday?: boolean;
    monthsDaysCount: number[];
    monthList: MonthInterface[];
    weekLabelsElement: HTMLElement;
    headerElement: HeaderElement | undefined;
    yearListElement: YearList | undefined;
    decadeListElement: DecadeList | undefined;
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
    constructor();
    protected shouldUpdate(): boolean;
    protected render(): TemplateResult;
    protected firstUpdated(changedProperties: PropertyValues): void;
    protected updated(changedProperties: PropertyValues): void;
    protected getWeekDaysTemplate(day: number, index: number, today: number): TemplateResult;
    protected onDayClick(event: MouseEvent): void;
    protected highlightInRangeDayList(): void;
    private checkEdgeSelectedDate;
    private isEdgeSelectedDate;
    private isInRange;
    protected sortRangeSelectedDates(selectedDates: number[][] | undefined): number[][];
    protected removeSomeClassFormDayElementList(classNameList: string[]): void;
    protected ifActiveDateExist(): boolean;
    protected calculateCalendarWeekList(): void;
    prevMonth(): void;
    nextMonth(): void;
    prevYear(): void;
    nextYear(): void;
    prevDecade(): void;
    nextDecade(): void;
    protected onMonthChangedTo(event: CustomEvent): void;
    protected onYearChangedTo(event: CustomEvent): void;
    protected decadeChanged(event: CustomEvent): void;
    protected onDecadeChangedTo(event: CustomEvent): void;
    protected handleHeaderTitle(): void;
}
