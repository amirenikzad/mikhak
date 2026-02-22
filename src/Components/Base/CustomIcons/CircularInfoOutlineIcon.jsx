import { createIcon } from '@chakra-ui/react';

export const CircularInfoOutlineIcon = createIcon({
  displayName: 'CircularInfoOutlineIcon',
  viewBox: '0 0 24 24',
  path: (
    <>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
        <path d="M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0"></path>
        <path d="M12 16v-5h-.5m0 5h1M12 8.5V8"></path>
      </g>
    </>
  ),
});
