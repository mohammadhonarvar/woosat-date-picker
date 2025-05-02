import { html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { BaseElement } from '../base-element';

interface MonthLabelInterface {
  name: string;
  shortName: string;
}

@customElement('month-list')
export class MonthList extends BaseElement {
  @property({ type: Array })
  monthList: MonthLabelInterface[] | undefined;

  @property({ type: Number, attribute: 'active-month' })
  activeMonthNumber: number;

  static styles = css`
    :host {
      display: flex;
      flex-flow: row wrap;
    }

    .month-button {
      width: calc(33.33333% - 40px);
      text-align: center;
      border-radius: 6px;
      padding: 10px 16px;
      font-weight: 500;
      margin: 4px;
      color: rgba(0, 0, 0, 0.6);
      cursor: pointer;
    }

    .month-button:hover {
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
    document.addEventListener('current-month-changed', this.onCurrentMonthChanged.bind(this));
    this.activeMonthNumber = 1;
  }

  disconnectedCallback(): void {
    document.removeEventListener('current-month-changed', this.onCurrentMonthChanged.bind(this));
    super.disconnectedCallback();
  }

  protected shouldUpdate(): boolean {
    this._log('shouldUpdate');
    return Array.isArray(this.monthList) && this.monthList.length > 0;
  }

  protected render(): TemplateResult {
    this._log('render');

    return html` ${(this.monthList as MonthLabelInterface[]).map(
      (month: MonthLabelInterface, index: number) => {
        return html`
          <div
            class="month-button"
            ?active="${this.activeMonthNumber === index + 1}"
            @click=${(): void => {
              this.activeMonthNumber = index + 1;
              this._fire('month-changed-to', index + 1);
            }}
          >
            <div>${month.shortName ? month.shortName : month.name}</div>
          </div>
        `;
      },
    )}`;
  }

  private onCurrentMonthChanged(event: Event | CustomEvent): void {
    this._log('onCurrentMonthChanged');

    event.stopPropagation();
    if (!event['detail']) return;
    const _event = event as CustomEvent;
    this.activeMonthNumber = _event.detail;
  }
}
