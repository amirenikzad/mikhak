import { createIcon } from '@chakra-ui/react';

export const ImageFillIcon = createIcon({
  displayName: 'ImageFillIcon',
  viewBox: '0 0 24 24',
  path: (
    <>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
        <path strokeDasharray={72} strokeDashoffset={72} d="M3 14v-9h18v14h-18v-5">
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="72;0"></animate>
        </path>
        <path strokeDasharray={24} strokeDashoffset={24} strokeWidth={1} d="M3 16l4 -3l3 2l6 -5l5 4">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.4s" values="24;0"></animate>
        </path>
      </g>
      <g fill="currentColor" fillOpacity={0}>
        <circle cx={7.5} cy={9.5} r={1.5}>
          <animate fill="freeze" attributeName="fill-opacity" begin="1s" dur="0.2s" values="0;1"></animate>
        </circle>
        <path d="M3 16l4 -3l3 2l6 -5l5 4V19H3Z">
          <animate fill="freeze" attributeName="fill-opacity" begin="1.3s" dur="0.5s" values="0;1"></animate>
        </path>
      </g>
    </>
  ),
});
