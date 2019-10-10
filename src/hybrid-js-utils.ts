import {HybridJSUtils, jsVersionError} from "./model/hybrid-js-utils.model";

const hybridJsUtils: HybridJSUtils = (function () {

    return {
        isClient(): boolean {
            return typeof window !== "undefined" && !!window.document;
        },

        /**
         *
         * @param duration value in milliseconds to wait for
         * @param updateFreq value in milliseconds to refresh
         * @param targetEl a DOM element where the countdown will be appended
         */
        htmlCountDown(duration: number, updateFreq: number, targetEl: HTMLElement): Promise<void> {
            return new Promise<void>((resolve) => {
                let counter: number = this.roundNumber(duration, 2) / 1000;
                let interval: any;
                const print = () => {
                    counter -= updateFreq / 1000;
                    counter < 0 && (counter = 0);
                    targetEl.innerHTML = counter.toFixed(2);
                };
                interval = setInterval(function () {
                    print();
                }, updateFreq);
                setTimeout(() => {
                    clearInterval(interval);
                    print();
                    resolve();
                }, duration);
            });
        },

        loadJQuery(version: string = "1.12.0"): Promise<boolean> {
            const isServer = !this.isClient();
            return new Promise<boolean>(function (resolve) {
                if (isServer) {
                    jsVersionError("HybridJsUtils.loadJQuery");
                    resolve(!1);
                    return;
                }
                const jq = document.createElement("script");
                jq.src = `https://ajax.googleapis.com/ajax/libs/jquery/${version}/jquery.min.js`;
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

        logWithStyle(title: string, msg: string, style: string = ""): void {
            if (this.isClient()) {
                console.group(title || "");
                console.log("%c" + msg, style);
                console.groupEnd();
            }
            else {
                console.log(`***** ${title} *****`);
                console.log(msg);
                console.log(`***** ***** *****`);
            }
        },

        addLeadingZeroes(numeric: number | string): string {
            numeric = "" + numeric; // Convert to string;
            return ("00" + numeric).slice(-2);
        },

        isNumeric(value: string): boolean {
            return !isNaN(parseInt(value, 10));
        },

        isObject(entity: any): boolean {
            return !!entity && entity === Object(entity) && entity.constructor === Object;
        },

        randomHex(length: number): string {
            const maxlen = 8;
            const min = Math.pow(16, Math.min(length, maxlen) - 1);
            const max = Math.pow(16, Math.min(length, maxlen)) - 1;
            const n = Math.floor(Math.random() * (max - min + 1)) + min;
            let r = n.toString(16);
            while (r.length < length) {
                r = r + this.randomHex(length - maxlen);
            }
            return r;
        },

        randomInt(min: number, max: number, excludeMin: boolean | string = !1, excludeMax: boolean | string = !1): number {
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

        removeMultipleSpaces(source: string): string {
            return source.replace(/\s\s+/g, " ");
        },

        removeTrailingSlash(source: string): string {
            return source.replace(/\/$/, "");
        },

        roundNumber(value: number | string, decimalDigits: number = 2): number {
            if (isNaN(+value)) {
                throw new Error("HybridJsUtils.roundNumber: invalid value supplied");
            }
            if (isNaN(+decimalDigits) || decimalDigits < 0 || !Number.isInteger(decimalDigits)) {
                throw new Error("HybridJsUtils.roundNumber: decimalDigits must be a positive integer!");
            }
            const factor = 10 ** decimalDigits;
            return Math.round(+value * factor) / factor;
        }
    };

})();

export {HybridJSUtils} from "./model/hybrid-js-utils.model";
export let isClient = hybridJsUtils.isClient;
export let htmlCountDown = hybridJsUtils.htmlCountDown;
export let loadJQuery = hybridJsUtils.loadJQuery;
export let logWithStyle = hybridJsUtils.logWithStyle;
export let addLeadingZeroes = hybridJsUtils.addLeadingZeroes;
export let isNumeric = hybridJsUtils.isNumeric;
export let isObject = hybridJsUtils.isObject;
export let randomHex = hybridJsUtils.randomHex;
export let randomInt = hybridJsUtils.randomInt;
export let removeMultipleSpaces = hybridJsUtils.removeMultipleSpaces;
export let removeTrailingSlash = hybridJsUtils.removeTrailingSlash;
export let roundNumber = hybridJsUtils.roundNumber;
