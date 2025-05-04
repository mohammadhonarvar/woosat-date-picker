import { TemplateResult, PropertyValues } from 'lit';
import { BaseElement } from '../base-element';
export declare class ClockElement extends BaseElement {
    time: string;
    focusedInputIndex: number;
    hourInputElement: HTMLInputElement | undefined;
    minuteInputElement: HTMLInputElement | undefined;
    secondInputElement: HTMLInputElement | undefined;
    inputElementList: HTMLInputElement[] | undefined;
    private timeArray;
    static styles: import("lit").CSSResult;
    constructor();
    protected shouldUpdate(): boolean;
    protected update(changedProperties: PropertyValues): void;
    protected render(): TemplateResult;
    protected onInputBlur(event: KeyboardEvent): void;
    protected onKeydown(event: KeyboardEvent): void;
    protected onInput(event: KeyboardEvent): void;
    protected updateInputValue(inputName: string, value: number): void;
    protected validClockInput(inputName: string, value: string): boolean;
}
