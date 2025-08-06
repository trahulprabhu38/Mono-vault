import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
};

const colors = {
  primary: {
    50: '#F3F1FF',
    100: '#E0DBFF',
    200: '#C4B7FF',
    300: '#A593FF',
    400: '#8B7AFF',
    500: '#6B46C1',
    600: '#553C9A',
    700: '#44337A',
    800: '#322659',
    900: '#1E1B3C',
  },
  secondary: {
    50: '#EBF8FF',
    100: '#BEE3F8',
    200: '#90CDF4',
    300: '#63B3ED',
    400: '#4299E1',
    500: '#3182CE',
    600: '#2B77CB',
    700: '#2C5AA0',
    800: '#2A4365',
    900: '#1A365D',
  },
  accent: {
    50: '#E6FFFA',
    100: '#B2F5EA',
    200: '#81E6D9',
    300: '#4FD1C7',
    400: '#38B2AC',
    500: '#319795',
    600: '#2C7A7B',
    700: '#285E61',
    800: '#234E52',
    900: '#1D4044',
  },
};

const styles = {
  global: (props: any) => ({
    body: {
      bg: mode('gray.50', 'gray.900')(props),
    },
  }),
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: 600,
      borderRadius: 'xl',
    },
    variants: {
      gradient: {
        bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: 'xl',
        },
        _active: {
          transform: 'translateY(0)',
        },
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: '2xl',
        backdropFilter: 'blur(10px)',
        bg: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      },
    },
  },
};

const theme = extendTheme({
  config,
  colors,
  styles,
  components,
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
});

export default theme;