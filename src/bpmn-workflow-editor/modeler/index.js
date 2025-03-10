import BpmnModeler from 'bpmn-js/lib/Modeler';
import activitiModelDefinitions from '../activiti-model-definitions';
import WorkflowEditorPaletteProvider from '../workflow-editor-palette-provider';
import defaultDiagram from '../diagrams/default-diagram';

export function createWorkflowEditorModeler(container, initialDiagram) {

    const engine = new BpmnModeler({
        container: container,
        moddleExtensions: {
            activiti: activitiModelDefinitions
        },
        additionalModules: ['type', WorkflowEditorPaletteProvider]
    });

    if(!initialDiagram) {
        engine.importXML(defaultDiagram);
    }
    else {
        engine.importXML(initialDiagram);
    }

    return {
        modeler: engine,
        canvas: engine.get('canvas'),
        factory: engine.get('bpmnFactory'),
        eventBus: engine.get('eventBus'),
        importXML: engine.importXML,
        saveXML: engine.saveXML,
        save: engine.save,
        getDiagram: engine.getDiagram        
    };
}
