export function modelerEventsHandler(modeler) {
    modeler.on('import.done', (event) => {
        console.log('import.done', event);
    });

    modeler.on('save.done', (event) => {
        console.log('save.done', event);
    });   
}
