import { TemplateResult } from 'lit';
import { BaseElement } from './base-element';
import './components/solar-calendar';
import './components/gregorian-calendar';
export declare class DatePicker extends BaseElement {
    justTimePicker: boolean;
    solar: boolean;
    rangePicker: boolean;
    timePicker: boolean;
    initialDate?: string;
    activeDate?: string;
    highlightToday?: boolean;
    selectedDateList: number[][];
    selectedTime: number[];
    onScreenDate?: string;
    static styles: import("lit").CSSResult;
    constructor();
    protected update(changedProperties: Map<string | number | symbol, unknown>): void;
    protected render(): TemplateResult;
}
