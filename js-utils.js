(function (exports) {

    function isClient() {
        return typeof window !== "undefined" && !!window.document;
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
			isNumeric: function(value){
				return !isNaN(parseInt(value, 10));
			},
            randomHex: function randomHex(len) {
                var maxlen = 8;
                var min = Math.pow(16, Math.min(len, maxlen) - 1);
                var max = Math.pow(16, Math.min(len, maxlen)) - 1;
                var n = Math.floor(Math.random() * (max - min + 1)) + min;
                var r = n.toString(16);
                while (r.length < len) {
                    r = r + randomHex(len - maxlen);
                }
                return r;
            },
            randomInt: function (min, max, excludeMin, excludeMax) {
                if (isNaN(min) || isNaN(max)) {
                    console.error("Invalid args for JsUtils.randomInt");
					return;
                }
                excludeMax = !isNaN(+(excludeMax == "true") || +excludeMax); //forces to have true or "true"
                excludeMin = !isNaN(+(excludeMin == "true") || +excludeMin); //forces to have true or "true"
                excludeMax && max--;
				excludeMin && min++;
                return Math.floor(Math.random() * (max - min + 1)) + min;
            },
			removeMultipleSpaces: function (target){
				return target.replace(/\s\s+/g, ' ');
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