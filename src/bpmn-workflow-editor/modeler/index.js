import BpmnModeler from 'bpmn-js/lib/Modeler';
import activitiModelDefinitions from '../activiti-model-definitions';
import WorkflowEditorPaletteProvider from '../workflow-editor-palette-provider';
import defaultDiagram from '../diagrams/default-diagram';

export function createWorkflowEditor(container) {

    const engine = new BpmnModeler({
        container: container,
        moddleExtensions: {
            activiti: activitiModelDefinitions
        },
        additionalModules: ['type', WorkflowEditorPaletteProvider]
    });

    const canvas = engine.get('canvas');
    const workflowEventBus = engine.get('eventBus');
    const factory = engine.get('bpmnFactory');


    async function importDiagram(xmlDiagram) {
        if(isDiagramValid(xmlDiagram)) {
            try {
                return await engine.importXML(xmlDiagram);
            } catch (error) {
                console.error("Error during diagram import:", error);
                throw error;
            }
        }        
    }

    async function saveDiagram(xmlDiagram) {
        if(isDiagramValid(xmlDiagram)) {
            try {
                return await engine.saveXML(xmlDiagram);
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

    if(defaultDiagram) {
        importDiagram(defaultDiagram);
    }

    return {
        modeler: engine,
        canvas,
        factory,
        workflowEventBus,
        importDiagram,
        saveDiagram     
    };
}
