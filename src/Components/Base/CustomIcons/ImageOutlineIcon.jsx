import { createIcon } from '@chakra-ui/react';

export const ImageOutlineIcon = createIcon({
  displayName: 'ImageOutlineIcon',
  viewBox: '0 0 512 512',
  path: (
    <>
      <rect width={416} height={352} x={48} y={80} fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth={32} rx={48} ry={48}></rect>
      <circle cx={336} cy={176} r={32} fill="none" stroke="currentColor" strokeMiterlimit={10} strokeWidth={32}></circle>
      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="m304 335.79l-90.66-90.49a32 32 0 0 0-43.87-1.3L48 352m176 80l123.34-123.34a32 32 0 0 1 43.11-2L464 368"></path>
    </>
  ),
});
