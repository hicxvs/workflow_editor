import { ref } from 'vue';
import { createWorkflowEditor } from '../../bpmn-workflow-editor/modeler';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';
import { FILE_INPUT_EVENT_TYPE } from '../../components/singleton-components/file-input-component/file-input-event-type';

import EventBus from '../../eventbus';
import defaultDiagram from '../../bpmn-workflow-editor/diagrams/default-diagram';

export const WorkflowEditorStoreIdentifier = 'workflow-editor-store';

export function WorkflowEditorStore() {

    const currentModeler = ref(null);
    const currentWorkingElement = ref(null);
    const currentWorkingElementProperties = ref(null);
    const currentProcessDefinition = ref(null);
    const currentNavigationPath = ref(null);
    const currentDiagram = ref(null);
    const currentImportDiagramResults = ref(null);

    async function initializeWorkflowEditor(canvas) {
        if(!canvas) {
            return;
        }

        currentModeler.value = createWorkflowEditor(canvas);
        await importAndProcessDiagram(defaultDiagram);
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

        EventBus.on(FILE_INPUT_EVENT_TYPE.LOAD_FILE_SUCCESS, async (fileData) => {
            if(!fileData || !fileData.content) {
                return;
            }          

            await importAndProcessDiagram(fileData.content);
        });
    }

    async function importAndProcessDiagram(diagramContent) {
        if(!diagramContent) {
            return;
        }

        if(!currentModeler.value) {
            return;
        }

        if(currentDiagram.value) {
            clearDiagram();
        }

        if(currentImportDiagramResults.value) {
            currentImportDiagramResults.value = null;
        }

        currentImportDiagramResults.value = await currentModeler.value.importDiagram(diagramContent);
        currentProcessDefinition.value = currentModeler.value.getProcessDefinition();
        currentModeler.value.fitCanvasToDiagram();
    }

    function unregisterWorkflowEditorEventHandlers() {
        EventBus.off(EVENT_TYPE.UPDATE_ELEMENT);
        EventBus.off(EVENT_TYPE.UPDATE_NAVIGATION_PATH);
        EventBus.off(FILE_INPUT_EVENT_TYPE.LOAD_FILE_SUCCESS);
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
    };
}   
