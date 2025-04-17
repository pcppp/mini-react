import { appendChildToContainer, Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { HostComponent, HostRoot, HostText } from './workTags';
import { MutationMask, NoFlags, Placement } from './fiberFlags';
let nextEffect: FiberNode | null = null;

/**
 * @description: 在node节点中遍历完成FiberNode中的Mutation (placement/update/delete)
 * @param {FiberNode} finishedWork
 * @return {*}
 */
export const commitMutationEffects = (finishedWork: FiberNode) => {
  nextEffect = finishedWork;
  while (nextEffect !== null) {
    console.log('commitMutationEffects');
    const child: FiberNode | null = nextEffect.child;
    //向下遍历
    if (
      (nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
      child !== null
    ) {
      nextEffect = nextEffect.child;
    } else {
      // nextEffect.flag & MutationMask !== No flags ->真正存在flags的fiberNode
      commitMutationEffectsOnFiber(nextEffect);
      // 向上遍历
      up: while (nextEffect !== null) {
        const sibling: FiberNode | null = nextEffect.sibling;
        if (sibling !== null) {
          nextEffect = sibling;
          break up;
        }
        nextEffect = nextEffect.return;
      }
    }
  }
};
const commitMutationEffectsOnFiber = (finishedWork: FiberNode) => {
  const flags = finishedWork.flags;
  if ((flags & Placement) !== NoFlags) {
    commitPlacement(finishedWork);
    finishedWork.flags &= ~Placement;
  }
};
const commitPlacement = (finishWork: FiberNode) => {
  const hostParent = getHostParent(finishWork);
  if (hostParent !== null)
    appendPlacementNodeIntoContainer(finishWork, hostParent);
};
/**
 * @description: 得到fiber的根node节点
 * @param {FiberNode} fiber
 * @return {*}
 */
function getHostParent(fiber: FiberNode): Container | null {
  let parent = fiber.return;
  while (parent) {
    if (parent.tag === HostRoot) {
      return (parent.stateNode as FiberRootNode).container;
    }
    if (parent.tag === HostComponent) return parent.stateNode as Container;
    parent = parent.return;
  }
  if (__DEV__) {
    console.warn('未找到HostParent');
  }
  return null;
}
function appendPlacementNodeIntoContainer(
  finishedWork: FiberNode,
  hostParent: Container
) {
  if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
    appendChildToContainer(finishedWork.stateNode, hostParent);
    return;
  }
  const child = finishedWork.child;
  if (child !== null) {
    appendPlacementNodeIntoContainer(child, hostParent);
    let sibling = child.sibling;
    while (sibling !== null) {
      appendPlacementNodeIntoContainer(sibling, hostParent);
    }
  }
}
