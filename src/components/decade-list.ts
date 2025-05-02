import { html, css, TemplateResult, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseElement } from '../base-element';

@customElement('decade-list')
export class DecadeList extends BaseElement {
  @property({ type: Number })
  currentYear: number | undefined;

  @property({ type: Number })
  minYear: number | undefined;

  @property({ type: Number })
  maxYear: number | undefined;

  decadeList: number[][];
  activeDecade: number[];

  static styles = css`
    :host {
      display: flex;
      flex-flow: row wrap;
    }

    .decade-button {
      width: calc(100% - 40px);
      text-align: center;
      border-radius: 6px;
      padding: 10px 16px;
      font-weight: 500;
      margin: 4px;
      color: rgba(0, 0, 0, 0.6);
      cursor: pointer;
    }

    .decade-button:hover {
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
    this.decadeList = [];
    this.activeDecade = [];
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

    if (changedProperties.has('minYear') || changedProperties.has('maxYear')) {
      this.createDecadeList(this.minYear as number, this.maxYear as number);
    }

    super.update(changedProperties);
  }

  protected render(): TemplateResult {
    this._log('render');

    const year = this.currentYear as number;
    const decadeStart = year - (year % 10);
    let targeIndex = this.decadeList.findIndex((item) => item[0] === decadeStart);
    // It will happen when the user select the maxYear
    if (targeIndex === -1) {
      targeIndex = this.decadeList.findIndex((item) => item[1] === decadeStart);
    }
    this.activeDecade = this.decadeList[targeIndex];

    if (targeIndex === 0) {
      return html` ${(this.decadeList as number[][]).slice(0, 3).map((decade) => {
        return html`
          <div
            class="decade-button"
            ?active="${decade[0] === decadeStart}"
            @click="${(): void => {
              this._fire('decade-changed-to', decade);
            }}"
          >
            <div>${decade[0]}-${decade[1]}</div>
          </div>
        `;
      })}`;
    }

    if (targeIndex === this.decadeList.length - 1) {
      return html` ${(this.decadeList as number[][]).slice(this.decadeList.length - 3).map((decade) => {
        return html`
          <div
            class="decade-button"
            ?active="${decade[0] === decadeStart || decade[1] === this.maxYear}"
            @click="${(): void => {
              this._fire('decade-changed-to', decade);
            }}"
          >
            <div>${decade[0]}-${decade[1]}</div>
          </div>
        `;
      })}`;
    }

    return html` ${(this.decadeList as number[][]).slice(targeIndex - 1, targeIndex + 2).map((decade) => {
      return html`
        <div
          class="decade-button"
          ?active="${decade[0] === decadeStart}"
          @click="${(): void => {
            this._fire('decade-changed-to', decade);
          }}"
        >
          <div>${decade[0]}-${decade[1]}</div>
        </div>
      `;
    })}`;
  }

  protected updated(): void {
    this._log('updated');
    this._fire('decade-changed', this.activeDecade);
  }

  private onCurrentYearChanged(event: Event | CustomEvent): void {
    this._log('onCurrentYearChanged');

    event.stopPropagation();
    if (!event['detail']) return;
    const _event = event as CustomEvent;
    this.currentYear = _event.detail;
  }

  private createDecadeList(minYear: number, maxYear: number): void {
    this._log('createDecadeList');

    if (minYear + 9 > maxYear) {
      this.decadeList.push([minYear, maxYear]);
      return;
    }

    this.decadeList.push([minYear, minYear + 9]);

    const decadeCount = Math.floor((maxYear - minYear) / 10);
    if (decadeCount === 1) {
      this.decadeList[1] = [this.decadeList[0][0] + 1, maxYear];
      return;
    }

    for (let i = 1; i < decadeCount; i++) {
      const startCurrentDecade = this.decadeList[i - 1][1] + 1;
      const decade = [startCurrentDecade, startCurrentDecade + 9];
      this.decadeList.push(decade);
    }

    const lastDecade = this.decadeList[this.decadeList.length - 1];
    if (lastDecade[1] - lastDecade[0] === 0) {
      this.decadeList.splice(this.decadeList.length - 1, 1);
    }

    this.decadeList[this.decadeList.length - 1][1] = maxYear;
  }
}
