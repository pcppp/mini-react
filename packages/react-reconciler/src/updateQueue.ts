import { Dispatch } from './../../react/src/currentDispatcher';
import { Action } from './../../shared/ReactTypes';

export interface Update<State> {
  action: Action<State>;
}
export interface UpdateQueue<State> {
  shared: {
    pending: Update<State> | null; // 指向正在处理的update实例
  };
  dispatch: Dispatch<State> | null;
}
export const createUpdate = <State>(action: Action<State>) => {
  return {
    action,
  };
};

export const createUpdateQueue = <State>() => {
  return {
    shared: {
      pending: null,
    },
    dispatch: null,
  } as UpdateQueue<State>;
};
export const enqueueUpdate = <State>(
  updateQueue: UpdateQueue<State>,
  update: Update<State>
) => {
  updateQueue.shared.pending = update;
};
/**
 * @description: 消费update的方法,计算状态最新值
 * @param {*} State
 * @return {*}
 */
export const processUpdateQueue = <State>(
  baseState: State, //基础的update
  pendingUpdate: Update<State> | null
): { memoizedState: State } => {
  const result: ReturnType<typeof processUpdateQueue<State>> = {
    memoizedState: baseState,
  };
  if (pendingUpdate !== null) {
    const action = pendingUpdate.action;
    if (action instanceof Function) {
      // baseState 1  update (x)->4x
      result.memoizedState = action(baseState);
    } else {
      // baseState 1  update 4x
      result.memoizedState = action;
    }
  }
  return result;
};
