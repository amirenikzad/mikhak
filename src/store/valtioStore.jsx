import { proxy } from 'valtio';

export const streamValtio = proxy({
  result: Array(5).fill(null),
  index_value: 0,
});
