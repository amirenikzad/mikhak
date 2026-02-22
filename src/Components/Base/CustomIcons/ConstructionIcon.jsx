import { createIcon } from '@chakra-ui/react';

export const ConstructionIcon = createIcon({
  displayName: 'ConstructionIcon',
  viewBox: '0 0 24 24',
  path: (
    <>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
        <rect width={20} height={8} x={2} y={6} rx={1}></rect>
        <path d="M17 14v7M7 14v7M17 3v3M7 3v3m3 8L2.3 6.3M14 6l7.7 7.7M8 6l8 8"></path>
      </g>
    </>
  ),
});
