// @ts-nocheck
'use strict';

function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
const util = require('util');
module.exports = function (theModule, ignoreKeys) {
  if (stryMutAct_9fa48("0")) {
    {}
  } else {
    stryCov_9fa48("0");
    ignoreKeys = stryMutAct_9fa48("3") ? ignoreKeys && [] : stryMutAct_9fa48("2") ? false : stryMutAct_9fa48("1") ? true : (stryCov_9fa48("1", "2", "3"), ignoreKeys || (stryMutAct_9fa48("4") ? ["Stryker was here"] : (stryCov_9fa48("4"), [])));
    function isCallbackedFunction(func) {
      if (stryMutAct_9fa48("5")) {
        {}
      } else {
        stryCov_9fa48("5");
        if (stryMutAct_9fa48("8") ? typeof func === 'function' : stryMutAct_9fa48("7") ? false : stryMutAct_9fa48("6") ? true : (stryCov_9fa48("6", "7", "8"), typeof func !== (stryMutAct_9fa48("9") ? "" : (stryCov_9fa48("9"), 'function')))) {
          if (stryMutAct_9fa48("10")) {
            {}
          } else {
            stryCov_9fa48("10");
            return stryMutAct_9fa48("11") ? true : (stryCov_9fa48("11"), false);
          }
        }
        const str = func.toString().split(stryMutAct_9fa48("12") ? "" : (stryCov_9fa48("12"), '\n'))[0];
        return str.includes(stryMutAct_9fa48("13") ? "" : (stryCov_9fa48("13"), 'callback)'));
      }
    }
    function isAsyncFunction(fn) {
      if (stryMutAct_9fa48("14")) {
        {}
      } else {
        stryCov_9fa48("14");
        return stryMutAct_9fa48("17") ? fn && fn.constructor || fn.constructor.name === 'AsyncFunction' : stryMutAct_9fa48("16") ? false : stryMutAct_9fa48("15") ? true : (stryCov_9fa48("15", "16", "17"), (stryMutAct_9fa48("19") ? fn || fn.constructor : stryMutAct_9fa48("18") ? true : (stryCov_9fa48("18", "19"), fn && fn.constructor)) && (stryMutAct_9fa48("21") ? fn.constructor.name !== 'AsyncFunction' : stryMutAct_9fa48("20") ? true : (stryCov_9fa48("20", "21"), fn.constructor.name === (stryMutAct_9fa48("22") ? "" : (stryCov_9fa48("22"), 'AsyncFunction')))));
      }
    }
    function promisifyRecursive(module) {
      if (stryMutAct_9fa48("23")) {
        {}
      } else {
        stryCov_9fa48("23");
        if (stryMutAct_9fa48("26") ? false : stryMutAct_9fa48("25") ? true : stryMutAct_9fa48("24") ? module : (stryCov_9fa48("24", "25", "26"), !module)) {
          if (stryMutAct_9fa48("27")) {
            {}
          } else {
            stryCov_9fa48("27");
            return;
          }
        }
        const keys = Object.keys(module);
        keys.forEach(key => {
          if (stryMutAct_9fa48("28")) {
            {}
          } else {
            stryCov_9fa48("28");
            if (stryMutAct_9fa48("30") ? false : stryMutAct_9fa48("29") ? true : (stryCov_9fa48("29", "30"), ignoreKeys.includes(key))) {
              if (stryMutAct_9fa48("31")) {
                {}
              } else {
                stryCov_9fa48("31");
                return;
              }
            }
            if (stryMutAct_9fa48("33") ? false : stryMutAct_9fa48("32") ? true : (stryCov_9fa48("32", "33"), isAsyncFunction(module[key]))) {
              if (stryMutAct_9fa48("34")) {
                {}
              } else {
                stryCov_9fa48("34");
                module[key] = wrapCallback(module[key], util.callbackify(module[key]));
              }
            } else if (stryMutAct_9fa48("36") ? false : stryMutAct_9fa48("35") ? true : (stryCov_9fa48("35", "36"), isCallbackedFunction(module[key]))) {
              if (stryMutAct_9fa48("37")) {
                {}
              } else {
                stryCov_9fa48("37");
                module[key] = wrapPromise(module[key], util.promisify(module[key]));
              }
            } else if (stryMutAct_9fa48("40") ? typeof module[key] !== 'object' : stryMutAct_9fa48("39") ? false : stryMutAct_9fa48("38") ? true : (stryCov_9fa48("38", "39", "40"), typeof module[key] === (stryMutAct_9fa48("41") ? "" : (stryCov_9fa48("41"), 'object')))) {
              if (stryMutAct_9fa48("42")) {
                {}
              } else {
                stryCov_9fa48("42");
                promisifyRecursive(module[key]);
              }
            }
          }
        });
      }
    }
    function wrapCallback(origFn, callbackFn) {
      if (stryMutAct_9fa48("43")) {
        {}
      } else {
        stryCov_9fa48("43");
        return function wrapperCallback(...args) {
          if (stryMutAct_9fa48("44")) {
            {}
          } else {
            stryCov_9fa48("44");
            if (stryMutAct_9fa48("47") ? args.length || typeof args[args.length - 1] === 'function' : stryMutAct_9fa48("46") ? false : stryMutAct_9fa48("45") ? true : (stryCov_9fa48("45", "46", "47"), args.length && (stryMutAct_9fa48("49") ? typeof args[args.length - 1] !== 'function' : stryMutAct_9fa48("48") ? true : (stryCov_9fa48("48", "49"), typeof args[stryMutAct_9fa48("50") ? args.length + 1 : (stryCov_9fa48("50"), args.length - 1)] === (stryMutAct_9fa48("51") ? "" : (stryCov_9fa48("51"), 'function')))))) {
              if (stryMutAct_9fa48("52")) {
                {}
              } else {
                stryCov_9fa48("52");
                const cb = args.pop();
                args.push(stryMutAct_9fa48("53") ? () => undefined : (stryCov_9fa48("53"), (err, res) => (stryMutAct_9fa48("56") ? res === undefined : stryMutAct_9fa48("55") ? false : stryMutAct_9fa48("54") ? true : (stryCov_9fa48("54", "55", "56"), res !== undefined)) ? cb(err, res) : cb(err)));
                return callbackFn(...args);
              }
            }
            return origFn(...args);
          }
        };
      }
    }
    function wrapPromise(origFn, promiseFn) {
      if (stryMutAct_9fa48("57")) {
        {}
      } else {
        stryCov_9fa48("57");
        return function wrapperPromise(...args) {
          if (stryMutAct_9fa48("58")) {
            {}
          } else {
            stryCov_9fa48("58");
            if (stryMutAct_9fa48("61") ? args.length || typeof args[args.length - 1] === 'function' : stryMutAct_9fa48("60") ? false : stryMutAct_9fa48("59") ? true : (stryCov_9fa48("59", "60", "61"), args.length && (stryMutAct_9fa48("63") ? typeof args[args.length - 1] !== 'function' : stryMutAct_9fa48("62") ? true : (stryCov_9fa48("62", "63"), typeof args[stryMutAct_9fa48("64") ? args.length + 1 : (stryCov_9fa48("64"), args.length - 1)] === (stryMutAct_9fa48("65") ? "" : (stryCov_9fa48("65"), 'function')))))) {
              if (stryMutAct_9fa48("66")) {
                {}
              } else {
                stryCov_9fa48("66");
                return origFn(...args);
              }
            }
            return promiseFn(...args);
          }
        };
      }
    }
    promisifyRecursive(theModule);
  }
};