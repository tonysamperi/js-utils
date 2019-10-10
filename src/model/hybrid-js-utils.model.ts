export interface HybridJSUtils {
    isClient: () => boolean;
    htmlCountDown: (duration: number, updateFreq: number, targetEl: HTMLElement) => Promise<void>;
    loadJQuery: (version?: string) => Promise<boolean>;
    logWithStyle: (title: string, msg: string, style?: string) => void;
    addLeadingZeroes: (numeric: number | string) => string;
    isNumeric: (value: string) => boolean;
    isObject: (entity: any) => boolean;
    randomHex: (length: number) => string;
    randomInt: (min: number, max: number, excludeMin?: boolean | string, excludeMax?: boolean | string) => number;
    removeMultipleSpaces: (source: string) => string;
    removeTrailingSlash: (source: string) => string;
    roundNumber: (value: number | string, decimalDigits: number) => number;
}

export function jsVersionError(methodName: string) {
    console.error(`Can't execute "${methodName}, since you're not using client JS!`);
}
