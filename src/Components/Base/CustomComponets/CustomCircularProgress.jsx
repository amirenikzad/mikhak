import CircularProgress from '@mui/material/CircularProgress';
import { useColorMode } from '../../ui/color-mode.jsx';
import { memo } from 'react';

export const CustomCircularProgress = memo(function({ size = '0.6rem', ...props }) {
  const { colorMode } = useColorMode();

  return <CircularProgress size={size} style={{ 'color': colorMode === 'light' ? 'blue' : 'white' }} {...props} />;
});
