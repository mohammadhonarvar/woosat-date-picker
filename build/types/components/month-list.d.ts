import { TemplateResult } from 'lit';
import { BaseElement } from '../base-element';
interface MonthLabelInterface {
    name: string;
    shortName: string;
}
export declare class MonthList extends BaseElement {
    monthList: MonthLabelInterface[] | undefined;
    activeMonthNumber: number;
    static styles: import("lit").CSSResult;
    constructor();
    disconnectedCallback(): void;
    protected shouldUpdate(): boolean;
    protected render(): TemplateResult;
    private onCurrentMonthChanged;
}
export {};
