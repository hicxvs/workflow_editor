import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import BpmnModeler  from 'bpmn-js/lib/Modeler';
import activitiModelDefinitions from '../activiti-model-definitions';
import WorkflowEditorPaletteProvider from '../workflow-editor-palette-provider';
import defaultDiagram from '../diagrams/default-diagram';
import { modelerEventsHandler } from './eventHandlers/modelerEventsHandler';
import { workflowEditorSelectionEventsHandler } from './eventHandlers/workflowEditorSelectionEventsHandler';
import { workflowElementEventsHandler } from './eventHandlers/workflowElementEventsHandler';
import { workflowSubprocessNavigationEventsHandler } from './eventHandlers/workflowSubprocessNavigationEventsHandler';


export function createWorkflowEditor(container) {

    const modeler = createWorkflowEditor(container);
    modelerEventsHandler(modeler);
    workflowEditorSelectionEventsHandler(modeler);
    workflowElementEventsHandler(modeler);
    workflowSubprocessNavigationEventsHandler(modeler);
    

    if(defaultDiagram) {
        importDiagram(defaultDiagram);
    }    

    async function importDiagram(xmlDiagram) {
        if(isDiagramValid(xmlDiagram)) {
            try {
                return await modeler.importXML(xmlDiagram);
            } catch (error) {
                console.error("Error during diagram import:", error);
                throw error;
            }
        }        
    }

    async function saveDiagram(xmlDiagram) {
        if(isDiagramValid(xmlDiagram)) {
            try {
                return await modeler.saveXML(xmlDiagram);
            } catch (error) {
                console.error("Error during diagram save:", error);
                throw error;
            }   
        }   
    }

    function isDiagramValid(xmlDiagram) {
        if(!xmlDiagram) {
            console.error("Error: XML diagram is not provided or is undefined.");
            return false;
        }        
        return true;
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

    return {
        modeler,
        importDiagram,
        saveDiagram     
    };
}
