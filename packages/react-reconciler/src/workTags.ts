export type WorkTag =
  | typeof FunctionComponent
  | typeof HostRoot
  | typeof HostText
  | typeof HostComponent;
export const FunctionComponent = 0; //
export const HostRoot = 3; // 挂载的根节点hostRootFiber
export const HostComponent = 5; // <div></div>
export const HostText = 6; // 123
