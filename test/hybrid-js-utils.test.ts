import {JSDOM} from "jsdom";
import {HybridJSUtils} from "../src/hybrid-js-utils";
import * as pkg from "../package.json";

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Test</title>
  </head>
  <body>
    <div>Test</div>
  </body>
</html>`;
// const dom = new JSDOM(html);
const dom = new JSDOM(html, {runScripts: "dangerously", resources: "usable"});
/**
 * version
 * resetSettings
 * isClient
 * htmlCountDown
 * logWithStyle
 * addLeadingZeroes
 * forEachFrom
 * isNumeric
 * isObject
 * randomHex
 * randomInt
 * removeMultipleSpaces
 * removeTrailingSlash
 * roundNumber
 */

describe("HybridJSUtils test", () => {

    afterEach(() => {
        // console.info("CLEANING UP...");
        (global as any).window = void 0;
        (global as any).document = void 0;
    });

    it("should have the correct version", () => {
        expect(HybridJSUtils.version).toBe(pkg.version);
    });

    it("should have the correct defaults", () => {
        expect(HybridJSUtils.defaults).toEqual({
            SPRINTF_NEEDLE: "%s"
        });
    });

    it("should reset settings", () => {
        HybridJSUtils.settings = {
            SPRINTF_NEEDLE: "@"
        };
        HybridJSUtils.resetSettings();

        expect(HybridJSUtils.settings).toEqual({
            SPRINTF_NEEDLE: "%s"
        });
    });

    it("should return false (isClient)", () => {
        expect(HybridJSUtils.isClient()).toBeFalsy();
    });

    it("should return zero (htmlCountDown)", (done) => {
        const $target = dom.window.document.body;
        HybridJSUtils.htmlCountDown(3500, 500, $target)
            .then((counter) => {
                expect(counter).toBe(0);
                done();
            });
    });

    it("should NOT log with style", () => {
        console.log = jest.fn();
        const title = "TEST LOG TITLE";
        HybridJSUtils.logWithStyle(title, "Some message");
        expect((console.log as any).mock.calls[0][0]).toBe(`***** ${title} *****`);
    });

    it("should log with style", () => {
        (global as any).window = dom.window;
        (global as any).document = dom.window.document;
        console.log = jest.fn();
        const title = "TEST LOG TITLE";
        const msg = "Some message";
        const style = "color: #CC0000";
        HybridJSUtils.logWithStyle(title, msg, style);
        expect((console.log as any).mock.calls[0][0]).toBe(`%c${msg}`);
    });

    /**
     * ADD LEADING ZEROES
     */

    it("should add leading zeroes", () => {
        expect(HybridJSUtils.addLeadingZeroes(3)).toBe("03");
    });

    /**
     * ARRAYS
     */
    interface IFooBar {
        foo: any;
        bar: any;
    }

    const testArray: IFooBar[] = [
        {foo: 1, bar: "a"},
        {foo: 2, bar: "b"},
        {foo: 3, bar: "c"},
        {foo: 4, bar: "d"}
    ];

    it("should loop over the full array (alias)", () => {
        const tmp: IFooBar[] = [];
        const res = HybridJSUtils.eachFrom(testArray, 0, (item) => {
            tmp.push(item);
        });
        expect(tmp.length).toBe(testArray.length);
        expect(tmp).toEqual(testArray);
        expect(res).toEqual(testArray);
    });

    it("should log error for wrong argument passed", () => {
        const tmp: string[] = [];
        console.error = jest.fn();
        const mockFn = console.error as jest.Mock;
        // @ts-expect-error
        HybridJSUtils.forEachFrom("testArray", 0, (item: string) => {
            tmp.push(item);
        });
        expect(mockFn.mock.calls[0][0]).toContain("eachFrom only accept arrays as source, found instead");
    });

    it("should loop over the full array", () => {
        const tmp: IFooBar[] = [];
        const res = HybridJSUtils.forEachFrom(testArray, 0, (item) => {
            tmp.push(item);
        });
        expect(tmp.length).toBe(testArray.length);
        expect(tmp).toEqual(testArray);
        expect(res).toEqual(testArray);
    });

    it("should loop over the full array", () => {
        const tmp: IFooBar[] = [];
        const res = HybridJSUtils.forEachFrom(testArray, 0, (item) => {
            tmp.push(item);
        });
        expect(tmp.length).toBe(testArray.length);
        expect(tmp).toEqual(testArray);
        expect(res).toEqual(testArray);
    });

    it("should break early", () => {
        const tmp: IFooBar[] = [];
        const breakAt = testArray.length - 2;
        HybridJSUtils.forEachFrom(testArray, 0, (item, index) => {
            tmp.push(item);

            return index < breakAt;
        });
        expect(tmp.length).toBe(breakAt + 1);
        expect(tmp).toEqual(testArray.slice(0, breakAt + 1));
    });

    it("should loop over the array from desired index (alias)", () => {
        const tmp: IFooBar[] = [];
        const res = HybridJSUtils.eachFrom(testArray, 1, (item) => {
            tmp.push(item);
        });
        expect(tmp.length).toBe(testArray.slice(1).length);
        expect(tmp).toEqual(testArray.slice(1));
        expect(res).toEqual(testArray);
    });

    it("should loop over the array from desired index", () => {
        const tmp: IFooBar[] = [];
        const res = HybridJSUtils.forEachFrom(testArray, 1, (item) => {
            tmp.push(item);
        });
        expect(tmp.length).toBe(testArray.slice(1).length);
        expect(tmp).toEqual(testArray.slice(1));
        expect(res).toEqual(testArray);
    });

    it("should mutate the items", () => {
        const srcArray: IFooBar[] = JSON.parse(JSON.stringify(testArray));
        const res = HybridJSUtils.forEachFrom(srcArray, 0, (item) => {
            item.foo++;
            item.bar += "z";
        });
        srcArray.forEach((item, index) => {
            expect(item.foo).toEqual(testArray[index].foo + 1);
            expect(item.bar).toEqual(testArray[index].bar + "z");
        });
        expect(res).toEqual(srcArray);
    });

    /**
     * CHECK NUMERIC
     */

    it("should check numerics", () => {
        expect(HybridJSUtils.isNumeric("3")).toBeTruthy();
        expect(HybridJSUtils.isNumeric("N")).toBeFalsy();
    });

    /**
     * CHECK OBJECTS
     */

    it("should check entities to be objects", () => {
        expect(HybridJSUtils.isObject({foo: "bar"})).toBeTruthy();
        expect(HybridJSUtils.isObject("N")).toBeFalsy();
    });

    /**
     * CREATE HEX
     */

    it("should create a random hex", () => {
        const hexLength = 10;
        const random = HybridJSUtils.randomHex(hexLength);
        expect(random.length).toBe(hexLength);
        expect(parseInt(random, 16)).toBeLessThanOrEqual(1099511627775);
        expect(parseInt(random, 16)).toBeGreaterThanOrEqual(0);
        expect(random).toMatch(new RegExp("\\b[0-9A-F]{" + hexLength + "}\\b", "gi"));
    });

    /**
     * CREATE INTEGER
     */

    it("should create a random integer", () => {
        const random1 = HybridJSUtils.randomInt(0, 10);
        expect(typeof random1).toBe(typeof 0);
        expect(random1).toBeLessThanOrEqual(10);
        expect(random1).toBeGreaterThanOrEqual(0);

        const random2 = HybridJSUtils.randomInt(Number("AAA"), 10);
        expect(typeof random2).toBe(typeof 0);
        expect(random2).toBeLessThanOrEqual(100);
        expect(random2).toBeGreaterThanOrEqual(0);

    });

    /**
     * TRIM MULTIPLE SPACES
     */

    it("should remove multiple spaces", () => {
        const trimmed = HybridJSUtils.removeMultipleSpaces("FOO  BAR   GOO  CAR");
        expect(trimmed).toBe("FOO BAR GOO CAR");
    });

    /**
     * REMOVE TRAILING SLASH
     */

    it("should remove trailing slash", () => {
        const url = "http://www.google.it";
        const trimmed = HybridJSUtils.removeTrailingSlash(url + "/");
        expect(trimmed).toBe(url);
    });

    /**
     * ROUND NUMBER
     */

    it("should round number", () => {
        const source1 = 5.25;
        const source2 = 875.786549;
        const rounded1 = HybridJSUtils.roundNumber(source1, 0);
        const rounded2 = HybridJSUtils.roundNumber(source2, 2);
        expect(rounded1).toBe(5);
        expect(rounded2).toBe(875.79);
    });

    it("should fail round number", () => {
        function invalidDecimalDigits() {
            HybridJSUtils.roundNumber(5.25, -2);
        }

        function invalidValue() {
            HybridJSUtils.roundNumber("AAA", 1);
        }

        expect(invalidValue).toThrow(new Error("HybridJsUtils.roundNumber: invalid value supplied"));
        expect(invalidDecimalDigits).toThrow(new Error("HybridJsUtils.roundNumber: decimalDigits must be a positive integer!"));
    });

    /**
     * CREATE RANDOM NUMERIC STRING
     */

    it("should generate a random numeric string", () => {
        const strlen = 11;
        const numericString = HybridJSUtils.randomNumericString(strlen);
        expect(numericString).toBeDefined();
        expect(numericString).toHaveLength(strlen);
    });

    /**
     * SPRINTF
     */

    it("should \"sprintf\" a string", () => {
        const string = "Hi, %s I'm %s";
        const names = ["Harold", "John"];
        const result = HybridJSUtils.sprintf(string, names[0], names[1]);
        expect(result).toBeDefined();
        expect(result).toBe(string.replace("%s", names[0]).replace("%s", names[1]));
    });

    it("shouldn't explode when \"sprintf\" receives anything but a string", () => {
        const getStr = (): string => {
            return (global as any).foo as string;
        };
        const result = HybridJSUtils.sprintf(getStr(), "John");
        expect(result).toBe(getStr());
    });

    /**
     * SPRINTFX
     */

    it("should \"sprintfx\" a string", () => {
        const needle = "@param@";
        const string = `Hi, ${needle} I'm ${needle}`;
        const names = ["Harold", "John"];
        const result = HybridJSUtils.sprintfx(string, needle, names[0], names[1]);
        expect(result).toBeDefined();
        expect(result).toBe(string.replace(needle, names[0]).replace(needle, names[1]));
    });

    it("shouldn't explode when \"sprintfx\" receives anything but a string", () => {
        const needle = "@param@";
        const getStr = (): string => {
            return (global as any).foo as string;
        };
        const result = HybridJSUtils.sprintfx(getStr(), needle, "John");
        expect(result).toBe(getStr());
    });

    /**
     * STRING MANIPULATION
     */

    it("should 'camelCase' a string", () => {
        const checks = [
            {src: "Hi I'm John", expected: "hiI'mJohn"},
            {src: "DOWNLOAD_GIFTCARDS", expected: "downloadGiftcards"},
            {src: "date-locale", expected: "dateLocale"},
            {src: "hybrid-js-utils", expected: "hybridJsUtils"}
        ];

        checks.forEach(({src, expected}) => {
            const result = HybridJSUtils.toCamelCase(src);
            expect(result).toBeDefined();
            expect(result).toBe(expected);
        });
    });

    it("should 'snakeCase' a string", () => {
        const checks = [
            {src: "Hi I'm John", expected: "hi_i'm_john"},
            {src: "DOWNLOAD_GIFTCARDS", expected: "download_giftcards"}
        ];

        checks.forEach(({src, expected}) => {
            const result = HybridJSUtils.toSnakeCase(src);
            expect(result).toBeDefined();
            expect(result).toBe(expected);
        });
    });

    it("should convert object keys", () => {
        const source = {
            foo_key: 1,
            bar_key: 2
        };
        const result = HybridJSUtils.objectKeysToCamelCase(source);
        expect(Object.keys(result).length).toBe(Object.keys(source).length);
        expect(Object.keys(result)).toEqual(["fooKey", "barKey"]);
    });
})
;
