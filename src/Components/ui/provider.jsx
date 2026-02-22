'use client'

import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ColorModeProvider } from './color-mode';
import { theme } from '../../theme.jsx';
import { MUITheme } from '../../MUITheme.jsx';

export function Provider(props) {
  return (
    <ChakraProvider value={theme}>
      <MUIThemeProvider theme={MUITheme}>
        <ColorModeProvider {...props} />
      </MUIThemeProvider>
    </ChakraProvider>
  )
}
