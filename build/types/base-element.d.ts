import { LitElement } from 'lit';
export declare abstract class BaseElement extends LitElement {
    debug: boolean;
    constructor();
    protected performUpdate(): Promise<unknown>;
    private __logger;
    protected log(message: unknown, ...restParam: unknown[]): void;
    protected _log(message: unknown, ...restParam: unknown[]): void;
    protected _warn(message: unknown, ...restParam: unknown[]): void;
    protected _error(message: unknown, ...restParam: unknown[]): void;
    protected _l10nNumber(number: number): string;
    protected _fire<T>(eventName: string, detail: T, bubbles?: boolean): void;
}
