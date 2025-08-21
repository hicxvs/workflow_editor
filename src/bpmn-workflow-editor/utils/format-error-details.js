export function formatErrorDetails(errors) {
    if (!Array.isArray(errors)) {
        return 'Invalid error format';
    }

    return errors
        .map(error => {
        const code = error.code ?? 'unknown';
        const detail = error.detail ?? 'no detail provided';
        const source = error.source ?? 'null';

        return `code: ${code}\ndetail: ${detail}\nsource: ${source}`;
        })
        .join('\n\n');
}
