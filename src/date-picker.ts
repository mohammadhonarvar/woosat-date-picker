import { html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { ifDefined } from 'lit/directives/if-defined.js';

import { BaseElement } from './base-element';
import './components/solar-calendar';
import './components/gregorian-calendar';

import { fixPersianNumber } from './utils/fix-persian-number';

@customElement('date-picker')
export class DatePicker extends BaseElement {
  @property({ type: Boolean })
  justTimePicker: boolean;

  @property({ type: Boolean })
  solar: boolean;

  @property({ type: Boolean, attribute: 'range-picker' })
  rangePicker: boolean;

  @property({ type: Boolean, attribute: 'time-picker' })
  timePicker: boolean;

  @property({ type: String, attribute: 'date' })
  initialDate?: string;

  @property({ type: String, attribute: 'active-date' })
  activeDate?: string;

  // must be sorted past[index: 0] -> future[index: 1]
  // 2D array -> [[2020, 2, 3]] || [[2020, 2, 3], [2020, 6, 1]] || []
  @property({ type: Array })
  selectedDateList: number[][];

  @property({ type: Array })
  selectedTime: number[];

  @property({ type: String, attribute: false })
  onScreenDate?: string;

  static styles = css`
    :host {
      display: block;
      user-select: none;
      overflow: hidden;
    }
  `;

  constructor() {
    super();
    this.justTimePicker = false;
    this.solar = false;
    this.rangePicker = false;
    this.timePicker = false;
    this.rangePicker = false;
    this.selectedDateList = [];
    this.selectedTime = [];
  }

  protected update(changedProperties: Map<string | number | symbol, unknown>): void {
    this._log('update');

    if (changedProperties.has('solar')) {
      if (this.solar) {
        this.initialDate = fixPersianNumber(new Date().toLocaleDateString('fa'));
        this.onScreenDate = this.initialDate;
        this.activeDate = this.initialDate;
      } else {
        this.initialDate = new Date().toLocaleDateString('en-CA');
      }
    }

    super.update(changedProperties);
  }

  protected render(): TemplateResult {
    this._log('render');
    return html`
      ${this.solar
        ? html` <solar-calendar-element
            debug
            date="${ifDefined(this.initialDate)}"
            ?range-picker="${this.rangePicker}"
            ?time-picker="${this.timePicker}"
            .selectedDateList=${this.selectedDateList}
            @date-changed=${(event: CustomEvent): void => {
              this._log('current date is: %s', event.detail);
            }}
            @time-changed=${(event: CustomEvent): void => {
              event.stopPropagation();
              this._log('current time is: %o', event.detail);
            }}
          >
          </solar-calendar-element>`
        : html`
            <gregorian-calendar-element
              date="${ifDefined(this.initialDate)}"
              ?range-picker="${this.rangePicker}"
              ?time-picker="${this.timePicker}"
              .selectedDateList=${this.selectedDateList}
              @date-changed=${(event: CustomEvent): void => {
                this._log('current date is: %s', event.detail);
              }}
              @time-changed=${(event: CustomEvent): void => {
                event.stopPropagation();
                this._log('current time is: %o', event.detail);
              }}
            >
            </gregorian-calendar-element>
          `}
    `;
  }
}
