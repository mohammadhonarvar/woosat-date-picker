import { TemplateResult, PropertyValues } from 'lit';
import { BaseElement } from '../base-element';
export declare class DecadeList extends BaseElement {
    currentYear: number | undefined;
    minYear: number | undefined;
    maxYear: number | undefined;
    decadeList: number[][];
    activeDecade: number[];
    static styles: import("lit").CSSResult;
    constructor();
    disconnectedCallback(): void;
    protected shouldUpdate(): boolean;
    protected update(changedProperties: PropertyValues): void;
    protected render(): TemplateResult;
    protected updated(): void;
    private onCurrentYearChanged;
    private createDecadeList;
}
