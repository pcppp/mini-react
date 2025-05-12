import { Dispatch, Dispatcher } from './../../react/src/currentDispatcher';
import { FiberNode } from './fiber';
import internals from 'shared/internals';
import {
  createUpdate,
  createUpdateQueue,
  enqueueUpdate,
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
export function renderWithHooks(wip: FiberNode) {
  currentlyRenderFiber = wip;
  wip.memoizedState = null;
  if (wip.alternate === null) {
    // mount
    currentDispatcher.current = mountDispatcher;
  } else {
  }
  const Component = wip.type;
  const props = wip.pendingProps;
  const children = Component(props);

  currentlyRenderFiber = null;
  return children;
}

const mountDispatcher: Dispatcher = {
  useState: mountState,
};
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
