import { TemplateResult } from 'lit';
import { BaseElement } from '../base-element';
export declare class HeaderElement extends BaseElement {
    headerTitle: string | undefined;
    disableNavigation: boolean;
    calendarActiveView: string;
    static styles: import("lit").CSSResult;
    constructor();
    connectedCallback(): void;
    protected render(): TemplateResult;
    private onTitleClick;
    private onPrevArrowClick;
    private onNextArrowClick;
}
