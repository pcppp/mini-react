import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';
// 不写死hostConfig的路径 -> 其他包都需要这个hostConfig实现

export class FiberNode {
  type: any;
  tag: WorkTag;
  key: Key;
  ref: Ref;
  stateNode: any;

  return: FiberNode | null;
  sibling: FiberNode | null;
  child: FiberNode | null;
  index: number;

  pendingProps: Props;
  memoizedProps: Props | null;
  memoizedState: any;
  alternate: FiberNode | null;
  updateQueue: unknown;
  flags: Flags;
  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    this.tag = tag;
    this.key = key;
    this.stateNode = null; // 指向fiber节点关联的具体实体对象
    this.type = null;

    // 构成树状结构
    this.return = null; //指向父fiberNode
    this.sibling = null; //指向兄弟fiberNode
    this.child = null;
    this.index = 0;

    this.ref = null;

    // 作为工作单元
    this.pendingProps = pendingProps; // 开始工作之前的prop
    this.memoizedProps = null; // 工作之后的prop
    this.memoizedState = null; // 更新之后的state
    // 双缓存机制,允许保留两个版本的fiber树
    // workInProgress <--> current
    this.alternate = null;
    this.updateQueue = null;
    // 检查副作用状态(effect)
    // Placement：表示该节点需要插入到DOM中。
    // Update：表示该节点需要更新（例如属性、状态）。
    // Deletion：表示该节点需要从树中删除。
    // PassiveEffect：表示该节点有被动的副作用（如 useEffect）。
    // NoFlags：表示没有任何操作或副作用。
    this.flags = NoFlags;
  }
}
// 真实的node节点
export class FiberRootNode {
  container: Container; // 指向宿主环境的挂载的节点(这里是DOM_element节点)
  current: FiberNode; // 指向fiber的根节点,是当前正在被显示的Fiber树
  finishedWork: FiberNode | null; // 指向更新完成后的hostRootFiber
  constructor(container: Container, hostRootFiber: FiberNode) {
    this.container = container;
    this.current = hostRootFiber;
    hostRootFiber.stateNode = this;
    this.finishedWork = null;
  }
}
export const createWorkInProgress = (
  current: FiberNode,
  pendingProps: Props
): FiberNode => {
  let workInProgress = current.alternate;
  if (workInProgress === null) {
    // mount
    workInProgress = new FiberNode(current.tag, pendingProps, current.key);
    workInProgress.stateNode = current.stateNode;
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    //update
    workInProgress.pendingProps = pendingProps;
    workInProgress.flags = NoFlags;
  }
  workInProgress.type = current.type;
  workInProgress.updateQueue = current.updateQueue;
  workInProgress.child = current.child;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.memoizedProps = current.memoizedProps;
  return workInProgress;
};
