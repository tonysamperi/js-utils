!!window.JsUtils || (window.JsUtils = {});

JsUtils = (function () {

    return {
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
        randomInt: function(min, max, excludeMin, excludeMax) {
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
		removeTrailingSlash: function(target) {
			return target.replace(/\/$/, "");
		}
    }

}());