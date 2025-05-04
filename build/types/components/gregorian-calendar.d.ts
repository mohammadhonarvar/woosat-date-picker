import { PropertyValues } from 'lit';
import CalendarBaseElement from './calendar-base';
export declare class GregorianCalendarElement extends CalendarBaseElement {
    protected leapMonthIndex: number;
    static styles: import("lit").CSSResult[];
    constructor();
    protected update(changedProperties: PropertyValues): void;
    protected leapYearCalculation(year: number): number;
    protected calculateCalendar(): number[][];
    prevMonth(): void;
    nextMonth(): void;
    prevYear(): void;
    nextYear(): void;
    protected calculateCalendarWeekList(): void;
    protected onDayClick(event: MouseEvent): void;
}
