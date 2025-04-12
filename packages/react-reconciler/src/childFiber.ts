import { ElementType } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';

function ChildReconciler(shouldTrackEffects: boolean) {
  return function reconcileChildFibers(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    newChild?: ElementType
  ) {
    //判断fiber类型
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return reconcileSingleElement();
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
    }
  };
}
export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);
