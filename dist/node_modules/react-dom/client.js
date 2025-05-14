(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react')) :
  typeof define === 'function' && define.amd ? define(['react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.client = factory(global.React));
})(this, (function (React) { 'use strict';

  function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n.default = e;
    return Object.freeze(n);
  }

  var React__namespace = /*#__PURE__*/_interopNamespaceDefault(React);

  const FunctionComponent = 0; //
  const HostRoot = 3; // 挂载的根节点hostRootFiber
  const HostComponent = 5; // <div></div>
  const HostText = 6; // 123

  const NoFlags = 0b0000000;
  //placement 标记是 React 渲染过程中的一种副作用,因为他是插入操作
  const Placement = 0b0000001;
  const Update = 0b0000010;
  const ChildDeletion = 0b0000100;
  const MutationMask = Placement | Update | ChildDeletion; // 判断是否需要执行mutation操作

  // 不写死hostConfig的路径 -> 其他包都需要这个hostConfig实现
  class FiberNode {
      type;
      tag;
      key;
      ref;
      stateNode;
      return;
      sibling;
      child;
      index;
      pendingProps;
      memoizedProps;
      memoizedState;
      alternate;
      updateQueue;
      flags;
      subtreeFlags;
      constructor(tag, pendingProps, key) {
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
          this.subtreeFlags = NoFlags;
      }
  }
  // 真实的node节点
  class FiberRootNode {
      container; // 指向宿主环境的挂载的节点(这里是DOM_element节点)
      current; // 指向fiber的根节点,是当前正在被显示的Fiber树
      finishedWork; // 指向更新完成后的hostRootFiber
      constructor(container, hostRootFiber) {
          this.container = container;
          this.current = hostRootFiber;
          hostRootFiber.stateNode = this;
          this.finishedWork = null;
      }
  }
  const createWorkInProgress = (current, pendingProps) => {
      let workInProgress = current.alternate;
      if (workInProgress === null) {
          // mount
          workInProgress = new FiberNode(current.tag, pendingProps, current.key);
          workInProgress.stateNode = current.stateNode;
          workInProgress.alternate = current;
          current.alternate = workInProgress;
      }
      else {
          //update
          workInProgress.pendingProps = pendingProps;
          workInProgress.flags = NoFlags;
          workInProgress.subtreeFlags = NoFlags;
      }
      workInProgress.type = current.type;
      workInProgress.ref = current.ref;
      workInProgress.updateQueue = current.updateQueue;
      workInProgress.child = current.child;
      workInProgress.memoizedState = current.memoizedState;
      workInProgress.memoizedProps = current.memoizedProps;
      return workInProgress;
  };
  const createFiberFormELement = (element) => {
      let { type, key, props } = element;
      let fiberTag = FunctionComponent;
      if (typeof type === 'string') {
          //typeof <div/>  =>  'div'
          fiberTag = HostComponent;
      }
      else if (typeof type !== 'function' && true) {
          console.warn('未声明的类型', element);
      }
      const fiber = new FiberNode(fiberTag, props, key);
      fiber.type = type;
      return fiber;
  };

  const createUpdate = (action) => {
      return {
          action,
      };
  };
  const createUpdateQueue = () => {
      return {
          shared: {
              pending: null,
          },
          dispatch: null,
      };
  };
  const enqueueUpdate = (updateQueue, update) => {
      updateQueue.shared.pending = update;
  };
  /**
   * @description: 消费update的方法,计算状态最新值
   * @param {*} State
   * @return {*}
   */
  const processUpdateQueue = (baseState, //基础的update
  pendingUpdate) => {
      const result = {
          memoizedState: baseState,
      };
      if (pendingUpdate !== null) {
          const action = pendingUpdate.action;
          if (action instanceof Function) {
              // baseState 1  update (x)->4x
              result.memoizedState = action(baseState);
          }
          else {
              // baseState 1  update 4x
              result.memoizedState = action;
          }
      }
      return result;
  };

  const supportSymbol = typeof Symbol === 'function' && Symbol.for;
  const REACT_ELEMENT_TYPE = supportSymbol ? Symbol.for('react.element') : 0xeac7;

  function ChildReconciler(shouldTrackEffects) {
      /**
       * @description: 通过element创建fiber
       */
      function reconcileSingleElement(returnFiber, currentFiber, element) {
          let fiber = createFiberFormELement(element);
          fiber.return = returnFiber;
          return fiber;
      }
      function reconcileSingleString(returnFiber, currentFiber, content) {
          let fiber = new FiberNode(HostText, { content }, null);
          fiber.return = returnFiber;
          return fiber;
      }
      function placeSingleChild(fiber) {
          if (shouldTrackEffects && fiber.alternate === null) {
              //标记副作用 && 首屏渲染
              fiber.flags = Placement;
          }
          return fiber;
      }
      return function reconcileChildFibers(returnFiber, currentFiber, newChild) {
          //判断fiber类型
          if (typeof newChild === 'object' && newChild !== null) {
              switch (newChild.$$typeof) {
                  case REACT_ELEMENT_TYPE:
                      return placeSingleChild(reconcileSingleElement(returnFiber, currentFiber, newChild));
                  default:
                      {
                          console.warn('未实现的children类型', newChild);
                      }
              }
          }
          if ((typeof newChild === 'string' || typeof newChild === 'number') &&
              newChild !== null) {
              return placeSingleChild(reconcileSingleString(returnFiber, currentFiber, newChild));
          }
          return null;
      };
  }
  const reconcileChildFibers = ChildReconciler(true);
  const mountChildFibers = ChildReconciler(false);

  const internals = React__namespace.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

  const { currentDispatcher } = internals;
  let currentlyRenderFiber = null;
  let workInProgressHook = null;
  function renderWithHooks(wip) {
      currentlyRenderFiber = wip;
      wip.memoizedState = null;
      if (wip.alternate === null) {
          // mount
          currentDispatcher.current = mountDispatcher;
      }
      const Component = wip.type;
      const props = wip.pendingProps;
      const children = Component(props);
      currentlyRenderFiber = null;
      return children;
  }
  const mountDispatcher = {
      useState: mountState,
  };
  /**
   * @description: 生成链式调用的Hooks
   * @return {*}
   */
  function mountState(initialState) {
      const hook = mountWorkInProgressHook(); //
      let memoizedState;
      if (initialState instanceof Function) {
          memoizedState = initialState();
      }
      else {
          memoizedState = initialState;
      }
      const queue = createUpdateQueue();
      hook.updateQueue = queue;
      hook.memoizedState = memoizedState;
      // @ts-ignore
      const dispatch = dispatchSetState.bind(null, currentlyRenderFiber, queue);
      queue.dispatch = dispatch;
      return [memoizedState, dispatch];
  }
  function dispatchSetState(fiber, updateQueue, action) {
      const update = createUpdate(action);
      enqueueUpdate(updateQueue, update);
      scheduleUpdateOnFiber(fiber);
  }
  function mountWorkInProgressHook() {
      const hook = {
          memoizedState: null,
          updateQueue: null,
          next: null,
      };
      if (workInProgressHook === null) {
          if (currentlyRenderFiber === null) {
              throw Error('请在函数中执行hook');
          }
          else {
              workInProgressHook = hook;
              currentlyRenderFiber.memoizedState = workInProgressHook;
          }
      }
      else {
          workInProgressHook.next = hook;
          workInProgressHook = hook;
      }
      return workInProgressHook;
  }

  const beginWork = (wip) => {
      //  比较,再返回子fiberNode -> 递归处理子fiberNode
      switch (wip.tag) {
          case HostRoot:
              return updateHostRoot(wip);
          case HostComponent:
              return updateHostComponent(wip);
          case HostText:
              return null;
          case FunctionComponent:
              return updateFunctionComponent(wip);
          default:
              {
                  console.warn('未实现的类型');
              }
      }
      return null;
  };
  function updateFunctionComponent(wip) {
      const nextChildren = renderWithHooks(wip);
      reconcileChildren(wip, nextChildren);
      return wip.child;
  }
  function updateHostRoot(wip) {
      const baseState = wip.memoizedState; // 对于首屏渲染为null,并且也不需要处理props->根节点更关心应用的全局状态更新
      const updateQueue = wip.updateQueue;
      const pending = updateQueue.shared.pending; // 指向正要处理的update实例
      updateQueue.shared.pending = null;
      const { memoizedState } = processUpdateQueue(baseState, pending);
      wip.memoizedState = memoizedState;
      const nextChildren = wip.memoizedState;
      reconcileChildren(wip, nextChildren); // 比较新旧子树的区别
      return wip.child;
  }
  function updateHostComponent(wip) {
      const nextProps = wip.pendingProps;
      const nextChildren = nextProps.children;
      reconcileChildren(wip, nextChildren);
      return wip.child;
  }
  /**
   * @description: 对比current和wip的区别
   * @param {FiberNode} wip
   * @param {ReactElement} children
   * @return {*}
   */
  function reconcileChildren(wip, children) {
      const current = wip.alternate;
      if (current !== null) {
          //非首屏渲染
          wip.child = reconcileChildFibers(wip, current?.child, children);
      }
      else {
          //首屏渲染(需要渲染大量dom,要进行优化)
          wip.child = mountChildFibers(wip, null, children);
      }
  }

  const createInstance = (type, props) => {
      const element = document.createElement(type);
      return element;
  };
  const appendInitialChild = (parent, child) => {
      parent.appendChild(child);
  };
  const createTextInstance = (content) => {
      return document.createTextNode(content);
  };
  const appendChildToContainer = appendInitialChild;

  let nextEffect = null;
  /**
   * @description: 在node节点中遍历完成FiberNode中的Mutation (placement/update/delete)
   * @param {FiberNode} finishedWork
   * @return {*}
   */
  const commitMutationEffects = (finishedWork) => {
      nextEffect = finishedWork;
      while (nextEffect !== null) {
          const child = nextEffect.child;
          //向下遍历
          if ((nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
              child !== null) {
              nextEffect = child;
          }
          else {
              // nextEffect.flag & MutationMask !== No flags ->真正存在flags的fiberNode
              // 向上遍历
              up: while (nextEffect !== null) {
                  commitMutationEffectsOnFiber(nextEffect);
                  const sibling = nextEffect.sibling;
                  if (sibling !== null) {
                      nextEffect = sibling;
                      break up;
                  }
                  nextEffect = nextEffect.return;
              }
          }
      }
  };
  const commitMutationEffectsOnFiber = (finishedWork) => {
      const flags = finishedWork.flags;
      if ((flags & Placement) !== NoFlags) {
          commitPlacement(finishedWork);
          finishedWork.flags &= ~Placement; // 清除placement标记
      }
  };
  const commitPlacement = (finishedWork) => {
      {
          console.warn('执行Placement操作', finishedWork);
      }
      const hostParent = getHostParent(finishedWork);
      if (hostParent !== null) {
          appendPlacementNodeIntoContainer(finishedWork, hostParent);
      }
  };
  /**
   * @description: 得到fiber的根node节点
   * @param {FiberNode} fiber
   * @return {*}
   */
  function getHostParent(fiber) {
      let parent = fiber.return;
      while (parent) {
          const parentTag = parent.tag;
          if (parentTag === HostRoot) {
              return parent.stateNode.container;
          }
          if (parentTag === HostComponent) {
              return parent.stateNode;
          }
          parent = parent.return;
      }
      {
          console.warn('未找到HostParent');
      }
      return null;
  }
  function appendPlacementNodeIntoContainer(finishedWork, hostParent) {
      if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
          appendChildToContainer(hostParent, finishedWork.stateNode);
          return;
      }
      const child = finishedWork.child;
      if (child !== null) {
          appendPlacementNodeIntoContainer(child, hostParent);
          let sibling = child.sibling;
          while (sibling !== null) {
              appendPlacementNodeIntoContainer(sibling, hostParent);
              sibling = sibling.sibling;
          }
      }
  }

  const completeWork = (wip) => {
      /*
        归是从叶子到根节点的,可以将叶子一步步插入进入父节点,从而构建离屏的dom树
      */
      const newProps = wip.pendingProps;
      const current = wip.alternate;
      // 构建DOM
      switch (wip.tag) {
          case HostComponent:
              if (current !== null && wip.stateNode) ;
              else {
                  // mount
                  // 构建离屏DOM树
                  const instance = createInstance(wip.type);
                  // 在instance下面遍历wip的所有节点,并依次插入
                  appendAllChildren(instance, wip);
                  wip.stateNode = instance;
              }
              bubbleProperties(wip);
              return null;
          case HostText:
              if (current !== null && wip.stateNode) ;
              else {
                  // mount
                  // 构建DOM
                  const instance = createTextInstance(newProps.content);
                  wip.stateNode = instance;
              }
              bubbleProperties(wip);
              return null;
          case HostRoot:
              bubbleProperties(wip);
              return null;
          case FunctionComponent:
              bubbleProperties(wip);
              return null;
          default:
              {
                  console.warn('未处理的completeWork情况', wip);
              }
      }
  };
  /**
   * @description: 构建离屏DOM树!在parent节点中插入wip和他的所有子节点(仅关心真实DOM层次,对于抽象DOM -- Function Component不进行处理)
   * @param {FiberNode} parent
   * @param {FiberNode} wip
   * @return {*}
   */
  function appendAllChildren(parent, wip) {
      let node = wip.child;
      while (node !== null) {
          if (node.tag === HostComponent || node.tag === HostText) {
              //是实际的dom元素
              appendInitialChild(parent, node?.stateNode);
          }
          else if (node.child !== null) {
              //不是实际的dom元素(比如Function Component)
              node.child.return = node;
              node = node.child;
              continue;
          }
          if (node === wip) {
              return;
          }
          while (node.sibling === null) {
              if (node.return === wip || node.return === null) {
                  return;
              }
              node = node?.return;
          }
          node.sibling.return = node.return;
          node = node.sibling;
      }
  }
  /**
   * @description: 利用completeWork向上遍历的特性,将子fiber的flags副作用冒泡到付fiber
   * @param {FiberNode} wip
   * @return {*}
   */
  function bubbleProperties(wip) {
      let subtreeFlags = NoFlags;
      let child = wip.child;
      while (child !== null) {
          subtreeFlags |= child.subtreeFlags;
          subtreeFlags |= child.flags;
          child.return = wip;
          child = child.sibling;
      }
      wip.subtreeFlags |= subtreeFlags;
  }

  let workInProgress = null; // 正在更新中的FiberNode,更新完成后会取代当前的currentFiberNode
  /*
    对每个FiberNode进行深度优先遍历,并且保证刚到达节点时进行beginWork - 比较reactNode和FiberNode
    离开节点时进行 completeWork ,保证先确定完子节点,再确定父节点的行动
  */
  function prepareFreshStack(root) {
      workInProgress = createWorkInProgress(root.current, {});
  }
  /**
   * @description: 在触发更新的fiber调度update
   *              1.向上遍历到FiberRootNode
   *              2.遍历FiberRootNode的所有节点
   * @param {type} params
   * @return {*}
   */
  function scheduleUpdateOnFiber(fiber) {
      let root = markUpdateFromFiberToRoot(fiber);
      renderRoot(root);
  }
  /**
   * @description: 从当前触发更新的fiber向上遍历到fiberRootNode
   * @param {FiberNode} fiber
   * @return {*}
   */
  function markUpdateFromFiberToRoot(fiber) {
      let node = fiber;
      let parent = node.return;
      while (parent !== null) {
          node = parent;
          parent = node.return;
      }
      //HostRoot的stateNode会指向fiberRootNode实例
      if (node.tag === HostRoot)
          return node.stateNode;
      return null;
  }
  /**
   * @description: 更新：从根节点开始向下递归地构建新的 Fiber 树
   * @param {FiberRootNode} root
   * @return {*}
   */
  function renderRoot(root) {
      //初始化
      prepareFreshStack(root);
      // while->确保 workLoop() 函数能够在出现错误时重新执行
      while (true) {
          try {
              workLoop();
              break;
          }
          catch (error) {
              {
                  console.warn('workLoop错误', error);
              }
              workInProgress = null;
          }
      }
      const finishedWork = root.current.alternate;
      root.finishedWork = finishedWork;
      commitRoot(root);
  }
  function commitRoot(root) {
      const finishedWork = root.finishedWork;
      if (finishedWork === null) {
          return;
      }
      // 重置
      root.finishedWork = null;
      {
          console.warn('commit阶段开始', finishedWork);
      }
      // 判断3个子阶段需要执行的操作
      const subtreeHasEffect = (finishedWork.subtreeFlags & MutationMask) !== NoFlags;
      const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;
      if (subtreeHasEffect || rootHasEffect) {
          // beforeMutation
          // mutation
          commitMutationEffects(finishedWork);
          root.current = finishedWork;
          // layout
      }
      else {
          root.current = finishedWork;
      }
  }
  function workLoop() {
      while (workInProgress != null) {
          performUnitOfWork(workInProgress);
      }
  }
  function performUnitOfWork(fiber) {
      const next = beginWork(fiber);
      fiber.memoizedProps = fiber.pendingProps;
      if (next !== null) {
          workInProgress = next;
      }
      else {
          completeUnitOfWork(fiber);
      }
  }
  function completeUnitOfWork(fiber) {
      let node = fiber;
      while (node !== null) {
          completeWork(node);
          if (node.sibling !== null) {
              workInProgress = node.sibling;
              return;
          }
          else {
              node = node.return;
              workInProgress = node;
          }
      }
  }

  /**
   * @description: 执行createReactRoot时调用,创建整个应用的根结点
   *               并将fiberRootNode和hostRootFiber连接
   * @param {Container} Container
   * @return {*}
   */
  function createContainer(Container) {
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
  function updateContainer(element, root) {
      const hostRootFiber = root.current;
      const update = createUpdate(element);
      enqueueUpdate(hostRootFiber.updateQueue, update);
      scheduleUpdateOnFiber(hostRootFiber);
      return element;
  }

  function createRoot(container) {
      const root = createContainer(container);
      return {
          render(element) {
              updateContainer(element, root);
          },
      };
  }

  var ReactDom = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createRoot: createRoot
  });

  return ReactDom;

}));
