import { ref } from 'vue';
import { createWorkflowEditor } from '../../bpmn-workflow-editor/modeler';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';

import EventBus from '../../eventbus';
import defaultDiagram from '../../bpmn-workflow-editor/diagrams/default-diagram';
import { downloadDiagram } from '../../bpmn-workflow-editor/utils/downloader';
import { Storage } from '../../bpmn-workflow-editor/utils/storage';
import { SystemDiagrams } from '../../bpmn-workflow-editor/diagrams/system-diagrams';

export const WorkflowEditorStoreIdentifier = 'workflow-editor-store';
const { saveAPIKey, loadAPIKey, clearAPIKey } = Storage();
const { getAllSystemDiagrams, getSystemDiagramByName, isApiKeyValid } = SystemDiagrams();

export function WorkflowEditorStore() {

    const currentModeler = ref(null);
    const currentWorkingElement = ref(null);
    const currentWorkingElementProperties = ref(null);
    const currentProcessDefinition = ref(null);
    const currentNavigationPath = ref(null);
    const currentDiagram = ref(null);
    const currentImportDiagramResults = ref(null);
    const currentApiKey = ref(null);
    const currentSystemDiagrams = ref(null);

    async function initializeWorkflowEditor(canvas) {
        if(!canvas) {
            return;
        }

        currentModeler.value = createWorkflowEditor(canvas);
        await importAndProcessDiagram(defaultDiagram);
        currentApiKey.value = loadAPIKey();
    }

    function registerWorkflowEditorEventHandlers() {
        EventBus.on(EVENT_TYPE.UPDATE_ELEMENT, updateElement);    
        EventBus.on(EVENT_TYPE.UPDATE_NAVIGATION_PATH, updateNavigationPath);
        EventBus.on(EVENT_TYPE.LOAD_FILE_SUCCESS, loadDiagramFromLocalFileSystem);
        EventBus.on(EVENT_TYPE.SAVE_DIAGRAM, saveDiagram);
        EventBus.on(EVENT_TYPE.SET_API_KEY, setApiKey);
        EventBus.on(EVENT_TYPE.LOAD_DIAGRAMS_FROM_SYSTEM, loadAllDiagramsFromSystem);
        EventBus.on(EVENT_TYPE.LOAD_DIAGRAM_FROM_SYSTEM, loadDiagramFromSystem);
    }

    function unregisterWorkflowEditorEventHandlers() {
        EventBus.off(EVENT_TYPE.UPDATE_ELEMENT);
        EventBus.off(EVENT_TYPE.UPDATE_NAVIGATION_PATH);
        EventBus.off(EVENT_TYPE.LOAD_FILE_SUCCESS);
        EventBus.off(EVENT_TYPE.SET_API_KEY);
        EventBus.off(EVENT_TYPE.LOAD_DIAGRAMS_FROM_SYSTEM);
        EventBus.off(EVENT_TYPE.LOAD_DIAGRAM_FROM_SYSTEM);
    }

    function updateElement(element) {                    
        if(!element) {
            clearCurrentWorkingElement();
            return;
        }

        currentWorkingElement.value = element;
        currentWorkingElementProperties.value = element?.businessObject || null;
    }

    function updateNavigationPath(navigationPath) {
        if(!navigationPath) {
            clearNavigationPath();
            return;
        }

        if(!currentNavigationPath.value || currentNavigationPath.value.length > 0) {
            clearNavigationPath();
        }

        currentNavigationPath.value = [navigationPath];
    }
    
    function setApiKey(apiKey) {
        if(!apiKey) {
            currentApiKey.value = null;
            clearAPIKey();
            return;
        }

        if(!isApiKeyValid(apiKey)) {
            console.error("Invalid API key provided. Please provide a valid API key to load a diagram from the system.");
            clearAPIKey();
            return;
        }

        currentApiKey.value = apiKey;
        saveAPIKey(apiKey);
    }

    async function loadDiagramFromLocalFileSystem(fileData) {
        if(!fileData || !fileData.content) {
            return;
        }

        await importAndProcessDiagram(fileData.content);
    }

    async function loadAllDiagramsFromSystem() {
        if(!currentApiKey.value) {
            console.error("No API key provided. Please provide an API key to load a diagram from the system.");
            return;
        }

        currentSystemDiagrams.value = await getAllSystemDiagrams(currentApiKey.value);
        EventBus.emit(EVENT_TYPE.SHOW_DIAGRAMS_FROM_SYSTEM, currentSystemDiagrams.value);
    }

    async function loadDiagramFromSystem(diagram) {
        if(!currentApiKey.value) {
            console.error("No API key provided. Please provide an API key to load a diagram from the system.");
            return;
        }

        if(!diagram || !diagram.name) {
            console.error("No valid diagram. Please provide a valid diagram to be loaded from the system.");
            return;
        }

       const loadedDiagramContent = await getSystemDiagramByName(currentApiKey.value, diagram.name);
       await importAndProcessDiagram(loadedDiagramContent);
       EventBus.emit(EVENT_TYPE.CLOSE_MODAL);
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
        currentModeler.value.fitCanvasToDiagram();
    }   

    function destroyWorkflowEditor() {
        if(currentModeler.value) {
            currentModeler.value.modeler.destroy();
            currentModeler.value = null;
        }        
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
        currentApiKey,
        currentSystemDiagrams,
        initializeWorkflowEditor,
        destroyWorkflowEditor,
        registerWorkflowEditorEventHandlers,
        unregisterWorkflowEditorEventHandlers,
        generateDiagram,
        clearWorkflowEditor,
        saveDiagram
    };
}   
