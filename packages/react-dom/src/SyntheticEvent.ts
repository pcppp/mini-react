import { Container } from 'hostConfig';
import { Props } from 'shared/ReactTypes';
// 存储react中props的属性
export const elementPropsKey = '__props';
type CallBackFunction = (e: Event) => void;
interface paths {
  bubble: CallBackFunction[];
  capture: CallBackFunction[];
}
interface SyntheticEvent extends Event {
  __stopPropagation: boolean;
}
const validEventTypeList = ['click'];
export interface DOMElement extends Element {
  [elementPropsKey]: Props;
}
export function updateFiberProps(node: DOMElement, props: Props) {
  node[elementPropsKey] = props;
}
export function initEvent(container: Container, eventType: string) {
  if (!validEventTypeList.includes(eventType)) {
    console.warn('不支持的事件类型', eventType);
  }
  if (__DEV__) {
    console.log('当前的事件', eventType);
  }
  container.addEventListener(eventType, (e) =>
    dispatchEvent(container, eventType, e)
  );
}

function createSyntheticEvent(e: Event) {
  const syntheticEvent = e as SyntheticEvent;
  syntheticEvent.__stopPropagation = false;
  const originSyntheticEvent = e.stopPropagation;
  syntheticEvent.stopPropagation = () => {
    syntheticEvent.__stopPropagation = true;
    if (originSyntheticEvent) {
      originSyntheticEvent();
    }
  };
  return syntheticEvent;
}

function dispatchEvent(container: Container, eventType: string, e: Event) {
  const targetElement = e.target;
  if (targetElement === null) {
    console.warn('事件不存在target');
    return;
  }
  // 收集沿途事件
  const { bubble, capture } = collectPaths(
    targetElement as DOMElement,
    container,
    eventType
  );
  // 合成事件
  const se = createSyntheticEvent(e);
  // 遍历capture
  triggerEventFlow(capture, se);
  // 遍历bubble
  if (!se.__stopPropagation) {
    triggerEventFlow(bubble, se);
  }
}
function triggerEventFlow(paths: CallBackFunction[], se: SyntheticEvent) {
  for (let i = 0; i < paths.length; i++) {
    const callbackFunc = paths[i];
    callbackFunc.call(null, se);
    if (se.__stopPropagation) {
      break;
    }
  }
}
function getEventFromEventType(eventType: string): string[] | undefined {
  return {
    click: ['onClickCapture', 'onClick'],
  }[eventType];
}
function collectPaths(
  target: DOMElement,
  container: Container,
  eventType: string
) {
  const paths: paths = {
    bubble: [],
    capture: [],
  };
  while (target && target !== container) {
    const elementProps = target[elementPropsKey];
    if (elementProps) {
      const callBackNameList = getEventFromEventType(eventType);
      callBackNameList?.forEach((callbackName, i) => {
        const eventCallBack = elementProps[callbackName];
        if (eventCallBack) {
          if (i === 0) {
            paths.capture.unshift(eventCallBack);
          } else {
            paths.bubble.push(eventCallBack);
          }
        }
      });
    }
    target = target.parentNode as DOMElement;
  }
  return paths;
}
