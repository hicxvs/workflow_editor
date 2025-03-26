export function saveChanges(original, changes) {
    Object.entries(changes).forEach(([key, value]) => {
        if (value !== original[key]) {
            original[key] = value;
        }
    });
}