import { html, css, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, query, queryAll } from 'lit/decorators.js';
import { BaseElement } from '../base-element';
import { addLeadingZero } from '../utils/add-leading-zero';

const dateNow = new Date();

@customElement('clock-element')
export class ClockElement extends BaseElement {
  @property({ type: String })
  time: string;

  @property({ type: Number })
  focusedInputIndex: number;

  @query('input[name="hour"]')
  hourInputElement: HTMLInputElement | undefined;

  @query('input[name="minute"]')
  minuteInputElement: HTMLInputElement | undefined;

  @query('input[name="second"]')
  secondInputElement: HTMLInputElement | undefined;

  @queryAll('input')
  inputElementList: HTMLInputElement[] | undefined;

  private timeArray: number[];

  static styles = css`
    :host {
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      margin-top: 24px;
    }

    .clock {
      border-radius: 50%;
      width: 150px;
      height: 150px;
      background: #efefef;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
      border: 3px solid #ffffff;
      margin: 24px auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .pointer {
      position: absolute;
      transform-origin: 0;
      border-radius: 4px;
      background: #9a9a9e;
      transition: cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.65s;
    }

    .hour {
      width: 42px;
      height: 4px;
      transform: translate(50%) rotate(0deg);
    }

    .minute {
      width: 48px;
      height: 3px;
      transform: translate(50%) rotate(130deg);
    }

    .second {
      background: #fa7777;
      width: 56px;
      height: 2px;
      transform: translate(50%) rotate(90deg);
    }

    .center-dot {
      background: #ffffff;
      border: 4px solid #9a9a9e;
      border-radius: 50%;
      width: 3px;
      height: 3px;
      z-index: 2;
    }

    .clock-input-container {
      color: rgba(0, 0, 0, 0.38);
      margin: 24px auto;
      display: flex;
      align-items: center;
    }

    .clock-input-container input {
      outline: none;
      width: 42px;
      height: 42px;
      background-color: #efefef;
      border: none;
      margin: 0 8px;
      border-radius: 4px;
      text-align: center;
      font-size: 16px;
      font-weight: 700;
      color: rgba(0, 0, 0, 0.38);
    }
  `;

  constructor() {
    super();
    this.time = `${addLeadingZero(dateNow.getHours())}:${addLeadingZero(
      dateNow.getMinutes(),
    )}:${addLeadingZero(dateNow.getSeconds())}`;

    this.focusedInputIndex = -1;
    this.timeArray = this.time.split(':').map((item) => parseInt(item));
  }

  protected shouldUpdate(): boolean {
    this._log('shouldUpdate');
    return this.time.split(':').length === 2 || this.time.split(':').length === 3;
  }

  protected update(changedProperties: PropertyValues): void {
    this._log('update');

    if (changedProperties.has('time')) {
      this.timeArray = this.time.split(':').map((item) => parseInt(item));
    }

    super.update(changedProperties);
  }

  protected render(): TemplateResult {
    this._log('render');

    return html`
      <div class="clock">
        <div
          class="pointer hour"
          style="transform: translate(50%) rotate(${(this.timeArray[0] % 12) * 30 +
          this.timeArray[1] * 0.5 -
          90.0}deg)"
        ></div>
        <div
          class="pointer minute"
          style="transform: translate(50%) rotate(${this.timeArray[1] * 6 - 90.0}deg)"
        ></div>
        <div
          class="pointer second"
          style="transform: translate(50%) rotate(${this.timeArray[2] * 6 - 90.0}deg)"
        ></div>
        <div class="center-dot"></div>
      </div>
      <div class="clock-input-container">
        <input
          name="hour"
          type="text"
          maxlength="2"
          value="${addLeadingZero(this.timeArray[0])}"
          @blur="${this.onInputBlur}"
          @keydown="${this.onKeydown}"
          @input="${this.onInput}"
          @focus="${(): void => {
            this.focusedInputIndex = 0;
          }}"
        />
        :
        <input
          name="minute"
          type="text"
          maxlength="2"
          value="${addLeadingZero(this.timeArray[1])}"
          @blur="${this.onInputBlur}"
          @keydown="${this.onKeydown}"
          @input="${this.onInput}"
          @focus="${(): void => {
            this.focusedInputIndex = 1;
          }}"
        />
        ${this.timeArray.length === 3
          ? html`
              :
              <input
                name="second"
                type="text"
                maxlength="2"
                value="${addLeadingZero(this.timeArray[2])}"
                @blur="${this.onInputBlur}"
                @keydown="${this.onKeydown}"
                @input="${this.onInput}"
                @focus="${(): void => {
                  this.focusedInputIndex = 2;
                }}"
              />
            `
          : ''}
      </div>
    `;
  }

  protected onInputBlur(event: KeyboardEvent): void {
    this._log('onInputBlur');

    const inputValue = (event.target?.['value'] as string).trim();
    const inputName = event.target?.['name'];
    this.updateInputValue(inputName, parseInt(inputValue === '' ? '0' : inputValue));
  }

  protected onKeydown(event: KeyboardEvent): void {
    this._log('onKeydown');

    if (!([8, 9, 13, 35, 36, 37, 39, 38, 40, 46].includes(event.keyCode) || /[0-9]/.test(event.key))) {
      event.preventDefault();
      return;
    }

    if (event.keyCode === 13) {
      if (this.focusedInputIndex === 2) {
        this.inputElementList![this.focusedInputIndex].blur();
      } else {
        this.inputElementList![this.focusedInputIndex + 1].focus();
      }

      return;
    }

    const inputValue = event.target?.['value'] as string;
    const inputName = event.target?.['name'];

    const changeFactor = event.keyCode === 38 ? 1 : event.keyCode === 40 ? -1 : 0;

    if (changeFactor === 0 && !this.validClockInput(inputName, inputValue + event.key)) {
      if (event.keyCode !== 8) event.preventDefault();
      return;
    }

    if (changeFactor === 0) return;

    this.updateInputValue(inputName, parseInt(inputValue === '' ? '0' : inputValue) + changeFactor);

    this._fire(
      'time-changed',
      {
        stringTime: `${addLeadingZero(this.timeArray[0])}:${addLeadingZero(
          this.timeArray[1],
        )}:${addLeadingZero(this.timeArray[2])}`,
        arrayTime: this.timeArray,
      },
      true,
    );
  }

  protected onInput(event: KeyboardEvent): void {
    this._log('onInput');

    const inputValue = (event.target?.['value'] as string).trim();
    const inputName = event.target?.['name'];

    if (inputValue.length < 2) return;

    this.updateInputValue(inputName, parseInt(inputValue));
  }

  protected updateInputValue(inputName: string, value: number): void {
    this._log('updateAllInputValues');

    switch (inputName) {
      case 'hour':
        if (value > 23) value = 0;
        else if (value < 0) value = 23;
        this.hourInputElement!.value = addLeadingZero(value);
        this.timeArray[0] = value;
        break;

      case 'minute':
        if (value > 59) value = 0;
        else if (value < 0) value = 59;
        this.minuteInputElement!.value = addLeadingZero(value);
        this.timeArray[1] = value;
        break;

      case 'second':
        if (value > 59) value = 0;
        else if (value < 0) value = 59;
        this.secondInputElement!.value = addLeadingZero(value);
        this.timeArray[2] = value;

        break;
    }

    this.requestUpdate();
  }

  protected validClockInput(inputName: string, value: string): boolean {
    const integerValue = parseInt(value === '' ? '0' : value);
    return (
      (inputName === 'hour' && integerValue < 24 && integerValue > -1) ||
      ((inputName === 'minute' || inputName === 'second') && integerValue < 60 && integerValue > -1)
    );
  }
}
