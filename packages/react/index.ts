import currentDispatcher, {
  Dispatcher,
  resolveDispatcher,
} from './src/currentDispatcher';

import { jsxDEV, jsx, isValidElement as isValidElementFn } from './src/jsx';

// 内部数据共享层
export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
  currentDispatcher,
};
export const useState: Dispatcher['useState'] = (initialState) => {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
};
export const version = '0.0.0';
// TODO 根据生产环境调用jsx/jsxDEV
export const createElement = jsx;
export const isValidElement = isValidElementFn;
