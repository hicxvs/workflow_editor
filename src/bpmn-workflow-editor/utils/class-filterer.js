export function ClassFilterer(classCollection) {
    
    function fitlerClasses(searchTerm) {
        if(!searchTerm) {
            return clearClasses();
        }

        return classCollection.filter(classItem => classItem.file?.toLowerCase()?.includes(searchTerm?.toLocaleLowerCase()))
        .map(classItem => ({
            value: `${classItem.file.replace('.java','')}`,
            label: `${classItem.source}.${classItem.file.replace('.java','')}`
        }))
        .slice(0,5);
    }

    function clearClasses() {
        return [];
    }

    return {
        fitlerClasses,
        clearClasses
    };
}