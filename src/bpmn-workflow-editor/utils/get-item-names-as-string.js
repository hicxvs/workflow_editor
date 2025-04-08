export function getItemNamesAsString(itemsCollection) {
    if(!itemsCollection || !itemsCollection.length) {
        return '';
    }

    return itemsCollection.map(item => item.name).join(', ');
}