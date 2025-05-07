export function extractScriptId(input) {
    const match = input.match(/scripts\.execute\('(.+?)'/);
    return match ? match[1] : null;
}