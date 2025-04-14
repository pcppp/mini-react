import { ElementType } from 'shared/ReactTypes';
import { createFiberFormELement, FiberNode } from './fiber';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { HostText } from './workTags';
import { Placement } from './fiberFlags';

function ChildReconciler(shouldTrackEffects: boolean) {
  /**
   * @description: 通过element创建fiber
   */
  function reconcileSingleElement(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    element: ElementType
  ) {
    let fiber = createFiberFormELement(element);
    fiber.return = returnFiber;
    return fiber;
  }
  function reconcileSingleString(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    content: String | number
  ) {
    let fiber = new FiberNode(HostText, { content }, null);
    fiber.return = returnFiber;
    return fiber;
  }
  function placeSingleChild(fiber: FiberNode) {
    if (shouldTrackEffects && fiber.alternate === null) {
      //标记副作用 && 首屏渲染
      fiber.flags = Placement;
    }
    return fiber;
  }
  return function reconcileChildFibers(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    newChild?: ElementType
  ) {
    //判断fiber类型
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFiber, newChild)
          );
        default:
          if (__DEV__) {
            console.warn('未实现的children类型', newChild);
          }
      }
    }
    if (
      (typeof newChild === 'string' || typeof newChild === 'number') &&
      newChild !== null
    ) {
      return placeSingleChild(
        reconcileSingleString(returnFiber, currentFiber, newChild)
      );
    }
  };
}
export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);
