import { Global } from '@emotion/react';
import shabnam_bold from './assets/fonts/Shabnam-Bold-FD.woff';
import shabnam_regular from './assets/fonts/Shabnam-FD.woff';
import shabnam_light from './assets/fonts/Shabnam-Light-FD.woff';
import shabnam_medium from './assets/fonts/Shabnam-Medium-FD.woff';
import shabnam_thin from './assets/fonts/Shabnam-Thin-FD.woff';

export const Fonts = () => (
  <Global
    styles={`
      @font-face {
        font-family: 'shabnam';
        font-style: normal;
        font-weight: 100;
        src: url(${shabnam_thin}) format('woff');
        font-display: swap;
      }
      @font-face {
        font-family: 'shabnam';
        font-style: normal;
        font-weight: 300;
        src: url(${shabnam_light}) format('woff');
        font-display: swap;
      }
      @font-face {
        font-family: 'shabnam';
        font-style: normal;
        font-weight: 400;
        src: url(${shabnam_regular}) format('woff');
        font-display: swap;
      }
      @font-face {
        font-family: 'shabnam';
        font-style: normal;
        font-weight: 500;
        src: url(${shabnam_medium}) format('woff');
        font-display: swap;
      }
      @font-face {
        font-family: 'shabnam';
        font-style: normal;
        font-weight: 700;
        src: url(${shabnam_bold}) format('woff');
        font-display: swap;
      }
      `}
  />
);
