import { css } from 'lit';

export const calendarBaseStyle = css`
  :host {
    /*A0144F*/
    --theme-primary-color: var(--primary-color, 98, 0, 238);
    --theme-primary-variant-color: var(--primary-variant-color, 55, 0, 179);

    --theme-accent-color: var(--accent-color, 3, 218, 198);
    --theme-accent-variant-color: var(--accent-variant-color, 1, 135, 134);

    --theme-background-color: var(--background-color, 255, 255, 255);
    --theme-surface-color: var(--surface-color, 255, 255, 255);

    --theme-error-color: var(--error-color, 176, 0, 32);

    /*
    Help:
    Material Typography Color System
    #FFFFFFDE -> FFFFFF %87
    #FFFFFF99 -> FFFFFF %60
    #FFFFFF61 -> FFFFFF %38
    */

    --theme-on-primary-color: var(--on-primary-color, 255, 255, 255);
    --theme-on-accent-color: var(--on-accent-color, 0, 0, 0);
    --theme-on-background-color: var(--on-background-color, 0, 0, 0);
    --theme-on-surface-color: var(--on-surface-color, 0, 0, 0);
    --theme-on-error-color: var(--on-error-color, 255, 255, 255);
  }

  .views-container {
    padding: 0 8px 16px;
    position: relative;
  }

  .view {
    width: 100%;
    transition: ease-out 0.25s;
    position: relative;
  }

  [hidden] {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    visibility: hidden;
    transform: translate3d(-25px, 0, 0);
  }

  .calendar-view {
    display: block;
  }

  .calendar-row {
    display: flex;
    padding: 0 8px;
    margin: 6px 0;
  }

  .calendar-row .calendar-day {
    font-weight: 500;
    flex: 1 0 auto;
    position: relative;
  }

  .calendar-row .calendar-day::after {
    content: '';
    float: left;
    display: block;
    padding-top: 100%;
  }

  .calendar-row .calendar-day {
    color: rgba(var(--theme-on-background-color) 0.87);
    cursor: pointer;
    border-radius: 50%;
  }

  .calendar-row .current-date-highlight {
    color: rgb(var(--theme-accent-color));
    background-color: rgba(var(--theme-accent-variant-color), 0.09);
  }

  .calendar-row .selected-day {
    color: rgba(var(--theme-on-primary-color), 0.87);
    background: rgb(var(--theme-primary-color));
  }

  .calendar-row .in-range-day {
    background: rgb(var(--theme-primary-variant-color));
    border-radius: 0;
  }

  .calendar-day-data {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .calendar-row .in-range-day,
  .calendar-day-data[data-range-edge='true'],
  .calendar-day-data[data-start-range-edge] {
    transition: ease-in 0.15s;
  }

  .calendar-row .fade {
    color: rgba(0, 0, 0, 0.38);
  }

  .goto-time-view {
    padding: 10px 0;
    border-top: 2px solid rgba(0, 0, 0, 0.09);
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    fill: rgba(0, 0, 0, 0.6);
  }
`;
