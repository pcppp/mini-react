import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';

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
  alternate: FiberNode | null;
  flags: Flags;
  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    this.tag = tag;
    this.key = key;
    this.stateNode = null;
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
    this.alternate = null;
    // 副作用
    this.flags = NoFlags;
  }
}
