// reactDom.createRoot(root).render(<app>) root为挂载节点
import { Container } from 'hostConfig';
import {
  createContainer,
  updateContainer,
} from 'react-reconciler/src/fiberReconciler';
import { ReactElement } from 'shared/ReactTypes';
import { initEvent } from './SyntheticEvent';
export function createRoot(container: Container) {
  const root = createContainer(container);
  return {
    render(element: ReactElement) {
      initEvent(container, 'click');
      return updateContainer(element, root);
    },
  };
}
