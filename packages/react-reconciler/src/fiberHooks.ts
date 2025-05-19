import { Dispatch, Dispatcher } from './../../react/src/currentDispatcher';
import { FiberNode } from './fiber';
import internals from 'shared/internals';
import {
  createUpdate,
  createUpdateQueue,
  enqueueUpdate,
  processUpdateQueue,
  UpdateQueue,
} from './updateQueue';
import { Action } from 'shared/ReactTypes';
import { scheduleUpdateOnFiber } from './workLoop';
interface Hook {
  memoizedState: any; // 不同于fiber的memo
  next: Hook | null;
  updateQueue: unknown;
}
const { currentDispatcher } = internals;
let currentlyRenderFiber: FiberNode | null = null;
let workInProgressHook: Hook | null = null;
let currentHook: Hook | null = null;
export function renderWithHooks(wip: FiberNode) {
  currentlyRenderFiber = wip;
  wip.memoizedState = null;
  if (wip.alternate === null) {
    // mount
    currentDispatcher.current = mountDispatcher;
  } else {
    // update
    currentDispatcher.current = updateDispatcher;
  }
  const Component = wip.type;
  const props = wip.pendingProps;
  // 执行func中的hook
  const children = Component(props);
  //  重置
  workInProgressHook = null;
  currentHook = null;
  currentlyRenderFiber = null;
  return children;
}

const mountDispatcher: Dispatcher = {
  useState: mountState,
};
const updateDispatcher: Dispatcher = {
  useState: updateState,
};

/**
 * @description: 生成链式调用的Hooks
 * @return {*}
 */
function updateState<State>(): [State, Dispatch<State>] {
  // 状态隔离
  const hook = updateWorkInProgressHook();
  // 计算新的state的逻辑
  const queue = hook.updateQueue as UpdateQueue<State>;
  const pending = queue.shared.pending;

  if (pending !== null) {
    const { memoizedState } = processUpdateQueue(hook.memoizedState, pending);
    hook.memoizedState = memoizedState;
  }
  return [hook.memoizedState, queue.dispatch as Dispatch<State>];
}
function updateWorkInProgressHook(): Hook {
  // current树的Hook
  let nextCurrentHook: Hook | null;
  // TODO 处理render阶段触发的更新

  //  处理交互阶段触发的更新
  if (currentHook === null) {
    // 第一个次调用useState
    const current = currentlyRenderFiber?.alternate;
    if (current !== null) {
      nextCurrentHook = current?.memoizedState;
    } else {
      nextCurrentHook = null;
    }
  } else {
    nextCurrentHook = currentHook.next;
  }
  if (nextCurrentHook === null) {
    if (__DEV__) {
      console.warn('hook的个数发生变化');
    }
  }
  currentHook = nextCurrentHook as Hook;
  const newHook: Hook = {
    memoizedState: nextCurrentHook?.memoizedState,
    updateQueue: nextCurrentHook?.updateQueue,
    next: null,
  };
  if (workInProgressHook === null) {
    if (currentlyRenderFiber !== null) {
      workInProgressHook = newHook;
      currentlyRenderFiber.memoizedState = workInProgressHook;
    } else {
      throw new Error('请在函数组件内调用hook');
    }
  } else {
    workInProgressHook.next = newHook;
    workInProgressHook = workInProgressHook.next;
  }
  return workInProgressHook;
}
/**
 * @description: 生成链式调用的Hooks
 * @return {*}
 */
function mountState<State>(
  initialState: State | (() => State)
): [State, Dispatch<State>] {
  const hook = mountWorkInProgressHook(); //
  let memoizedState;
  if (initialState instanceof Function) {
    memoizedState = initialState();
  } else {
    memoizedState = initialState;
  }
  const queue = createUpdateQueue<State>();
  hook.updateQueue = queue;
  hook.memoizedState = memoizedState;
  // @ts-ignore
  const dispatch = dispatchSetState.bind(null, currentlyRenderFiber, queue);
  queue.dispatch = dispatch;
  return [memoizedState, dispatch];
}
function dispatchSetState<State>(
  fiber: FiberNode,
  updateQueue: UpdateQueue<State>,
  action: Action<State>
) {
  const update = createUpdate(action);
  enqueueUpdate(updateQueue, update);
  scheduleUpdateOnFiber(fiber);
}
function mountWorkInProgressHook(): Hook {
  const hook: Hook = {
    memoizedState: null,
    updateQueue: null,
    next: null,
  };
  if (workInProgressHook === null) {
    if (currentlyRenderFiber === null) {
      throw Error('请在函数中执行hook');
    } else {
      workInProgressHook = hook;
      currentlyRenderFiber.memoizedState = workInProgressHook;
    }
  } else {
    workInProgressHook.next = hook;
    workInProgressHook = hook;
  }
  return workInProgressHook;
}
