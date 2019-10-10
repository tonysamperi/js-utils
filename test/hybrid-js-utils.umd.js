(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.hybridJsUtils = {})));
}(this, (function (exports) { 'use strict';

    function jsVersionError(methodName) {
        console.error("Can't execute \"" + methodName + ", since you're not using client JS!");
    }

    var hybridJsUtils = (function () {
        return {
            isClient: function () {
                return typeof window !== "undefined" && !!window.document;
            },
            /**
             *
             * @param duration value in milliseconds to wait for
             * @param updateFreq value in milliseconds to refresh
             * @param targetEl a DOM element where the countdown will be appended
             *
             * @returns Promise with last value for counter, to check if everything went ok.
             */
            htmlCountDown: function (duration, updateFreq, targetEl) {
                var _this = this;
                return new Promise(function (resolve) {
                    var counter = _this.roundNumber(duration / 1000, 2);
                    var counterDiff = updateFreq / 1000;
                    var interval;
                    var print = function () {
                        counter -= counterDiff;
                        if (counter < 0 || counter < counterDiff) {
                            counter = 0;
                        }
                        targetEl.innerHTML = counter.toFixed(2);
                    };
                    interval = setInterval(function () {
                        print();
                    }, updateFreq);
                    setTimeout(function () {
                        clearInterval(interval);
                        print();
                        resolve(counter);
                    }, duration);
                });
            },
            loadJQuery: function (version) {
                if (version === void 0) { version = "1.12.0"; }
                var isServer = !this.isClient();
                return new Promise(function (resolve) {
                    if (isServer) {
                        jsVersionError("HybridJsUtils.loadJQuery");
                        resolve(!1);
                        return;
                    }
                    var jq = document.createElement("script");
                    jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/" + version + "/jquery.min.js";
                    jq.addEventListener("load", function () {
                        console.info("jQuery loaded.");
                        resolve(!0);
                    });
                    jq.addEventListener("error", function () {
                        console.info("jQuery not loaded.");
                        resolve(!1);
                    });
                    document.getElementsByTagName("head")[0].appendChild(jq);
                });
            },
            logWithStyle: function (title, msg, style) {
                if (style === void 0) { style = ""; }
                if (this.isClient()) {
                    console.group(title || "");
                    console.log("%c" + msg, style);
                    console.groupEnd();
                }
                else {
                    console.log("***** " + title + " *****");
                    console.log(msg);
                    console.log("***** ***** *****");
                }
            },
            addLeadingZeroes: function (numeric) {
                numeric = "" + numeric; // Convert to string;
                return ("00" + numeric).slice(-2);
            },
            isNumeric: function (value) {
                return !isNaN(parseInt(value, 10));
            },
            isObject: function (entity) {
                return !!entity && entity === Object(entity) && entity.constructor === Object;
            },
            randomHex: function (length) {
                var maxlen = 8;
                var min = Math.pow(16, Math.min(length, maxlen) - 1);
                var max = Math.pow(16, Math.min(length, maxlen)) - 1;
                var n = Math.floor(Math.random() * (max - min + 1)) + min;
                var r = n.toString(16);
                while (r.length < length) {
                    r = r + this.randomHex(length - maxlen);
                }
                return r;
            },
            randomInt: function (min, max, excludeMin, excludeMax) {
                if (excludeMin === void 0) { excludeMin = !1; }
                if (excludeMax === void 0) { excludeMax = !1; }
                if (isNaN(min) || isNaN(max)) {
                    console.warn("Invalid args for JsUtils.randomInt. Returning random between 0 and 100");
                    return this.randomInt(0, 100);
                }
                // tslint:disable-next-line:triple-equals
                excludeMax = !isNaN(+(excludeMax == "true") || +excludeMax); // forces to have true or "true"
                // tslint:disable-next-line:triple-equals
                excludeMin = !isNaN(+(excludeMin == "true") || +excludeMin); // forces to have true or "true"
                excludeMax && max--;
                excludeMin && min++;
                return Math.floor(Math.random() * (max - min + 1)) + min;
            },
            removeMultipleSpaces: function (source) {
                return source.replace(/\s\s+/g, " ");
            },
            removeTrailingSlash: function (source) {
                return source.replace(/\/$/, "");
            },
            roundNumber: function (value, decimalDigits) {
                if (decimalDigits === void 0) { decimalDigits = 2; }
                if (isNaN(+value)) {
                    throw new Error("HybridJsUtils.roundNumber: invalid value supplied");
                }
                if (isNaN(+decimalDigits) || decimalDigits < 0 || !Number.isInteger(decimalDigits)) {
                    throw new Error("HybridJsUtils.roundNumber: decimalDigits must be a positive integer!");
                }
                var factor = Math.pow(10, decimalDigits);
                return Math.round(+value * factor) / factor;
            }
        };
    })();
    var isClient = hybridJsUtils.isClient;
    var htmlCountDown = hybridJsUtils.htmlCountDown;
    var loadJQuery = hybridJsUtils.loadJQuery;
    var logWithStyle = hybridJsUtils.logWithStyle;
    var addLeadingZeroes = hybridJsUtils.addLeadingZeroes;
    var isNumeric = hybridJsUtils.isNumeric;
    var isObject = hybridJsUtils.isObject;
    var randomHex = hybridJsUtils.randomHex;
    var randomInt = hybridJsUtils.randomInt;
    var removeMultipleSpaces = hybridJsUtils.removeMultipleSpaces;
    var removeTrailingSlash = hybridJsUtils.removeTrailingSlash;
    var roundNumber = hybridJsUtils.roundNumber;

    exports.isClient = isClient;
    exports.htmlCountDown = htmlCountDown;
    exports.loadJQuery = loadJQuery;
    exports.logWithStyle = logWithStyle;
    exports.addLeadingZeroes = addLeadingZeroes;
    exports.isNumeric = isNumeric;
    exports.isObject = isObject;
    exports.randomHex = randomHex;
    exports.randomInt = randomInt;
    exports.removeMultipleSpaces = removeMultipleSpaces;
    exports.removeTrailingSlash = removeTrailingSlash;
    exports.roundNumber = roundNumber;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=hybrid-js-utils.umd.js.map
