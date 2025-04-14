export type Flags = number;
export const NoFlags = 0b0000001;
//placement 标记是 React 渲染过程中的一种副作用,因为他是插入操作
export const Placement = 0b0000010;
export const Update = 0b0000100;
export const ChildDeletion = 0b0001000;

export const MutationMask = Placement | Update | ChildDeletion; // 判断是否需要执行mutation操作
