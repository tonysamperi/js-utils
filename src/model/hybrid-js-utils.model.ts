export interface HybridJSUtils {
    isClient: () => boolean;
    htmlCountDown: (duration: number, updateFreq: number, targetEl: HTMLElement) => Promise<number>;
    loadJQuery: (version?: string) => Promise<boolean>;
    logWithStyle: (title: string, msg: string, style?: string) => void;
    addLeadingZeroes: (numeric: number | string) => string;
    isNumeric: (value: string) => boolean;
    isObject: (entity: any) => boolean;
    objectKeysToCamelCase: (source: { [key: string]: any }) => { [key: string]: any };
    randomHex: (length: number) => string;
    randomInt: (min: number, max: number, excludeMin?: boolean | string, excludeMax?: boolean | string) => number;
    randomNumericString: (length: number) => string;
    removeMultipleSpaces: (source: string) => string;
    removeTrailingSlash: (source: string) => string;
    roundNumber: (value: number | string, decimalDigits: number) => number;
    sprintf: (str: string, ...args: string[]) => string;
    toCamelCase: (str: string) => string;
    toSnakeCase: (str: string) => string;
}

export function jsVersionError(methodName: string) {
    console.error(`Can't execute "${methodName}, since you're not using client JS!`);
}
