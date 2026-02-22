import { createIcon } from '@chakra-ui/react';

export const CircularCheckIcon = createIcon({
  displayName: 'CircularCheckIcon',
  viewBox: '0 0 24 24',
  path: (
    <>
      <g fill="currentColor">
        <path d="M10.243 16.314L6 12.07l1.414-1.414l2.829 2.828l5.656-5.657l1.415 1.415z"></path>
        <path fillRule="evenodd"
              d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12m11 9a9 9 0 1 1 0-18a9 9 0 0 1 0 18"
              clipRule="evenodd"></path>
      </g>
    </>
  ),
});
