import { EVENT_TYPE } from '../eventTypes';
import EventBus from '../../../eventbus';

export function workflowElementEventsHandler(modeler) {
    const workflowEventBus = modeler.get('eventBus');

    workflowEventBus.on('element.changed', (event) => {
        EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT, event.element);
    });

    workflowEventBus.on('element.add', (event) => {
        console.log('element.add', event);
    });

    workflowEventBus.on('element.added', (event) => {
        console.log('element.added', event);
    });

    workflowEventBus.on('element.removed', (event) => {
        console.log('element.removed', event);
    });       
}
