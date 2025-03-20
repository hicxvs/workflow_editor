export function createDeepCopy(originalObject) {
    if (originalObject === null || typeof originalObject !== 'object') {
        return originalObject;
    }

    if (Array.isArray(originalObject)) {
        return originalObject.map(createDeepCopy);
    }

    const copy = {};
    for (const key in originalObject) {
        if (originalObject.hasOwnProperty(key)) {
            copy[key] = createDeepCopy(originalObject[key]);
        }
    }

    return copy;
}

