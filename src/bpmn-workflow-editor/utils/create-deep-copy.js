export function createDeepCopy(originalObject) {
    try {
        return {
            original: originalObject,
            copy: JSON.parse(JSON.stringify(originalObject))
        };
    } catch (error) {
        console.error('Error creating deep copy:', error);
        throw error;
    }
}

