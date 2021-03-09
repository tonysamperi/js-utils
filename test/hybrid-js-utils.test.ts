import * as HybridJSUtils from "../src/hybrid-js-utils";
import {JSDOM} from "jsdom";

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
 * isClient
 * //
 * htmlCountDown
 * loadJQuery
 * logWithStyle
 * //
 * addLeadingZeroes
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

    it("should fail to loadJQuery", (done) => {
        HybridJSUtils.loadJQuery().then((r) => {
            expect(r).toBeFalsy();
            done();
        });
    });

    it("should manage to loadJQuery", (done) => {
        (global as any).window = dom.window;
        (global as any).document = dom.window.document;
        HybridJSUtils.loadJQuery().then((r) => {
            expect(r).toBeTruthy();
            done();
        });
    });

    it("should fail to loadJQuery for wrong script", (done) => {
        (global as any).window = dom.window;
        (global as any).document = dom.window.document;
        console.error = jest.fn(); // Hide error
        HybridJSUtils.loadJQuery("AAA").then((r) => {
            expect(r).toBeFalsy();
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

    it("should add leading zeroes", () => {
        expect(HybridJSUtils.addLeadingZeroes(3)).toBe("03");
    });

    it("should check numerics", () => {
        expect(HybridJSUtils.isNumeric("3")).toBeTruthy();
        expect(HybridJSUtils.isNumeric("N")).toBeFalsy();
    });

    it("should check entities to be objects", () => {
        expect(HybridJSUtils.isObject({foo: "bar"})).toBeTruthy();
        expect(HybridJSUtils.isObject("N")).toBeFalsy();
    });

    it("should create a random hex", () => {
        const hexLength = 10;
        const random = HybridJSUtils.randomHex(hexLength);
        expect(random.length).toBe(hexLength);
        expect(parseInt(random, 16)).toBeLessThanOrEqual(1099511627775);
        expect(parseInt(random, 16)).toBeGreaterThanOrEqual(0);
        expect(random).toMatch(new RegExp("\\b[0-9A-F]{" + hexLength + "}\\b", "gi"));
    });

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

    it("should remove multiple spaces", () => {
        const trimmed = HybridJSUtils.removeMultipleSpaces("FOO  BAR   GOO  CAR");
        expect(trimmed).toBe("FOO BAR GOO CAR");
    });

    it("should remove trailing slash", () => {
        const url = "http://www.google.it";
        const trimmed = HybridJSUtils.removeTrailingSlash(url + "/");
        expect(trimmed).toBe(url);
    });

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

    it("should generate a random numeric string", () => {
        const strlen = 11;
        const numericString = HybridJSUtils.randomNumericString(strlen);
        expect(numericString).toBeDefined();
        expect(numericString).toHaveLength(strlen);
    });

    it("should \"sprintf\" a string", () => {
        const string = "Hi I'm %s";
        const name = "John";
        const result = HybridJSUtils.sprintf(string, name);
        expect(result).toBeDefined();
        expect(result).toBe(string.replace("%s", name));
    });

    it("shouldn't explode when \"sprintf\" receives anything but a string", () => {
        const getStr = (): string => {
            return (global as any).foo as string;
        };
        const name = "John";
        const result = HybridJSUtils.sprintf(getStr(), name);
        expect(result).toBe(getStr());
    });

    it("should 'camelCase' a string", () => {
        const string = "Hi I'm John";
        const result = HybridJSUtils.toCamelCase(string);
        expect(result).toBeDefined();
        expect(result).toBe("hiI'mJohn");
    });

    it("should 'camelCase' a string", () => {
        const string = "Hi I'm John";
        const result = HybridJSUtils.toSnakeCase(string);
        expect(result).toBeDefined();
        expect(result).toBe("hi _i'm _john");
    });

    it("should convert object keys", () => {
        const source = {
            "foo_key": 1,
            "bar_key": 2
        };
        const result = HybridJSUtils.objectKeysToCamelCase(source);
        expect(Object.keys(result).length).toBe(Object.keys(source).length);
        expect(Object.keys(result)).toEqual(["fooKey", "barKey"]);
    });
})
;
