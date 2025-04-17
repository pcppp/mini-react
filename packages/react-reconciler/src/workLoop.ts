import { beginWork } from './beginWork';
import { commitMutationEffects } from './commitWork';
import { completeWork } from './completeWork';
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber';
import { MutationMask, NoFlags } from './fiberFlags';
import { HostRoot } from './workTags';

let workInProgress: FiberNode | null = null; // 正在更新中的FiberNode,更新完成后会取代当前的currentFiberNode
/*
  对每个FiberNode进行深度优先遍历,并且保证刚到达节点时进行beginWork - 比较reactNode和FiberNode
  离开节点时进行 completeWork ,保证先确定完子节点,再确定父节点的行动
*/
function prepareFreshStack(root: FiberRootNode) {
  workInProgress = createWorkInProgress(root.current, {});
}
/**
 * @description: 在触发更新的fiber调度update
 *              1.向上遍历到FiberRootNode
 *              2.遍历FiberRootNode的所有节点
 * @param {type} params
 * @return {*}
 */
export function scheduleUpdateOnFiber(fiber: FiberNode) {
  let root = markUpdateFromFiberToRoot(fiber);
  renderRoot(root);
}

/**
 * @description: 从当前触发更新的fiber向上遍历到fiberRootNode
 * @param {FiberNode} fiber
 * @return {*}
 */
function markUpdateFromFiberToRoot(fiber: FiberNode) {
  let node = fiber;
  let parent = node.return;
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }
  //HostRoot的stateNode会只想fiberRootNode实例
  if (node.tag === HostRoot) return node.stateNode;
  return null;
}
/**
 * @description: 更新：从根节点开始向下递归地构建新的 Fiber 树
 * @param {FiberRootNode} root
 * @return {*}
 */
function renderRoot(root: FiberRootNode) {
  //初始化
  prepareFreshStack(root);
  // while->确保 workLoop() 函数能够在出现错误时重新执行
  while (true) {
    try {
      workLoop();
      break;
    } catch (error) {
      if (__DEV__) {
        console.warn('workLoop错误', error);
      }
      workInProgress = null;
    }
  }
  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;
  commitRoot(root);
}
function commitRoot(root: FiberRootNode) {
  const finishedWork = root.finishedWork;
  if (finishedWork === null) {
    return;
  }
  // 重置
  root.finishedWork = null;
  if (__DEV__) {
    console.warn('commit阶段开始', finishedWork);
  }
  // 判断3个子阶段需要执行的操作
  const subtreeHasEffect =
    (finishedWork.subtreeFlags & MutationMask) !== NoFlags;
  const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;
  if (subtreeHasEffect || rootHasEffect) {
    // beforeMutation
    // mutation
    commitMutationEffects(finishedWork);
    root.current = finishedWork;
    // layout
  } else {
    root.current = finishedWork;
  }
}
function workLoop() {
  while (workInProgress != null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(fiber: FiberNode) {
  const next: FiberNode | null = beginWork(fiber);
  fiber.memoizedProps = fiber.pendingProps;

  if (next !== null) {
    workInProgress = next;
  } else {
    completeUnitOfWork(fiber);
  }
}
function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber;
  while (node !== null) {
    console.log('completeUnitOfWork--ERROR--');

    completeWork(node);
    if (node.sibling !== null) {
      workInProgress = node.sibling;
      return;
    } else {
      node = node.return;
    }
  }
}
