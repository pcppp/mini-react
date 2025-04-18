(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global["jsx-runtime"] = global["jsx-runtime"] || {}, global["jsx-runtime"].js = {})));
})(this, (function (exports) { 'use strict';

  const supportSymbol = typeof Symbol === 'function' && Symbol.for;
  const REACT_ELEMENT_TYPE = supportSymbol ? Symbol.for('react.element') : 0xeac7;

  const ReactElement = function (type, key, ref, props) {
      const element = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          ref,
          props,
          __mark: 'pc',
      };
      return element;
  };
  const jsxDEV = (type, config) => {
      let key = null;
      const props = {};
      let ref = null;
      for (const prop in config) {
          const val = config[prop];
          if (prop === 'key') {
              if (prop !== undefined) {
                  key = '' + val;
              }
              continue;
          }
          if (prop === 'ref') {
              if (prop !== undefined) {
                  ref = '' + val;
              }
              continue;
          }
          if ({}.hasOwnProperty.call(config, prop)) {
              props[prop] = val;
          }
      }
      return ReactElement(type, key, ref, props);
  };
  const jsx = (type, config, ...maybeChildren) => {
      let key = null;
      const props = {};
      let ref = null;
      for (const prop in config) {
          const val = config[prop];
          if (prop === 'key') {
              if (prop !== undefined) {
                  key = '' + val;
              }
              continue;
          }
          if (prop === 'ref') {
              if (prop !== undefined) {
                  ref = '' + val;
              }
              continue;
          }
          if ({}.hasOwnProperty.call(config, prop)) {
              props[prop] = val;
          }
          const maybechildrenLength = maybeChildren.length;
          if (maybechildrenLength)
              if (maybechildrenLength === 1) {
                  props.chitdren = maybeChildren[0];
              }
              else {
                  props.children = maybeChildren;
              }
      }
      return ReactElement(type, key, ref, props);
  };

  exports.jsx = jsx;
  exports.jsxDEV = jsxDEV;

}));
