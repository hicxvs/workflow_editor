import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import BpmnModeler  from 'bpmn-js/lib/Modeler';
import activitiModelDefinitions from '../activiti-model-definitions';
import WorkflowEditorPaletteProvider from '../workflow-editor-palette-provider';
import { modelerEventsHandler } from './eventHandlers/modelerEventsHandler';
import { workflowEditorSelectionEventsHandler } from './eventHandlers/workflowEditorSelectionEventsHandler';
import { workflowElementEventsHandler } from './eventHandlers/workflowElementEventsHandler';
import { workflowSubprocessNavigationEventsHandler } from './eventHandlers/workflowSubprocessNavigationEventsHandler';


export function createWorkflowEditor(container) {

    const modeler = createWorkflowEditor(container);
    const elementRegistry = modeler.get('elementRegistry');
    const canvas = modeler.get('canvas');
    const palette = modeler.get('palette');
    const translate = modeler.get('translate');
    const moddle = modeler.get('moddle');
    const factory = modeler.get('bpmnFactory');
    const modeling = modeler.get('modeling');
    const rules = modeler.get('bpmnRules');

    modelerEventsHandler(modeler);
    workflowEditorSelectionEventsHandler(modeler);
    workflowElementEventsHandler(modeler);
    workflowSubprocessNavigationEventsHandler(modeler);

    async function importDiagram(xmlDiagram) {
        if(!xmlDiagram) {
            console.error("Error: XML diagram is not provided or is undefined.");
            return false;
        }

        try {
            return await modeler.importXML(xmlDiagram);
        } catch (error) {
            console.error("Error during diagram import:", error);
            throw error;
        }       
    }

    async function generateDiagram() {
        try {
            return await modeler.saveXML({format: true});
        } catch (error) {
            console.error("Error during generating the XML Diagram:", error);
            throw error;
        }   
    }

    async function saveDiagram() {
        try {
            return await modeler.saveXML({format: true});
        } catch (error) {
            console.error("Error during saving the XML diagram:", error);
            throw error;
        }    
    }

    function clearDiagram() {
        try {
            modeler.clear();
        } catch (error) {
            console.error("Error during clearing the diagram:", error);
            throw error;
        }
    }

    function createWorkflowEditor(container){
        try {
            return new BpmnModeler({
                container: container,
                moddleExtensions: {
                    activiti: activitiModelDefinitions
                },
                additionalModules: [{
                    paletteProvider: ['type', WorkflowEditorPaletteProvider]
                }]
            });
        } catch (error) {
            console.error("Error during workflow editor initialization:", error);
            throw error;
        }
    }

    function getProcessDefinition() {
        if(!modeler) {
            console.error("Error: Workflow editor is not initialized.");
            return null;
        }

        const elementRegistry = modeler.get('elementRegistry');
        const elements = elementRegistry.getAll();

        for(let i = 0; i < elements.length; i++) {
            const tempElement = elements[i];
            if(tempElement.type === 'bpmn:Process') {
                return tempElement.businessObject;
            }
        }

        console.warn("WARNING: Workflow editor process definition not found.");
        return null;
    }

    function saveListener(listener) {
        if(!modeler) {
            console.error("Error: Workflow editor is not initialized.");
            return null;
        }

        if(!listener) {
            console.error("Error: Listeners not provided.");
            return null;
        }

        const createdListener = factory.create(listener.$type, listener);
        const cm = modeler;
        
        debugger;
    }

    function fitCanvasToDiagram() {
        if(!modeler) {
            console.error("Error: Workflow editor is not initialized.");
            return null;
        }

        const { inner } = canvas.viewbox();

        const center = {
            x: inner.x + inner.width / 2,
            y: inner.y + inner.height / 2
        };

        canvas.zoom("fit-viewport", center);
    }

    return {
        modeler,
        elementRegistry,
        canvas,
        palette,
        translate,
        moddle,
        factory,
        modeling,
        rules,
        importDiagram,
        generateDiagram,
        saveDiagram,
        clearDiagram,
        getProcessDefinition,
        saveListener,
        fitCanvasToDiagram
    };
}
