/** Used to match words composed of alphanumeric characters. */
const reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

export function asciiWords(string: string): string[] | null {
    return string.match(reAsciiWord);
}
