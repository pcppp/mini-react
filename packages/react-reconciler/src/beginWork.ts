import { processUpdateQueue, UpdateQueue } from './updateQueue';
import { FiberNode } from './fiber';
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from './workTags';
import { ReactElement } from 'shared/ReactTypes';
import { mountChildFibers, reconcileChildFibers } from './childFiber';
import { renderWithHooks } from './fiberHooks';

export const beginWork = (wip: FiberNode) => {
  //  比较,再返回子fiberNode -> 递归处理子fiberNode
  switch (wip.tag) {
    case HostRoot:
      return updateHostRoot(wip);
    case HostComponent:
      return updateHostComponent(wip);
    case HostText:
      return null;
    case FunctionComponent:
      return updateFunctionComponent(wip);
    default:
      if (__DEV__) {
        console.warn('未实现的类型');
      }
  }
  return null;
};
function updateFunctionComponent(wip: FiberNode) {
  const nextChildren = renderWithHooks(wip);
  reconcileChildren(wip, nextChildren);
  return wip.child;
}
function updateHostRoot(wip: FiberNode) {
  const baseState = wip.memoizedState; // 对于首屏渲染为null,并且也不需要处理props->根节点更关心应用的全局状态更新
  const updateQueue = wip.updateQueue as UpdateQueue<Element>;
  const pending = updateQueue.shared.pending; // 指向正要处理的update实例
  updateQueue.shared.pending = null;
  const { memoizedState } = processUpdateQueue(baseState, pending);
  wip.memoizedState = memoizedState;

  const nextChildren = wip.memoizedState;
  reconcileChildren(wip, nextChildren); // 比较新旧子树的区别
  return wip.child;
}

function updateHostComponent(wip: FiberNode) {
  const nextProps = wip.pendingProps;
  const nextChildren = nextProps.children;
  reconcileChildren(wip, nextChildren);
  return wip.child;
}
/**
 * @description: 对比current和wip的区别
 * @param {FiberNode} wip
 * @param {ReactElement} children
 * @return {*}
 */
function reconcileChildren(wip: FiberNode, children?: ReactElement) {
  const current = wip.alternate;
  if (current !== null) {
    //非首屏渲染
    wip.child = reconcileChildFibers(wip, current?.child, children);
  } else {
    //首屏渲染(需要渲染大量dom,要进行优化)
    wip.child = mountChildFibers(wip, null, children);
  }
}
