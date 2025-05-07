export function isValidScriptId(input) {
    const pattern = /^[A-Za-z0-9]+(\.[A-Za-z0-9_]+)+$/;
    return pattern.test(input);
}