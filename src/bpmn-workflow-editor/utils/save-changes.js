export function saveChanges(original, changes) {
    Object.entries(changes).forEach(([key, value]) => {
        if (value !== original.value[key]) {
            original.value[key] = value;
        }
    });
}