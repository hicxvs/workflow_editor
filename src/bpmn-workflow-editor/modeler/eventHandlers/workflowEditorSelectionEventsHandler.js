export function workflowEditorSelectionEventsHandler(modeler) {
    const workflowEventBus = modeler.get('eventBus');

    workflowEventBus.on('selection.changed', (event) => {
        console.log('selection.changed', event);
    });

    workflowEventBus.on('selection.cleared', (event) => {
        console.log('selection.cleared', event);
    });
}
