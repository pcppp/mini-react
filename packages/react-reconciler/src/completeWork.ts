import {
  appendInitialChild,
  Container,
  createInstance,
  createTextInstance,
  Instance,
} from 'hostConfig';
import { FiberNode } from './fiber';
import { HostComponent, HostRoot, HostText } from './workTags';
import { NoFlags } from './fiberFlags';

export const completeWork = (wip: FiberNode) => {
  /*
    归是从叶子到根节点的,可以将叶子一步步插入进入父节点,从而构建离屏的dom树
  */
  const newProps = wip.pendingProps;
  const current = wip.alternate;
  // 构建DOM
  switch (wip.tag) {
    case HostComponent:
      if (current !== null && wip.stateNode) {
        // update
      } else {
        // mount
        // 构建DOM
        const instance = createInstance(wip.type, newProps);
        // 在instance下面遍历wip的所有节点,并依次插入
        appendAllChildren(instance, wip);
        wip.stateNode = instance;
      }
      bubbleProperties(wip);
      return null;
    case HostText:
      if (current !== null && wip.stateNode) {
        // update
      } else {
        // mount
        // 构建DOM
        const instance = createTextInstance(newProps.content);
        wip.stateNode = instance;
      }
      bubbleProperties(wip);
      return null;
    case HostRoot:
      bubbleProperties(wip);
      return null;
    default:
      if (__DEV__) {
        console.warn('未处理的completeWork情况', wip);
      }
  }
};
/**
 * @description: 在parent节点中插入wip和他的所有子节点(仅关心真实DOM层次,对于抽象DOM -- Function Component不进行处理)
 * @param {FiberNode} parent
 * @param {FiberNode} wip
 * @return {*}
 */
function appendAllChildren(parent: Container | Instance, wip: FiberNode) {
  let node = wip.child;
  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      //是实际的dom元素
      appendInitialChild(parent, node?.stateNode);
    } else if (node.child !== null) {
      //不是实际的dom元素(比如Function Component)
      node.child.return = node;
      node = node.child;
      continue;
    }
    if (node === wip) {
      return;
    }
    while (node.sibling === null) {
      if (node.return === wip || node.return === null) {
        return;
      }
      node = node?.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
}
/**
 * @description: 利用completeWork向上遍历的特性,将子fiber的flags副作用冒泡到付fiber
 * @param {FiberNode} wip
 * @return {*}
 */
function bubbleProperties(wip: FiberNode) {
  let subtreeFlags = NoFlags;
  let child = wip.child;
  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;
    child.return = wip;
    child = child.sibling;
  }
  wip.subtreeFlags |= subtreeFlags;
}
