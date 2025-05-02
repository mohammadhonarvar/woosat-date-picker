import { css } from 'lit';

// This is the base dimensions(for example, if we need it)
export const appConfig = {
  // UI
  maxWith: 768, //px
  mainImageHeight: 430, //px
  mainImageMargin: 60, //px
  iconSize: 24, //px
  iconButtonSize: 56, //px
};

// This is the base theme & shared styles(for example)
export const styleConfig = css`
  :host {
    --theme-primary-color: #512da8;
    --dark-primary-color: #b39ddb;
    --theme-accent-color: #9fa8da;
    --dark-accent-color: #e91e63;

    --primary-text-color: rgba(0, 0, 0, 0.87);
    --dark-primary-text-color: rgba(255, 255, 255, 0.87);

    --theme-background-color: #ffffff;
    --dark-background-color: #121212;

    --font-family: 'Iran Sans', 'Open Sans', 'Tahoma', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
      'Segoe UI Symbol';

    --icon-size: ${appConfig.iconSize}px;
    --icon-button-size: ${appConfig.iconButtonSize}px;
  }
`;
