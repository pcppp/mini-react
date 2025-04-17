import { ElementType } from 'shared/ReactTypes';
import { FiberNode, FiberRootNode } from './fiber';
import { Container } from 'hostConfig';
import {
  createUpdateQueue,
  createUpdate,
  enqueueUpdate,
  UpdateQueue,
} from './updateQueue';
import { HostRoot } from './workTags';
import { scheduleUpdateOnFiber } from './workLoop';
/**
 * @description: 执行createReactRoot时调用,创建整个应用的根结点
 *               并将fiberRootNode和hostRootFiber连接
 * @param {Container} Container
 * @return {*}
 */
export function createContainer(Container: Container) {
  const hostRootFiber = new FiberNode(HostRoot, {}, null);
  const root = new FiberRootNode(Container, hostRootFiber);
  hostRootFiber.updateQueue = createUpdateQueue();
  return root;
}

/**
 * @description: 执行.render()时调用,会创建update
 * @param {ElementType} element
 * @param {FiberRootNode} root
 * @return {*}
 */
export function updateContainer(
  element: ElementType | null,
  root: FiberRootNode
) {
  const hostRootFiber = root.current;
  const update = createUpdate<ElementType | null>(element);
  enqueueUpdate(
    hostRootFiber.updateQueue as UpdateQueue<ElementType | null>,
    update
  );
  scheduleUpdateOnFiber(hostRootFiber);
  return element;
}
