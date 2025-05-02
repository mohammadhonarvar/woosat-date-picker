import { html, css, TemplateResult, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { BaseElement } from '../base-element';

@customElement('year-list')
export class YearList extends BaseElement {
  @property({ type: Number })
  currentYear: number | undefined;

  @property({ type: Number })
  activeYear: number | undefined;

  @property({ type: Number })
  maxYear: number | undefined;

  @property({ type: Number })
  minYear: number | undefined;

  private yearList: number[] | undefined;

  static styles = css`
    :host {
      display: flex;
      flex-flow: row wrap;
    }

    .year-button {
      width: calc(33.33333% - 40px);
      text-align: center;
      border-radius: 6px;
      padding: 10px 16px;
      font-weight: 500;
      margin: 4px;
      color: rgba(0, 0, 0, 0.6);
      cursor: pointer;
    }

    .year-button:hover {
      background-color: rgba(var(--theme-primary-color), 0.09);
      color: rgba(var(--theme-on-background-color), 0.6);
    }

    [active] {
      background-color: rgb(var(--theme-primary-color));
      color: rgba(var(--theme-on-primary-color), 0.87);
    }
  `;

  constructor() {
    super();
    document.addEventListener('current-year-changed', this.onCurrentYearChanged.bind(this));
  }

  disconnectedCallback(): void {
    document.removeEventListener('current-year-changed', this.onCurrentYearChanged.bind(this));
    super.disconnectedCallback();
  }

  protected shouldUpdate(): boolean {
    this._log('shouldUpdate');
    if (!(this.currentYear && this.minYear && this.maxYear)) {
      return false;
    }

    return true;
  }

  protected update(changedProperties: PropertyValues): void {
    this._log('update');

    if (changedProperties.has('currentYear')) {
      this.calculateYearList();
    }

    super.update(changedProperties);
  }

  protected render(): TemplateResult {
    this._log('render');

    return html` ${(this.yearList as number[]).map((year) => {
      return html`
        <div
          class="year-button"
          ?active="${this.activeYear === year}"
          @click="${(): void => {
            this.activeYear = year;
            this._fire('year-changed-to', year);
          }}"
        >
          <div>${year}</div>
        </div>
      `;
    })}`;
  }

  private onCurrentYearChanged(event: Event | CustomEvent): void {
    this._log('onCurrentYearChanged');

    event.stopPropagation();
    if (!event['detail']) return;
    const _event = event as CustomEvent;
    this.currentYear = this.activeYear = _event.detail;
  }

  private calculateYearList(): void {
    this._log('calculateYearList');

    const currentYear = this.currentYear as number;
    const minYear = this.minYear as number;
    const maxYear = this.maxYear as number;
    let decade = currentYear - (currentYear % 10);

    // FIXME:
    if (currentYear > maxYear || currentYear < minYear) return;

    if (currentYear === maxYear) {
      decade = maxYear - 10;
      this.yearList = Array.from({ length: 11 }, (_item, index) => decade + index);
      return;
    }

    if (maxYear - decade === 10) {
      this.yearList = Array.from({ length: 11 }, (_item, index) => decade + index);
      return;
    }

    if (decade + 9 > maxYear) {
      this.yearList = Array.from({ length: maxYear - currentYear + 1 }, (_item, index) => decade + index);
      return;
    }

    this.yearList = Array.from({ length: 10 }, (_item, index) => decade + index);
    this.activeYear = currentYear;
  }
}
