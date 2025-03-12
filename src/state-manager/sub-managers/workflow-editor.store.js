import { ref } from 'vue';
import { createWorkflowEditor } from '../../bpmn-workflow-editor/modeler';
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';

export const WorkflowEditorStoreIdentifier = 'workflow-editor-store';

export function WorkflowEditorStore() {

    const currentModeler = ref(null);
    const currentWorkingElement = ref(null);
    const currentNavigationPath = ref(null);
    const currentDiagram = ref(null);

    function initializeWorkflowEditor(canvas) {
        if(!canvas) {
            return;
        }

        currentModeler.value = createWorkflowEditor(canvas);
    }

    function destroyWorkflowEditor() {
        if(currentModeler.value) {
            currentModeler.value.modeler.destroy();
            currentModeler.value = null;
        }        
    }

    function registerWorkflowEditorEventHandlers() {

        EventBus.on(EVENT_TYPE.UPDATE_ELEMENT, (element) => {
            currentWorkingElement.value = element;
        });
    
        EventBus.on(EVENT_TYPE.UPDATE_NAVIGATION_PATH, (navigationPath) => {
            if(!navigationPath) {
                currentNavigationPath.value = null;
                return;
            }

            if(!currentNavigationPath.value || currentNavigationPath.value.length > 0) {
                currentNavigationPath.value = null;
            }

            currentNavigationPath.value = [navigationPath];
        });
    }
    
    function unregisterWorkflowEditorEventHandlers() {
        EventBus.off(EVENT_TYPE.UPDATE_ELEMENT);
        EventBus.off(EVENT_TYPE.UPDATE_NAVIGATION_PATH);
    }

    function clearDiagram() {        
        currentModeler.value.clearDiagram();
        currentDiagram.value = null;
    }

    async function generateDiagram() {
        if(currentDiagram.value) {
            clearDiagram();
        }

        currentDiagram.value = await currentModeler.value.generateDiagram();
    }

   
        
    return {
        modeler: currentModeler,
        currentWorkingElement,
        currentNavigationPath,
        initializeWorkflowEditor,
        destroyWorkflowEditor,
        registerWorkflowEditorEventHandlers,
        unregisterWorkflowEditorEventHandlers,
        generateDiagram,
        clearDiagram
    };
}   
