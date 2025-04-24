import { FiberNode } from './fiber';

export function renderWithHooks(wip: FiberNode) {
  const Component = wip.type;
  const props = wip.type;
  const children = Component(props);
  return children;
}
