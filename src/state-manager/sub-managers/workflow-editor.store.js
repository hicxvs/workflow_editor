import { ref } from 'vue';
import { createWorkflowEditor } from '../../bpmn-workflow-editor/modeler';
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';
import defaultDiagram from '../../bpmn-workflow-editor/diagrams/default-diagram';

export const WorkflowEditorStoreIdentifier = 'workflow-editor-store';

export function WorkflowEditorStore() {

    const currentModeler = ref(null);
    const currentWorkingElement = ref(null);
    const currentWorkingElementProperties = ref(null);
    const currentProcessDefinition = ref(null);
    const currentNavigationPath = ref(null);
    const currentDiagram = ref(null);

    async function initializeWorkflowEditor(canvas) {
        if(!canvas) {
            return;
        }

        currentModeler.value = createWorkflowEditor(canvas);
        await currentModeler.value.importDiagram(defaultDiagram);
        getWorkflowEditorProcessDefinition();
    }

    function destroyWorkflowEditor() {
        if(currentModeler.value) {
            currentModeler.value.modeler.destroy();
            currentModeler.value = null;
        }        
    }

    function registerWorkflowEditorEventHandlers() {

        EventBus.on(EVENT_TYPE.UPDATE_ELEMENT, (element) => {
            
            if(!element) {
                currentWorkingElement.value = null;
                currentWorkingElementProperties.value = null;
                return;
            }

            currentWorkingElement.value = element;
            currentWorkingElementProperties.value = element?.businessObject || null;
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

    function getWorkflowEditorProcessDefinition() {
        if(!currentModeler.value) {
            return null;
        }

        currentProcessDefinition.value = currentModeler.value.getProcessDefinition();
    }
  
    return {
        currentModeler,
        currentWorkingElement,
        currentWorkingElementProperties,
        currentNavigationPath,
        currentProcessDefinition,
        initializeWorkflowEditor,
        destroyWorkflowEditor,
        registerWorkflowEditorEventHandlers,
        unregisterWorkflowEditorEventHandlers,
        generateDiagram,
        clearDiagram,
        getWorkflowEditorProcessDefinition
    };
}   
