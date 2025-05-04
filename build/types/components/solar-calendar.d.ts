import { PropertyValues } from 'lit';
import CalendarBaseElement from './calendar-base';
export declare class SolarCalendarElement extends CalendarBaseElement {
    protected leapMonthIndex: number;
    static styles: import("lit").CSSResult[];
    constructor();
    protected update(changedProperties: PropertyValues): void;
    protected calculateCalendar(): number[][];
    private convertToGregorian;
    protected leapYearCalculation(year: number): number;
    prevMonth(): void;
    nextMonth(): void;
    prevYear(): void;
    nextYear(): void;
    protected calculateCalendarWeekList(): void;
    protected onDayClick(event: MouseEvent): void;
}
