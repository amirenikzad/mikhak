'use client'

import { ClientOnly, IconButton, Skeleton, Span } from '@chakra-ui/react';
import { ThemeProvider, useTheme } from 'next-themes';
import * as React from 'react';
import { useColorScheme } from '@mui/material';
import { MoonIcon } from '../Base/CustomIcons/MoonIcon.jsx';
import { SunIcon } from '../Base/CustomIcons/SunIcon.jsx';

export function ColorModeProvider(props) {
  return (
    <ThemeProvider attribute='class' disableTransitionOnChange {...props} />
  )
}

export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme()
  const toggleColorMode = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }
  return {
    colorMode: resolvedTheme,
    setColorMode: setTheme,
    toggleColorMode,
  }
}

export function useColorModeValue(light, dark) {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? dark : light
}

export function ColorModeIcon({ moonColor = 'white', sunColor = 'white' }) {
  const { colorMode } = useColorMode();
  return colorMode === 'dark'
    ? <MoonIcon color={moonColor} width={'1rem'} />
    : <SunIcon color={sunColor} width={'1rem'} />;
}

export const ColorModeButton = React.forwardRef(
  function ColorModeButton(props, ref) {
    const { setColorMode, colorMode } = useColorMode();
    const { setMode } = useColorScheme();

    return (
      <ClientOnly fallback={<Skeleton boxSize="8" />}>
        <IconButton variant="ghost"
                    aria-label="Toggle color mode"
                    size="sm"
                    ref={ref}
                    _hover={{
                      backgroundColor: props.hoverBackgroundColor ? props.hoverBackgroundColor : 'gray.800',
                    }}
                    {...props}
                    css={{
                      _icon: {
                        width: '5',
                        height: '5',
                      },
                    }}
                    onClick={() => {
                      if (colorMode === 'dark') {
                        setMode('light');
                        setColorMode('light');
                      } else {
                        setMode('dark');
                        setColorMode('dark');
                      }
                    }}>
          <ColorModeIcon moonColor={props.moonColor ? props.moonColor : 'white'}
                         sunColor={props.sunColor ? props.sunColor : 'white'} />
        </IconButton>
      </ClientOnly>
    )
  },
)

export const LightMode = React.forwardRef(function LightMode(props, ref) {
  return (
    <Span
      color='fg'
      display='contents'
      className='chakra-theme light'
      colorPalette='gray'
      colorScheme='light'
      ref={ref}
      {...props}
    />
  )
})

export const DarkMode = React.forwardRef(function DarkMode(props, ref) {
  return (
    <Span
      color='fg'
      display='contents'
      className='chakra-theme dark'
      colorPalette='gray'
      colorScheme='dark'
      ref={ref}
      {...props}
    />
  )
})
