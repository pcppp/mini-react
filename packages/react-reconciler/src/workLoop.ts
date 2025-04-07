import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode } from './fiber';

let workInProgress: FiberNode | null = null; // 工作的FiberNode
/*
  对每个FiberNode进行深度优先遍历,并且保证刚到达节点时进行beginWork - 比较reactNode和FiberNode
  离开节点时进行 completeWork ,保证先确定完子节点,再确定父节点的行动
*/
function prepareFreshStack(fiber: FiberNode) {
  workInProgress = fiber;
}
function renderRoot(root: FiberNode) {
  //初始化
  prepareFreshStack(root);
  // while->确保 workLoop() 函数能够在出现错误时重新执行
  while (true) {
    try {
      workLoop();
      break;
    } catch (error) {
      console.warn('workLoop错误', error);
      workInProgress = null;
    }
  }
}
function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}
function performUnitOfWork(fiber: FiberNode) {
  const next: FiberNode = beginWork(fiber);
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
    completeWork(node);
    const sibling = fiber.sibling;
    if (sibling) {
      workInProgress = sibling;
      return;
    } else {
      node = node.return;
      workInProgress = node;
    }
  }
}
