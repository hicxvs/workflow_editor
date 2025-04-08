import { EVENT_TYPE } from '../eventTypes';
import EventBus from '../../../eventbus';
import { PROCESS_TYPES } from '../modelerTypes/processTypes';

export function workflowSubprocessNavigationEventsHandler(modeler) {
    const workflowEventBus = modeler.get('eventBus');

    workflowEventBus.on('subprocess.expanded', (event) => {
        throw('subprocess.expanded handler not implemented:', event);
    });

    workflowEventBus.on('subprocess.collapsed', (event) => {
        throw('subprocess.collapsed handler not implemented:', event);
    });

    workflowEventBus.on('subprocess.clicked', (event) => {
        throw('subprocess.clicked handler not implemented:', event);
    }); 

    workflowEventBus.on('root.set', (event) => {

        const rootElement = event.element;

        if(!rootElement.type) {
            return;
        }
        
        handleSubprocessNavigation(rootElement);
    }); 

    workflowEventBus.on('root.unset', (event) => {
        throw('root.unset handler not implemented:', event);
    }); 

    workflowEventBus.on('root.changed', (event) => {
        throw('root.changed handler not implemented:', event);
    });      

    function handleSubprocessNavigation(rootElement) {
       if(rootElement.type === PROCESS_TYPES.SUB_PROCESS) {

            const navigationPath = () => ({
                id: rootElement.id,
                name: rootElement.businessObject.name || rootElement.id
            });
            
            EventBus.emit(EVENT_TYPE.UPDATE_NAVIGATION_PATH, navigationPath);
            return;
       }

       if(rootElement.type === PROCESS_TYPES.PROCESS) {

            EventBus.emit(EVENT_TYPE.UPDATE_NAVIGATION_PATH, null);
            return;

       }
    }
}
