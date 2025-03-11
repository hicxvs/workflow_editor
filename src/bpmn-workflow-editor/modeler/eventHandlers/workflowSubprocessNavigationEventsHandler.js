import { EVENT_TYPE } from '../eventTypes';
import EventBus from '../../../eventbus';

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

        const rootElement = event.element;

        if(!rootElement.type) {
            return;
        }
        
        handleSubprocessNavigation(rootElement);
    }); 

    workflowEventBus.on('root.unset', (event) => {
        console.log('root.unset', event);
    }); 

    workflowEventBus.on('root.changed', (event) => {
        console.log('root.changed', event);
    });      

    function handleSubprocessNavigation(rootElement) {
       if(rootElement.type === 'bpmn:SubProcess') {

            const navigationPath = () => ({
                id: rootElement.id,
                name: rootElement.businessObject.name || rootElement.id
            });
            
            EventBus.emit(EVENT_TYPE.UPDATE_NAVIGATION_PATH, navigationPath);
            return;
       }

       if(rootElement.type === 'bpmn:Process') {

            EventBus.emit(EVENT_TYPE.UPDATE_NAVIGATION_PATH, null);
            return;

       }
    }
}
