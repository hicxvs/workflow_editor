export function workflowSubprocessNavigationEventsHandler(modeler) {
    const workflowEventBus = modeler.get('eventBus');

    workflowEventBus.on('subprocess.expanded', (event) => {
        console.log('subprocess.expanded', event);
    });

    workflowEventBus.on('subprocess.collapsed', (event) => {
        console.log('subprocess.collapsed', event);
    });

    workflowEventBus.on('subprocess.clicked', (event) => {
        console.log('subprocess.clicked', event);
    }); 

    workflowEventBus.on('root.set', (event) => {
        console.log('root.set', event);
    }); 

    workflowEventBus.on('root.unset', (event) => {
        console.log('root.unset', event);
    }); 

    workflowEventBus.on('root.changed', (event) => {
        console.log('root.changed', event);
    });      

    }
