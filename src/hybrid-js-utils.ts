// Useful polyfills for future devs
// import "core-js/fn/array/find"
// import "core-js/fn/string/includes"
// import "core-js/fn/promise"

function jsVersionError(methodName: string) {
  methodName = methodName.substr(9, methodName.indexOf("("));
  console.error(`Can't execute "${methodName}, since you're not using client JS!`);
}

class HybridJsUtils {

  isClient(): boolean {
    return typeof window !== "undefined" && !!window.document;
  }

  htmlCountDown(duration: number, updateFreq: number, targetEl: HTMLElement): void {
    if (!this.isClient()) {
      return jsVersionError(arguments.callee.toString());
    }
    let counter: number = this.roundNumber(duration, 1000) / 1000;
    let interval: number;
    const print = () => {
      counter -= updateFreq / 1000;
      counter < 0 && (counter = 0);
      targetEl.innerHTML = counter.toFixed(2);
    };
    interval = window.setInterval(function() {
      print();
    }, updateFreq);
    setTimeout(() => {
      clearInterval(interval);
      print();
    }, duration);
  }

  loadJQuery(): void {
    if (!this.isClient()) {
      return jsVersionError(arguments.callee.toString());
    }
    const jq = document.createElement("script");
    jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js";
    jq.onload = function() {
      console.info("jQuery loaded.");
    };
    jq.onerror = function() {
      console.info("jQuery not loaded.");
    };
    document.getElementsByTagName("head")[0].appendChild(jq);
  }

  logWithStyle(title: string, msg: string, style: string): void {
    if (!this.isClient()) {
      return jsVersionError(arguments.callee.toString());
    }
    console.group(title || "");
    console.log("%c" + msg, style);
    console.groupEnd();
  }

  addLeadingZeroes(n: number) {
    return ("00" + n).slice(-2);
  }

  isNumeric(value: string) {
    return !isNaN(parseInt(value, 10));
  }

  isObject(entity: any) {
    return !!entity && entity === Object(entity) && entity.constructor === Object;
  }

  randomHex(len: number) {
    const maxlen = 8;
    const min = Math.pow(16, Math.min(len, maxlen) - 1);
    const max = Math.pow(16, Math.min(len, maxlen)) - 1;
    const n = Math.floor(Math.random() * (max - min + 1)) + min;
    let r = n.toString(16);
    while (r.length < len) {
      r = r + this.randomHex(len - maxlen);
    }
    return r;
  }

  randomInt(min: number, max: number, excludeMin: boolean | string = !1, excludeMax: boolean | string = !1) {
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
  }

  removeMultipleSpaces(source: string) {
    return source.replace(/\s\s+/g, " ");
  }

  removeTrailingSlash(source: string) {
    return source.replace(/\/$/, "");
  }

  roundNumber(value: string | number, closest: number) {
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
  }
}

export default new HybridJsUtils();
