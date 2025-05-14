import currentDispatcher, {
  Dispatcher,
  resolveDispatcher,
} from './src/currentDispatcher';

import { jsxDEV } from './src/jsx';

// 内部数据共享层
export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
  currentDispatcher,
};
export const version = '0.0.0';
export const createElement = jsxDEV;
export const useState: Dispatcher['useState'] = (initialState) => {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
};
export default {
  version: '0.0.0',
  createElement: jsxDEV,
};
