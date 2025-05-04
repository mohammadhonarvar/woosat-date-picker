import { TemplateResult, PropertyValues } from 'lit';
import { BaseElement } from '../base-element';
export declare class YearList extends BaseElement {
    currentYear: number | undefined;
    activeYear: number | undefined;
    maxYear: number | undefined;
    minYear: number | undefined;
    private yearList;
    static styles: import("lit").CSSResult;
    constructor();
    disconnectedCallback(): void;
    protected shouldUpdate(): boolean;
    protected update(changedProperties: PropertyValues): void;
    protected render(): TemplateResult;
    private onCurrentYearChanged;
    private calculateYearList;
}
