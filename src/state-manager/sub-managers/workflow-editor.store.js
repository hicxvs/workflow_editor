import { ref } from 'vue';
import { createWorkflowEditor } from '../../bpmn-workflow-editor/modeler';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';

import EventBus from '../../eventbus';
import defaultDiagram from '../../bpmn-workflow-editor/diagrams/default-diagram';
import { downloadDiagram } from '../../bpmn-workflow-editor/utils/downloader';
import { Storage } from '../../bpmn-workflow-editor/utils/storage';
import { SystemDiagrams } from '../../bpmn-workflow-editor/diagrams/system-diagrams';
import { ClassListing } from '../../bpmn-workflow-editor/class-listing';
import { TASK_TYPES } from '../../bpmn-workflow-editor/modeler/modelerTypes/taskTypes';
import { GATEWAY_TYPES } from '../../bpmn-workflow-editor/modeler/modelerTypes/gatewayTypes';

export const WorkflowEditorStoreIdentifier = 'workflow-editor-store';
const { saveAPIKey, loadAPIKey, clearAPIKey } = Storage();
const { getAllSystemDiagrams, getSystemDiagramByName, isApiKeyValid } = SystemDiagrams();
const { getAllJavaClasses } = ClassListing();

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
        EventBus.emit(EVENT_TYPE.TASK_TYPES_READY, TASK_TYPES);
        EventBus.emit(EVENT_TYPE.GATEWAY_TYPES_READY, GATEWAY_TYPES);
        EventBus.emit(EVENT_TYPE.LOAD_WORKFLOW_JAVA_CLASSES);       
    }

    function registerWorkflowEditorEventHandlers() {
        EventBus.on(EVENT_TYPE.UPDATE_ELEMENT, updateElement);    
        EventBus.on(EVENT_TYPE.UPDATE_NAVIGATION_PATH, updateNavigationPath);
        EventBus.on(EVENT_TYPE.LOAD_FILE_SUCCESS, loadDiagramFromLocalFileSystem);
        EventBus.on(EVENT_TYPE.SAVE_DIAGRAM, saveDiagram);
        EventBus.on(EVENT_TYPE.SET_API_KEY, setApiKey);
        EventBus.on(EVENT_TYPE.LOAD_DIAGRAMS_FROM_SYSTEM, loadAllDiagramsFromSystem);
        EventBus.on(EVENT_TYPE.LOAD_DIAGRAM_FROM_SYSTEM, loadDiagramFromSystem);
        EventBus.on(EVENT_TYPE.SAVE_LISTENER, saveListener);
        EventBus.on(EVENT_TYPE.SAVE_FORM_PROPERTY, saveFormProperty);
        EventBus.on(EVENT_TYPE.GENERATE_XML_DIAGRAM, generateXMLDiagram);
        EventBus.on(EVENT_TYPE.UPDATE_ELEMENT_TYPE, updateElementType);
        EventBus.on(EVENT_TYPE.UPDATE_ELEMENT_ATTRIBUTE, updateElementAttribute);
        EventBus.on(EVENT_TYPE.UPDATE_ELEMENT_PROPERTY, updateElementProperty);
        EventBus.on(EVENT_TYPE.LOAD_WORKFLOW_JAVA_CLASSES, getWorkflowJavaClasses);
    }

    function unregisterWorkflowEditorEventHandlers() {
        EventBus.off(EVENT_TYPE.UPDATE_ELEMENT);
        EventBus.off(EVENT_TYPE.UPDATE_NAVIGATION_PATH);
        EventBus.off(EVENT_TYPE.LOAD_FILE_SUCCESS);
        EventBus.off(EVENT_TYPE.SET_API_KEY);
        EventBus.off(EVENT_TYPE.LOAD_DIAGRAMS_FROM_SYSTEM);
        EventBus.off(EVENT_TYPE.LOAD_DIAGRAM_FROM_SYSTEM);
        EventBus.off(EVENT_TYPE.SAVE_LISTENER);
        EventBus.off(EVENT_TYPE.SAVE_FORM_PROPERTY);
        EventBus.off(EVENT_TYPE.GENERATE_XML_DIAGRAM);
        EventBus.off(EVENT_TYPE.UPDATE_ELEMENT_TYPE);
        EventBus.off(EVENT_TYPE.UPDATE_ELEMENT_PROPERTY);
        EventBus.off(EVENT_TYPE.LOAD_WORKFLOW_JAVA_CLASSES);
    }

    async function getWorkflowJavaClasses() {
        const javaClasses = await getAllJavaClasses();
        EventBus.emit(EVENT_TYPE.WORKFLOW_JAVA_CLASSES_READY, javaClasses);
    }

    function updateElement(element) {                    
        if(!element) {
            clearCurrentWorkingElement();
            EventBus.emit(EVENT_TYPE.CLEAR_GENERATED_XML_DIAGRAM);
            return;
        }

        clearCurrentWorkingElement();
        currentWorkingElement.value = element;
        currentWorkingElementProperties.value = element?.businessObject || null;
        EventBus.emit(EVENT_TYPE.GENERATE_XML_DIAGRAM);
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
    
    function saveListener(listeners) {
        currentModeler.value.saveListener(currentWorkingElementProperties.value, listeners);
        EventBus.emit(EVENT_TYPE.GENERATE_XML_DIAGRAM);
    }

    function saveFormProperty(formProperties) {
        currentModeler.value.saveFormProperty(currentWorkingElementProperties.value, formProperties);
        EventBus.emit(EVENT_TYPE.GENERATE_XML_DIAGRAM);
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

    async function generateXMLDiagram() {
        const diagramXMLContent = await currentModeler.value.saveDiagram();
        const {xml} = diagramXMLContent;
        EventBus.emit(EVENT_TYPE.GENERATED_XML_DIAGRAM_READY, xml);
    }

    function updateElementType(typeToUpdate) {
        currentModeler.value.updateElementType(typeToUpdate);
        EventBus.emit(EVENT_TYPE.GENERATE_XML_DIAGRAM);
    }

    function updateElementAttribute(attributeToUpdate) {
        currentModeler.value.updateElementAttribute(attributeToUpdate);
        EventBus.emit(EVENT_TYPE.GENERATE_XML_DIAGRAM);
    }

    function updateElementProperty(propertyToUpdate) {
        currentModeler.value.updateElementProperty(propertyToUpdate);
        EventBus.emit(EVENT_TYPE.GENERATE_XML_DIAGRAM);
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
