import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export abstract class BaseElement extends LitElement {
  @property({ type: Boolean, reflect: true })
  debug: boolean;

  constructor() {
    super();
    this.debug = false;
  }

  protected async performUpdate(): Promise<unknown> {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    return super.performUpdate();
  }

  private __logger(logLevel: string, message: unknown, ...restParam: unknown[]): void {
    // first args must be separated as keyPattern for fix issue of `this._log('a=%s', a)`
    const tagName = (this.tagName + '').toLowerCase();
    console[logLevel](
      `%c<%s>%c ${message}`,
      'color: #4CAF50; font-size: 1.2em;',
      tagName,
      'color: inherit;font-size: 1em',
      ...restParam,
    );
  }

  protected log(message: unknown, ...restParam: unknown[]): void {
    this.__logger('log', message, ...restParam);
  }

  protected _log(message: unknown, ...restParam: unknown[]): void {
    if (this.debug) {
      this.log(message, ...restParam);
    }
  }

  protected _warn(message: unknown, ...restParam: unknown[]): void {
    this.__logger('warn', message, ...restParam);
  }

  protected _error(message: unknown, ...restParam: unknown[]): void {
    this.__logger('error', message, ...restParam);
  }

  protected _l10nNumber(number: number): string {
    return new Intl.NumberFormat(this.lang).format(number);
  }

  protected _fire(eventName: string, detail: unknown, bubbles = false): void {
    this._log('fire %s {%o}', eventName, detail);
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail,
        bubbles,
        composed: bubbles,
      }),
    );
  }
}
