import { ref } from 'vue';
import { createWorkflowEditor } from '../../bpmn-workflow-editor/modeler';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';

import EventBus from '../../eventbus';
import defaultDiagram from '../../bpmn-workflow-editor/diagrams/default-diagram';
import { downloadDiagram } from '../../bpmn-workflow-editor/utils/downloader';

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
                clearCurrentWorkingElement();
                return;
            }

            currentWorkingElement.value = element;
            currentWorkingElementProperties.value = element?.businessObject || null;
        });
    
        EventBus.on(EVENT_TYPE.UPDATE_NAVIGATION_PATH, (navigationPath) => {
            if(!navigationPath) {
                clearNavigationPath();
                return;
            }

            if(!currentNavigationPath.value || currentNavigationPath.value.length > 0) {
                clearNavigationPath();
            }

            currentNavigationPath.value = [navigationPath];
        });

        EventBus.on(EVENT_TYPE.LOAD_FILE_SUCCESS, async (fileData) => {
            if(!fileData || !fileData.content) {
                return;
            }          

            await importAndProcessDiagram(fileData.content);
        });

        EventBus.on(EVENT_TYPE.SAVE_DIAGRAM, saveDiagram);
    }

    async function importAndProcessDiagram(diagramContent) {
        if(!diagramContent || !currentModeler.value) {
            return;
        }

        if(currentDiagram.value) {
            clearWorkflowEditor();
        }

        if(currentImportDiagramResults.value) {
            currentImportDiagramResults.value = null;
        }

        currentImportDiagramResults.value = await currentModeler.value.importDiagram(diagramContent);
        currentProcessDefinition.value = currentModeler.value.getProcessDefinition();
    }

    function unregisterWorkflowEditorEventHandlers() {
        EventBus.off(EVENT_TYPE.UPDATE_ELEMENT);
        EventBus.off(EVENT_TYPE.UPDATE_NAVIGATION_PATH);
        EventBus.off(EVENT_TYPE.LOAD_FILE_SUCCESS);
    }

    function clearDiagram() {        
        currentModeler.value.clearDiagram();
        currentDiagram.value = null;
    }

    function clearCurrentWorkingElement() {
        currentWorkingElement.value = null;
        currentWorkingElementProperties.value = null;
    }

    function clearNavigationPath() {
        currentNavigationPath.value = null;
    }

    function clearWorkflowEditor() {
        clearDiagram();
        clearCurrentWorkingElement();
        clearNavigationPath();
    }

    async function generateDiagram() {
        if(currentDiagram.value) {
            clearDiagram();
        }

        currentDiagram.value = await currentModeler.value.generateDiagram();
    }

    async function saveDiagram() { 
        const fileName = 'diagram';
        const diagramXMLContent = await currentModeler.value.saveDiagram();
        downloadDiagram(fileName, diagramXMLContent);
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
        clearWorkflowEditor,
        saveDiagram
    };
}   
