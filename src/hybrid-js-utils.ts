import {HybridJSUtils, jsVersionError} from "./model/hybrid-js-utils.model";

const hybridJsUtils: HybridJSUtils = (function () {

    const lib: HybridJSUtils = {
        addLeadingZeroes(numeric: number | string): string {
            numeric = "" + numeric; // Convert to string;
            return ("00" + numeric).slice(-2);
        },
        /**
         * Alias for forEachFrom, see forEachFrom
         */
        eachFrom<T = any>(array: T[], index: number, iteratee: (item: T, index: number, source: T[]) => any): T[] {
            return lib.forEachFrom(array, index, iteratee);
        },
        /**
         * Loop over arrays starting from desired index
         * @param array: the list to iterate
         * @param index: the starting index
         * @param iteratee: the function to invoke in each iteration
         *
         * @returns The array
         */
        forEachFrom<T = any[]>(array: T[], index: number, iteratee: (item: T, index: number, source: T[]) => any): T[] {
            if (!Array.isArray(array)) {
                console.error(`eachFrom only accept arrays as source, found instead ${typeof array}`);
                return array;
            }
            // tslint:disable-next-line:naming-convention
            let _index = typeof index !== typeof 0 || index < 0 ? -1 : index - 1;
            const length = array == null ? 0 : array.length;

            while (++_index < length) {
                if (iteratee(array[_index], _index, array) === false) {
                    break;
                }
            }
            return array;
        },
        /**
         *
         * @param duration value in milliseconds to wait for
         * @param updateFreq value in milliseconds to refresh
         * @param targetEl a DOM element where the countdown will be appended
         *
         * @returns Promise with last value for counter, to check if everything went ok.
         */
        htmlCountDown(duration: number, updateFreq: number, targetEl: HTMLElement): Promise<number> {
            return new Promise<number>((resolve) => {
                let counter: number = this.roundNumber(duration / 1000, 2);
                const counterDiff = updateFreq / 1000;
                let interval: any;
                const print = () => {
                    counter -= counterDiff;
                    if (counter < 0 || counter < counterDiff) {
                        counter = 0;
                    }
                    targetEl.innerHTML = counter.toFixed(2);
                };
                interval = setInterval(function () {
                    print();
                }, updateFreq);
                setTimeout(() => {
                    clearInterval(interval);
                    print();
                    resolve(counter);
                }, duration);
            });
        },

        isClient(): boolean {
            return typeof window !== "undefined" && !!window.document;
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

        isNumeric(value: string): boolean {
            return !isNaN(parseInt(value, 10));
        },

        isObject(entity: any): boolean {
            return !!entity && entity === Object(entity) && entity.constructor === Object;
        },

        objectKeysToCamelCase: (source: { [key: string]: any }): { [key: string]: any } => {
            const result: { [key: string]: any } = {};
            Object.keys(source).forEach((key: string) => {
                // tslint:disable-next-line:max-line-length
                result[lib.toCamelCase(key)] = Object.keys(source[key]).length > 0 && !Array.isArray(source) ? lib.objectKeysToCamelCase(source[key]) : source[key];
            });

            return result;
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

        randomNumericString: (length: number = 10): string => {
            let i = -1;
            const result = [];
            while (++i < length) {
                result.push(lib.randomInt(0, 5, !0, !0));
            }
            return result.join("");
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
        },

        sprintf: (str: string, ...argv: string[]): string => {
            if (typeof str !== typeof "") {
                return str;
            }

            return !argv.length ? str : lib.sprintf(str = str.replace("%s", `${argv.shift()}`), ...argv);
        },

        toCamelCase: (s: string): string => {
            return s
            .replace(/_/g, " ")
            .replace(/\s(.)/g, ($1: string) => {
                return $1.toUpperCase();
            })
            .replace(/\s/g, "")
            .replace(/^(.)/, ($1: string) => {
                return $1.toLowerCase();
            });
        },

        toSnakeCase: (s: string): string => {
            return s
            .replace(/\.?([A-Z]+)/g, (_x_, y) => {
                return "_" + y.toLowerCase();
            }).replace(/^_/, "");
        }
    };

    return lib;

})();

export {HybridJSUtils} from "./model/hybrid-js-utils.model";
export const isClient = hybridJsUtils.isClient;
export const htmlCountDown = hybridJsUtils.htmlCountDown;
export const loadJQuery = hybridJsUtils.loadJQuery;
export const logWithStyle = hybridJsUtils.logWithStyle;
export const addLeadingZeroes = hybridJsUtils.addLeadingZeroes;
export const eachFrom = hybridJsUtils.eachFrom;
export const forEachFrom = hybridJsUtils.forEachFrom;
export const isNumeric = hybridJsUtils.isNumeric;
export const isObject = hybridJsUtils.isObject;
export const objectKeysToCamelCase = hybridJsUtils.objectKeysToCamelCase;
export const randomHex = hybridJsUtils.randomHex;
export const randomInt = hybridJsUtils.randomInt;
export const randomNumericString = hybridJsUtils.randomNumericString;
export const removeMultipleSpaces = hybridJsUtils.removeMultipleSpaces;
export const removeTrailingSlash = hybridJsUtils.removeTrailingSlash;
export const roundNumber = hybridJsUtils.roundNumber;
export const sprintf = hybridJsUtils.sprintf;
export const toCamelCase = hybridJsUtils.toCamelCase;
export const toSnakeCase = hybridJsUtils.toSnakeCase;
