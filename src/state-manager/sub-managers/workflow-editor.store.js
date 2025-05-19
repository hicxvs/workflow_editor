import { ref } from 'vue';
import { createWorkflowEditor } from '../../bpmn-workflow-editor/modeler';
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';
import defaultDiagram from '../../bpmn-workflow-editor/diagrams/default-diagram';
import { downloadWorkflowDiagram } from '../../bpmn-workflow-editor/utils/downloader';
import { Storage } from '../../bpmn-workflow-editor/utils/storage';
import { DiagramsApiUtils } from '../../bpmn-workflow-editor/diagrams/diagrams-api-utils';
import { SystemDiagrams } from '../../bpmn-workflow-editor/diagrams/system-diagrams';
import { DraftDiagrams } from '../../bpmn-workflow-editor/diagrams/draft-diagrams';
import { DiagramScripts } from '../../bpmn-workflow-editor/diagrams/diagram-scripts';
import { ClassListing } from '../../bpmn-workflow-editor/class-listing';
import { TASK_TYPES } from '../../bpmn-workflow-editor/modeler/modelerTypes/taskTypes';
import { GATEWAY_TYPES } from '../../bpmn-workflow-editor/modeler/modelerTypes/gatewayTypes';
import { IS_APP_IN_MODE_DEV } from '../../config';

export const WorkflowEditorStoreIdentifier = 'workflow-editor-store';
const { saveAPIKey, loadAPIKey, clearAPIKey } = Storage();
const { isApiKeyValid } = DiagramsApiUtils();
const { getAllInMemoryJavaClasses } = ClassListing();

const SystemService = SystemDiagrams();
const DraftService = DraftDiagrams();
const ScriptService = DiagramScripts();

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
    const currentDiagramMessages = ref(null);
    const currentDiagramErrorMessages = ref(null);
    
    async function initializeWorkflowEditor(canvas) {
        if(!canvas) {
            return;
        }

        currentModeler.value = createWorkflowEditor(canvas);
        await importAndProcessDiagram(defaultDiagram);
        currentApiKey.value = (IS_APP_IN_MODE_DEV) ? loadAPIKey() : null;
        getDiagramMessages();
        getDiagramErrorMessages();
        EventBus.emit(EVENT_TYPE.TASK_TYPES_READY, TASK_TYPES);
        EventBus.emit(EVENT_TYPE.GATEWAY_TYPES_READY, GATEWAY_TYPES);
        EventBus.emit(EVENT_TYPE.LOAD_WORKFLOW_JAVA_CLASSES);       
    }

    function registerWorkflowEditorEventHandlers() {
        EventBus.on(EVENT_TYPE.CREATE_NEW_DIAGRAM, createNewDiagram);
        EventBus.on(EVENT_TYPE.UPDATE_ELEMENT, updateElement);    
        EventBus.on(EVENT_TYPE.UPDATE_NAVIGATION_PATH, updateNavigationPath);
        EventBus.on(EVENT_TYPE.LOAD_FILE_SUCCESS, loadDiagramFromLocalFileSystem);
        EventBus.on(EVENT_TYPE.SAVE_DIAGRAM, saveDiagramToSystem);
        EventBus.on(EVENT_TYPE.SAVE_DIAGRAM_DRAFT, saveDiagramToDraft);
        EventBus.on(EVENT_TYPE.DELETE_DIAGRAM_DRAFT, deleteDiagramFromDraft);
        EventBus.on(EVENT_TYPE.DOWNLOAD_DIAGRAM, downloadDiagram);
        EventBus.on(EVENT_TYPE.SET_API_KEY, setApiKey);
        EventBus.on(EVENT_TYPE.LOAD_DIAGRAMS_FROM_SYSTEM, loadAllDiagramsFromSystem);
        EventBus.on(EVENT_TYPE.LOAD_DIAGRAM_FROM_SYSTEM, loadDiagramFromSystem);
        EventBus.on(EVENT_TYPE.LOAD_DIAGRAM_DRAFT_FROM_SYSTEM, loadDiagramDraftFromSystem);
        EventBus.on(EVENT_TYPE.SAVE_LISTENER, saveListener);
        EventBus.on(EVENT_TYPE.SAVE_FORM_PROPERTY, saveFormProperty);
        EventBus.on(EVENT_TYPE.GENERATE_XML_DIAGRAM, generateXMLDiagram);
        EventBus.on(EVENT_TYPE.UPDATE_ELEMENT_TYPE, updateElementType);
        EventBus.on(EVENT_TYPE.UPDATE_ELEMENT_ATTRIBUTE, updateElementAttribute);
        EventBus.on(EVENT_TYPE.UPDATE_ELEMENT_PROPERTY, updateElementProperty);
        EventBus.on(EVENT_TYPE.UPDATE_ELEMENT_CONDITION_EXPRESSION, updateElementConditionExpression);
        EventBus.on(EVENT_TYPE.UPDATE_ELEMENT_DOCUMENTATION, updateElementDocumentation);
        EventBus.on(EVENT_TYPE.LOAD_WORKFLOW_JAVA_CLASSES, getWorkflowJavaClasses);
        EventBus.on(EVENT_TYPE.SAVE_SERVICE_TASK_FIELD, saveServiceTaskFields);
        EventBus.on(EVENT_TYPE.UPDATE_BOUNDARY_EVENT_ELEMENT_PROPERTY, updateBoundaryEventElementProperty);
        EventBus.on(EVENT_TYPE.UPDATE_BOUNDARY_EVENT_ELEMENT_REFERENCE_PROPERTY, updateBoundaryEventElementReferenceProperty);
        EventBus.on(EVENT_TYPE.UPDATE_CATCH_EVENT_ELEMENT_REFERENCE_PROPERTY, updateCatchEventElementReferenceProperty);
        EventBus.on(EVENT_TYPE.SAVE_WORKFLOW_MESSAGE, saveDiagramMessages);
        EventBus.on(EVENT_TYPE.SAVE_WORKFLOW_ERROR_MESSAGE, saveDiagramErrorMessages);
        EventBus.on(EVENT_TYPE.GET_WORKFLOW_MESSAGES, getDiagramMessages);       
        EventBus.on(EVENT_TYPE.GET_WORKFLOW_ERROR_MESSAGES, getDiagramErrorMessages);
        EventBus.on(EVENT_TYPE.UPDATE_CATCH_EVENT_ELEMENT_PROPERTY, updateCatchEventElementProperty);
        EventBus.on(EVENT_TYPE.SAVE_CALL_ACTIVITY_INPUT_PARAMETER, saveCallActivityInputParameter);     
        EventBus.on(EVENT_TYPE.SAVE_CALL_ACTIVITY_OUTPUT_PARAMETER, saveCallActivityOutputParameter);
        EventBus.on(EVENT_TYPE.UPDATE_MULTI_INSTANCE_ELEMENT_PROPERTY, updateMultiInstanceElementProperty);
        EventBus.on(EVENT_TYPE.GET_SCRIPT_CODE, getScriptCode);   
        EventBus.on(EVENT_TYPE.GET_DIAGRAM_DATA, getDiagramData);   
    }

    function unregisterWorkflowEditorEventHandlers() {
        EventBus.off(EVENT_TYPE.SAVE_DIAGRAM);
        EventBus.off(EVENT_TYPE.SAVE_DIAGRAM_DRAFT);
        EventBus.off(EVENT_TYPE.DELETE_DIAGRAM_DRAFT);
        EventBus.off(EVENT_TYPE.DOWNLOAD_DIAGRAM);
        EventBus.off(EVENT_TYPE.CREATE_NEW_DIAGRAM);
        EventBus.off(EVENT_TYPE.UPDATE_ELEMENT);
        EventBus.off(EVENT_TYPE.UPDATE_NAVIGATION_PATH);
        EventBus.off(EVENT_TYPE.LOAD_FILE_SUCCESS);
        EventBus.off(EVENT_TYPE.SET_API_KEY);
        EventBus.off(EVENT_TYPE.LOAD_DIAGRAMS_FROM_SYSTEM);
        EventBus.off(EVENT_TYPE.LOAD_DIAGRAM_FROM_SYSTEM);
        EventBus.off(EVENT_TYPE.LOAD_DIAGRAM_DRAFT_FROM_SYSTEM);
        EventBus.off(EVENT_TYPE.SAVE_LISTENER);
        EventBus.off(EVENT_TYPE.SAVE_FORM_PROPERTY);
        EventBus.off(EVENT_TYPE.GENERATE_XML_DIAGRAM);
        EventBus.off(EVENT_TYPE.UPDATE_ELEMENT_TYPE);
        EventBus.off(EVENT_TYPE.UPDATE_ELEMENT_PROPERTY);
        EventBus.off(EVENT_TYPE.LOAD_WORKFLOW_JAVA_CLASSES);
        EventBus.off(EVENT_TYPE.SAVE_SERVICE_TASK_FIELD);
        EventBus.off(EVENT_TYPE.UPDATE_ELEMENT_CONDITION_EXPRESSION);
        EventBus.off(EVENT_TYPE.UPDATE_ELEMENT_DOCUMENTATION);
        EventBus.off(EVENT_TYPE.UPDATE_BOUNDARY_EVENT_ELEMENT_PROPERTY);
        EventBus.off(EVENT_TYPE.SAVE_WORKFLOW_MESSAGE);
        EventBus.off(EVENT_TYPE.GET_WORKFLOW_MESSAGES);
        EventBus.off(EVENT_TYPE.GET_WORKFLOW_ERROR_MESSAGES);
        EventBus.off(EVENT_TYPE.UPDATE_CATCH_EVENT_ELEMENT_REFERENCE_PROPERTY);
        EventBus.off(EVENT_TYPE.SAVE_CALL_ACTIVITY_INPUT_PARAMETER);     
        EventBus.off(EVENT_TYPE.SAVE_CALL_ACTIVITY_OUTPUT_PARAMETER);
        EventBus.off(EVENT_TYPE.UPDATE_MULTI_INSTANCE_ELEMENT_PROPERTY);
        EventBus.off(EVENT_TYPE.GET_SCRIPT_CODE);
        EventBus.off(EVENT_TYPE.GET_DIAGRAM_DATA);
    }

    async function createNewDiagram() {
        clearWorkflowEditor();
        await importAndProcessDiagram(defaultDiagram);
    }

    function getWorkflowJavaClasses() {
        const javaClasses = getAllInMemoryJavaClasses();
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
        if (IS_APP_IN_MODE_DEV && !apiKeyExists()) {
            return;
        }

        currentSystemDiagrams.value = await SystemService.getAllDiagramsFromSystem(currentApiKey.value);
        EventBus.emit(EVENT_TYPE.SHOW_DIAGRAMS_FROM_SYSTEM, currentSystemDiagrams.value);
    }

    async function loadDiagram(diagram, serviceFunction) {
        if (IS_APP_IN_MODE_DEV && !apiKeyExists()) {
            return;
        }
    
        if (!diagram || !diagram.id) {
            console.error("No valid diagram. Please provide a valid diagram to be loaded from the system.");
            return;
        }
    
        const loadedDiagramContent = await serviceFunction(currentApiKey.value, diagram.id);
        await importAndProcessDiagram(loadedDiagramContent);
        EventBus.emit(EVENT_TYPE.CLOSE_MODAL);
        EventBus.emit(EVENT_TYPE.SHOW_SYSTEM_DRAFT_OPTIONS);
    }

    async function loadDiagramFromSystem(diagram) {
        await loadDiagram(diagram, SystemService.getDiagramByIdFromSystem);
    } 

    async function loadDiagramDraftFromSystem(diagram) {
        await loadDiagram(diagram, DraftService.getDiagramByIdFromDraft);
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
        getDiagramMessages();
        getDiagramErrorMessages();
        currentModeler.value.fitCanvasToDiagram();
    }

    async function getScriptCode(scriptId) {
        if (IS_APP_IN_MODE_DEV && !apiKeyExists()) {
            return;
        }

        if(!scriptId) {
            return;
        }

        const script = await ScriptService.getScriptById(currentApiKey.value, scriptId);
        EventBus.emit(EVENT_TYPE.LOAD_CODE_SCRIPT, script);
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

    async function getDiagramData() { 
        const diagramData = {
            id: `${currentProcessDefinition.value.id}`,
            xmlContent: await currentModeler.value.saveDiagram()
        };

        EventBus.emit(EVENT_TYPE.DIAGRAM_DATA_READY, diagramData);

        return diagramData;
    }

    async function saveDiagram(saveFunction) {
        const {xmlContent} = await getDiagramData();
        const {xml} = xmlContent;
        await saveFunction(currentApiKey.value, xml);
    }

    async function saveDiagramToSystem() {         
        await saveDiagram(SystemService.saveDiagramToSystem);
    }

    async function saveDiagramToDraft() {
        await saveDiagram(DraftService.saveDiagramToDraft);
    }

    async function deleteDiagramFromDraft() {
       await DraftService.deleteDiagramFromDraft( currentApiKey.value, currentProcessDefinition.value.id);
    }

    async function downloadDiagram() {
        const {id, xmlContent} = await getDiagramData();
        downloadWorkflowDiagram(id, xmlContent);
    }

    async function generateXMLDiagram() {
        const {xmlContent} = await getDiagramData();
        const {xml} = xmlContent;
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

    function updateElementConditionExpression(conditionExpressionToUpdate) {
        currentModeler.value.updateElementConditionExpression(conditionExpressionToUpdate);
        EventBus.emit(EVENT_TYPE.GENERATE_XML_DIAGRAM);
    }

    function updateElementDocumentation(documentationToUpdate) {
        currentModeler.value.updateElementDocumentation(documentationToUpdate);
        EventBus.emit(EVENT_TYPE.GENERATE_XML_DIAGRAM);
    }

    function saveServiceTaskFields(serviceTaskToSave) {
        currentModeler.value.saveElementField(serviceTaskToSave);
        EventBus.emit(EVENT_TYPE.GENERATE_XML_DIAGRAM);
    }
    
    function saveDiagramMessages(diagramMessageToSave) {
        currentModeler.value.saveDiagramMessages(diagramMessageToSave);
        getDiagramMessages();
        EventBus.emit(EVENT_TYPE.GENERATE_XML_DIAGRAM);
    }

    function saveDiagramErrorMessages(diagramMessageToSave) {
        currentModeler.value.saveDiagramErrorMessages(diagramMessageToSave);
        getDiagramErrorMessages();
        EventBus.emit(EVENT_TYPE.GENERATE_XML_DIAGRAM);
    }

    function updateBoundaryEventElementProperty(boundaryPropertyToUpdate) {
        currentModeler.value.updateBoundaryEventElementProperty(boundaryPropertyToUpdate);
        EventBus.emit(EVENT_TYPE.GENERATE_XML_DIAGRAM);
    }

    function updateBoundaryEventElementReferenceProperty(boundaryReferencePropertyToUpdate) {
        currentModeler.value.updateBoundaryEventElementReferenceProperty(boundaryReferencePropertyToUpdate);
        EventBus.emit(EVENT_TYPE.GENERATE_XML_DIAGRAM);
    }

    function updateCatchEventElementProperty(catchPropertyToUpdate) {
        currentModeler.value.updateCatchEventElementProperty(catchPropertyToUpdate);
        EventBus.emit(EVENT_TYPE.GENERATE_XML_DIAGRAM);
    }

    function updateCatchEventElementReferenceProperty(catchReferencePropertyToUpdate) {
        currentModeler.value.updateCatchEventElementReferenceProperty(catchReferencePropertyToUpdate);
        EventBus.emit(EVENT_TYPE.GENERATE_XML_DIAGRAM);
    }

    function saveCallActivityInputParameter(inputParamenterToSave) {
        currentModeler.value.saveCallActivityInputParameter(inputParamenterToSave);
        EventBus.emit(EVENT_TYPE.GENERATE_XML_DIAGRAM);
    }

    function saveCallActivityOutputParameter(outputParamenterToSave) {
        currentModeler.value.saveCallActivityOutputParameter(outputParamenterToSave);
        EventBus.emit(EVENT_TYPE.GENERATE_XML_DIAGRAM);
    }

    function getDiagramMessages() {
        currentDiagramMessages.value = currentModeler.value.getDiagramMessages();
        EventBus.emit(EVENT_TYPE.WORKFLOW_MESSAGES_READY, currentDiagramMessages.value);
    }

    function getDiagramErrorMessages() {
        currentDiagramErrorMessages.value = currentModeler.value.getDiagramErrorMessages();
        EventBus.emit(EVENT_TYPE.WORKFLOW_ERROR_MESSAGES_READY, currentDiagramErrorMessages.value);
    }

    function updateMultiInstanceElementProperty(multiIntancePropertyToUpdate) {
        currentModeler.value.updateMultiInstanceElementProperty(multiIntancePropertyToUpdate);
        EventBus.emit(EVENT_TYPE.GENERATE_XML_DIAGRAM);
    }

    function apiKeyExists() {
        if (!currentApiKey.value) {
            console.error("No API key provided. Please provide an API key to load a diagram from the system.");
            return false;
        }
        return true;    
    }

    
  
    return {
        currentModeler,
        currentWorkingElement,
        currentWorkingElementProperties,
        currentNavigationPath,
        currentProcessDefinition,
        currentApiKey,
        currentSystemDiagrams,
        currentDiagramMessages,
        currentDiagramErrorMessages,
        initializeWorkflowEditor,
        destroyWorkflowEditor,
        registerWorkflowEditorEventHandlers,
        unregisterWorkflowEditorEventHandlers,
        generateDiagram,
        clearWorkflowEditor
    };
}   
