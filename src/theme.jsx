import { TURQUOISE_BUTTON_COLOR } from './Components/Base/BaseColor.jsx';
import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const customConfig = defineConfig({
  globalCss: {
    '*': {
      fontFamily: `'shabnam', sans-serif`,
    },
    '::-webkit-scrollbar': {
      width: '5px',
      height: '5px',
    },
    '::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 1px',
      borderRadius: '0',
    },
    '::-webkit-scrollbar-thumb': {
      background: TURQUOISE_BUTTON_COLOR,
      borderRadius: '0',
      cursor: 'pointer',
    },
    '::-webkit-scrollbar-thumb:hover': {
      background: TURQUOISE_BUTTON_COLOR,
    },
  },
});

export const theme = createSystem(defaultConfig, customConfig);
