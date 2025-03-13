import { EVENT_TYPE } from '../eventTypes';
import EventBus from '../../../eventbus';

export function workflowEditorSelectionEventsHandler(modeler) {
    const workflowEventBus = modeler.get('eventBus');

    workflowEventBus.on('selection.changed', (event) => {

        const selectedElement = event.newSelection[0];

        if(!selectedElement) {
            EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT, null);
            return;
        }

        if(selectedElement.type === 'bpmn:ServiceTask') {
            handleServiceTaskSelection(selectedElement);
        }

        EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT, selectedElement);
    });

    workflowEventBus.on('selection.cleared', (event) => {
        throw('selection.cleared handler not implemented:', event);
    });

    function handleServiceTaskSelection(selectedElement) {

        const expressionTypes = ['expression', 'delegateExpression', 'class'];
        const { properties } = selectedElement;        

        for (const type of expressionTypes) {
            if (type in properties) {
                properties.serviceTaskExpressionType = type;
                break;
            }
        }      
    }
}
