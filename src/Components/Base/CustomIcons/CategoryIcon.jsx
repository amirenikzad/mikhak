import { createIcon } from '@chakra-ui/react';

export const CategoryIcon = createIcon({
  displayName: 'CategoryIcon',
  viewBox: '0 0 24 24',
  path: (
    <>
      <path fill="currentColor" d="m12 2l-5.5 9h11z"></path>
      <circle cx={17.5} cy={17.5} r={4.5} fill="currentColor"></circle>
      <path fill="currentColor" d="M3 13.5h8v8H3z"></path>
    </>
  ),
});
