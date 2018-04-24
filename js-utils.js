(function (exports) {

    function isClient() {
        return !!window && !!window.document;
    }

    var clientJsUtils = (function () {
        return {
            htmlCountDown: function (duration, updateFreq, targetEl) {
                var counter = JsUtils.roundNumber(duration, 1000) / 1000;
                var interval;
                var print = function () {
                    counter -= updateFreq / 1000;
                    counter < 0 && (counter = 0);
                    targetEl.innerHTML = counter.toFixed(2);
                };
                interval = setInterval(function () {
                    print();
                }, updateFreq);
                setTimeout(function () {
                    clearInterval(interval);
                    print();
                }, duration);
            },
            jQueryLoad: function () {
                var jq = document.createElement('script');
                jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js";
                jq.onload = function () {
                    console.info("jQuery loaded.");
                };
                jq.onerror = function () {
                    console.info("jQuery not loaded.");
                };
                document.getElementsByTagName('head')[0].appendChild(jq);
            },
            logWithStyle: function (title, msg, style) {
                console.group(title || "");
                console.log("%c" + msg, style);
                console.groupEnd();
            }
        };
    }());

    var JsUtils = (function () {
        hybridJsUtils = {
            randomHex: function (len) {
                var maxlen = 8;
                var min = Math.pow(16, Math.min(len, maxlen) - 1);
                var max = Math.pow(16, Math.min(len, maxlen)) - 1;
                var n = Math.floor(Math.random() * (max - min + 1)) + min;
                var r = n.toString(16);
                while (r.length < len) {
                    r = r + randHex(len - maxlen);
                }
                return r;
            },
            randomInt: function (min, max, excludeMin, excludeMax) {
                if (!min || isNaN(min)) {
                    min = 0;
                }
                if (!max || isNaN(max)) {
                    max = 1;
                }
                excludeMax = excludeMax == "true"; //forces to have true or "true"
                excludeMin = excludeMin == "true"; //forces to have true or "true"
                var result = 0;
                if (excludeMax) {
                    result = Math.random() * (max - min) + min;
                }
                else {
                    result = Math.floor(Math.random() * (max - min + 1)) + min;
                }
                return excludeMin ? result : ++result;
            },
            removeTrailingSlash: function (target) {
                return target.replace(/\/$/, "");
            },
            roundNumber: function (value, closest) {
                //cleanup
                if (typeof value === typeof "") {
                    value = value.replace(/[^\d\.\-\ ]/g, "");
                }
                if (isNaN(value *= 1)) {
                    return 0;
                }
                if (typeof closest !== typeof 0 || closest < 1) {
                    closest = 1;
                }
                return Math.round(value / closest) * closest;
            }
        };

        return isClient() ? Object.assign(hybridJsUtils, clientJsUtils) : hybridJsUtils;
    }());

    Object.assign(exports, JsUtils);

})(typeof exports === "undefined" ? this["JsUtils"] = {} : exports);