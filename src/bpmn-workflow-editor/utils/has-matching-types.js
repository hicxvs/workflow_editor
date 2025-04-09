export function hasMatchingTypes(typesCollection, requestedTypes) {
    return typesCollection.some(typeObj =>
        requestedTypes.includes(typeObj.$type)
    );   
}