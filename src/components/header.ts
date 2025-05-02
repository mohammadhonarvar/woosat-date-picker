import { html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { BaseElement } from '../base-element';
import { arrowBackward, arrowForward } from '../utils/icon';

@customElement('header-element')
export class HeaderElement extends BaseElement {
  @property({ type: String })
  headerTitle: string | undefined;

  @property({ type: Boolean, attribute: 'disable' })
  disableNavigation: boolean;

  calendarActiveView: string;

  // FIX THEME & CSS VARs
  static styles = css`
    :host {
      display: flex;
      flex-flow: row nowrap;
      padding: 16px;
      align-items: center;
    }

    p {
      font-weight: 500;
      cursor: pointer;
      color: rgba(var(--theme-on-background-color), 0.87);
      align-self: stretch;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      margin: 0 8px;
    }

    .next,
    .previous {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      fill: rgb(var(--theme-primary-color));
      cursor: pointer;
      padding: 6px;
      background-color: rgba(var(--theme-primary-color), 0.09);
    }

    [hidden] {
      display: none;
    }
  `;

  constructor() {
    super();
    this.calendarActiveView = 'calendar';
    this.headerTitle = '';
    this.disableNavigation = false;
  }

  protected render(): TemplateResult {
    this._log('render: %s', this.calendarActiveView);

    return html`
      <div class="previous" ?hidden="${this.disableNavigation}" @click="${this.onPrevArrowClick}">
        ${arrowBackward}
      </div>
      <p @click=${this.onTitleClick}>${this.headerTitle}</p>
      <div class="next" ?hidden="${this.disableNavigation}" @click="${this.onNextArrowClick}">
        ${arrowForward}
      </div>
    `;
  }

  private onTitleClick(): void {
    this._log('onTitleClick');

    switch (this.calendarActiveView) {
      case 'calendar':
        this._fire('show-month-list', undefined);
        break;

      case 'monthList':
        this._fire('show-year-list', undefined);
        break;

      case 'yearList':
        this._fire('show-decade-list', undefined);
        break;

      case 'decadeList':
        this._fire('show-year-list', undefined);
        break;

      default:
        this._warn('Invalid view');
        break;
    }
  }

  private onPrevArrowClick(): void {
    this._log('onPrevArrowClick');

    switch (this.calendarActiveView) {
      case 'calendar':
        this._fire('prev-month', undefined);
        break;

      case 'monthList':
        this._fire('prev-year', undefined);
        break;

      case 'yearList':
      case 'decadeList':
        this._fire('prev-decade', undefined);
        break;

      default:
        this._warn('Invalid view');
        break;
    }
  }

  private onNextArrowClick(): void {
    this._log('onNextArrowClick');

    switch (this.calendarActiveView) {
      case 'calendar':
        this._fire('next-month', undefined);
        break;

      case 'monthList':
        this._fire('next-year', undefined);
        break;

      case 'yearList':
      case 'decadeList':
        this._fire('next-decade', undefined);
        break;

      default:
        this._warn('Invalid view');
        break;
    }
  }
}
