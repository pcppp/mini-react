import { Action } from 'shared/ReactTypes';

export interface Dispatcher {
  useState: <T>(initialState: T | (() => T)) => [T, Dispatch<T>];
}
export type Dispatch<T> = (action: Action<T>) => void;
const currentDispatcher: { current: Dispatcher | null } = {
  current: null,
};
export function resolveDispatcher(): Dispatcher {
  const dispatcher = currentDispatcher.current;
  if (dispatcher === null) {
    throw new Error('未存在的dispatcher');
  }
  return dispatcher;
}
export default currentDispatcher;
