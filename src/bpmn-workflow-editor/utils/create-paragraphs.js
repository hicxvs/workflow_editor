export function createParagraphs(inputArray) {
    let result = '';
    inputArray.forEach(item => {
        if (item.text) {
            result += item.text + '\n\n';
        }
    });
    return result.trim();
}