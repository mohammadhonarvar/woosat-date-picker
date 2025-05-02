import { html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseElement } from '../base-element';

interface WeekLabelInterface {
  name: string;
  shortName: string;
}

@customElement('week-labels')
export class WeekLabelList extends BaseElement {
  @property({ type: Array })
  weekLabelList: WeekLabelInterface[] | undefined;

  @property({ type: Boolean, attribute: 'short-name' })
  useShortName: boolean;

  static styles = css`
    :host {
      display: flex;
      padding: 0 8px;
      margin-top: 6px;
      margin-bottom: 8px;
      font-weight: 500;
      font-size: 0.85em;
      color: rgba(var(--theme-on-background-color), 0.38);
    }

    .week-day {
      font-weight: 500;
      flex: 1 0 auto;
      position: relative;
    }

    .week-day::after {
      content: '';
      float: left;
      display: block;
      padding-top: 100%;
    }

    .week-day-data {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `;

  constructor() {
    super();
    this.useShortName = false;
  }

  protected shouldUpdate(): boolean {
    this._log('shouldUpdate');
    return Array.isArray(this.weekLabelList) && this.weekLabelList.length > 0;
  }

  protected render(): TemplateResult {
    this._log('render');

    return html` ${(this.weekLabelList as WeekLabelInterface[]).map((week: WeekLabelInterface) => {
      return html`
        <div class="week-day">
          <div class="week-day-data">${this.useShortName ? week.shortName : week.name}</div>
        </div>
      `;
    })}`;
  }
}
