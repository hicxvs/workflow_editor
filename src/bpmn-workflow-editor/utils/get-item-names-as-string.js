export function getItemIdAndNamesAsString(itemsCollection) {
    if(!itemsCollection || !itemsCollection.length) {
        return '';
    }

    return itemsCollection.map(item => `${item.id}:${item.name}`).join(', ');
}