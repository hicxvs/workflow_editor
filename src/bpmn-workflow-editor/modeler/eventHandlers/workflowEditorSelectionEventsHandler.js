import { EVENT_TYPE } from '../eventTypes';
import EventBus from '../../../eventbus';
import { TASK_TYPES } from '../modelerTypes/taskTypes';

export function workflowEditorSelectionEventsHandler(modeler) {
    const workflowEventBus = modeler.get('eventBus');

    workflowEventBus.on('selection.changed', (event) => {
        const selectedElement = event.newSelection[0];

        if(!selectedElement) {
            EventBus.emit(EVENT_TYPE.ELEMENT_DESELECTED);
            EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT, null);            
            return;
        }

        EventBus.emit(EVENT_TYPE.ELEMENT_SELECTED);

        if(selectedElement.type === TASK_TYPES.SERVICE_TASK) {
            handleServiceTaskSelection(selectedElement);
        }

        EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT, selectedElement);
    });

    workflowEventBus.on('selection.cleared', (event) => {
        throw('selection.cleared handler not implemented:', event);
    });

    function handleServiceTaskSelection(selectedElement) {

        if(selectedElement.type !== TASK_TYPES.SERVICE_TASK) {
            return;
        }

        const expressionTypes = ['expression', 'delegateExpression', 'class'];
        const properties = selectedElement.businessObject;        

        for (const type of expressionTypes) {
            if (type in properties) {
                properties.serviceTaskExpressionType = type;
                break;
            }
        }      
    }
}
