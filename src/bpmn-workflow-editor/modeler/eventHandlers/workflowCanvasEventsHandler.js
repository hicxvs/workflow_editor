import { EVENT_TYPE } from '../eventTypes';
import EventBus from '../../../eventbus';

export function workflowCanvasEventHandler(modeler) {
    const workflowCanvas = modeler.get('canvas')?._container;
    const workflowEventBus = modeler.get('eventBus');

    if(!workflowCanvas) {
        return;
    }

    workflowCanvas.addEventListener('click', (event) => {
        const target = event.srcElement;

        if(target.hasAttribute('data-element-id')) {
            EventBus.emit(EVENT_TYPE.CANVAS_SELECTED);
        }
    }, { passive: true });

    workflowEventBus.on('selection.changed', (event) => {
        if(event.newSelection.length) {
           EventBus.emit(EVENT_TYPE.CANVAS_DESELECTED);
        }
    });
}