import { EVENT_TYPE } from '../eventTypes';
import EventBus from '../../../eventbus';

export function workflowElementEventsHandler(modeler) {
    const workflowEventBus = modeler.get('eventBus');

    workflowEventBus.on('element.changed', (event) => {
        EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT, event.element);
    });

    workflowEventBus.on('element.add', (event) => {
        EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT, event.element);
    });

    workflowEventBus.on('element.added', (event) => {
        throw('element.added handler not implemented:', event);
    });

    workflowEventBus.on('element.removed', (event) => {
        throw('element.removed handler not implemented:', event);
    });       
}
