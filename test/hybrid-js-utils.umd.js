(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.hybridJsUtils = factory());
}(this, (function () { 'use strict';

  // Useful polyfills for future devs
  // import "core-js/fn/array/find"
  // import "core-js/fn/string/includes"
  // import "core-js/fn/promise"
  function jsVersionError(methodName) {
      methodName = methodName.substr(9, methodName.indexOf("("));
      console.error("Can't execute \"" + methodName + ", since you're not using client JS!");
  }
  var HybridJsUtils = /** @class */ (function () {
      function HybridJsUtils() {
      }
      HybridJsUtils.prototype.isClient = function () {
          return typeof window !== "undefined" && !!window.document;
      };
      HybridJsUtils.prototype.htmlCountDown = function (duration, updateFreq, targetEl) {
          if (!this.isClient()) {
              return jsVersionError(arguments.callee.toString());
          }
          var counter = this.roundNumber(duration, 1000) / 1000;
          var interval;
          var print = function () {
              counter -= updateFreq / 1000;
              counter < 0 && (counter = 0);
              targetEl.innerHTML = counter.toFixed(2);
          };
          interval = window.setInterval(function () {
              print();
          }, updateFreq);
          setTimeout(function () {
              clearInterval(interval);
              print();
          }, duration);
      };
      HybridJsUtils.prototype.loadJQuery = function () {
          if (!this.isClient()) {
              return jsVersionError(arguments.callee.toString());
          }
          var jq = document.createElement("script");
          jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js";
          jq.onload = function () {
              console.info("jQuery loaded.");
          };
          jq.onerror = function () {
              console.info("jQuery not loaded.");
          };
          document.getElementsByTagName("head")[0].appendChild(jq);
      };
      HybridJsUtils.prototype.logWithStyle = function (title, msg, style) {
          if (!this.isClient()) {
              return jsVersionError(arguments.callee.toString());
          }
          console.group(title || "");
          console.log("%c" + msg, style);
          console.groupEnd();
      };
      HybridJsUtils.prototype.addLeadingZeroes = function (n) {
          return ("00" + n).slice(-2);
      };
      HybridJsUtils.prototype.isNumeric = function (value) {
          return !isNaN(parseInt(value, 10));
      };
      HybridJsUtils.prototype.isObject = function (entity) {
          return !!entity && entity === Object(entity) && entity.constructor === Object;
      };
      HybridJsUtils.prototype.randomHex = function (len) {
          var maxlen = 8;
          var min = Math.pow(16, Math.min(len, maxlen) - 1);
          var max = Math.pow(16, Math.min(len, maxlen)) - 1;
          var n = Math.floor(Math.random() * (max - min + 1)) + min;
          var r = n.toString(16);
          while (r.length < len) {
              r = r + this.randomHex(len - maxlen);
          }
          return r;
      };
      HybridJsUtils.prototype.randomInt = function (min, max, excludeMin, excludeMax) {
          if (excludeMin === void 0) { excludeMin = !1; }
          if (excludeMax === void 0) { excludeMax = !1; }
          if (isNaN(min) || isNaN(max)) {
              console.error("Invalid args for JsUtils.randomInt");
              return;
          }
          // tslint:disable-next-line:triple-equals
          excludeMax = !isNaN(+(excludeMax == "true") || +excludeMax); // forces to have true or "true"
          // tslint:disable-next-line:triple-equals
          excludeMin = !isNaN(+(excludeMin == "true") || +excludeMin); // forces to have true or "true"
          excludeMax && max--;
          excludeMin && min++;
          return Math.floor(Math.random() * (max - min + 1)) + min;
      };
      HybridJsUtils.prototype.removeMultipleSpaces = function (source) {
          return source.replace(/\s\s+/g, " ");
      };
      HybridJsUtils.prototype.removeTrailingSlash = function (source) {
          return source.replace(/\/$/, "");
      };
      HybridJsUtils.prototype.roundNumber = function (value, closest) {
          // cleanup
          if (typeof value === "string") {
              value = value.replace(/[^\d\.\-\ ]/g, "");
          }
          if (isNaN(+value)) {
              return 0;
          }
          if (typeof closest !== typeof 0 || closest < 1) {
              closest = 1;
          }
          return Math.round(+value / closest) * closest;
      };
      return HybridJsUtils;
  }());
  var hybridJsUtils = new HybridJsUtils();

  return hybridJsUtils;

})));
//# sourceMappingURL=hybrid-js-utils.umd.js.map
