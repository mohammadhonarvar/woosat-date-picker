import { TemplateResult } from 'lit';
import { BaseElement } from '../base-element';
interface WeekLabelInterface {
    name: string;
    shortName: string;
}
export declare class WeekLabelList extends BaseElement {
    weekLabelList: WeekLabelInterface[] | undefined;
    useShortName: boolean;
    static styles: import("lit").CSSResult;
    constructor();
    protected shouldUpdate(): boolean;
    protected render(): TemplateResult;
}
export {};
