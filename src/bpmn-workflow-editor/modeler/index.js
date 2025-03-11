import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import BpmnModeler  from 'bpmn-js/lib/Modeler';
import activitiModelDefinitions from '../activiti-model-definitions';
import WorkflowEditorPaletteProvider from '../workflow-editor-palette-provider';
import defaultDiagram from '../diagrams/default-diagram';

export function createWorkflowEditor(container) {

    const modeler = createWorkflowEditor(container);
    handleModelerEvents(modeler);
    handleWorkflowEditorSelectionEvents(modeler);
    handleWorkflowElementEvents(modeler);
    handleWorkflowSubprocessNavigationEvents(modeler);
    

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

    function handleModelerEvents(modeler) {
        modeler.on('import.done', (event) => {
            console.log('import.done', event);
        });

        modeler.on('save.done', (event) => {
            console.log('save.done', event);
        });   
    }

    function handleWorkflowEditorSelectionEvents(modeler) {
        const workflowEventBus = modeler.get('eventBus');

        workflowEventBus.on('selection.changed', (event) => {
            console.log('selection.changed', event);
        });

        workflowEventBus.on('selection.cleared', (event) => {
            console.log('selection.cleared', event);
        });
    }

    function handleWorkflowElementEvents(modeler) {
        const workflowEventBus = modeler.get('eventBus');

        workflowEventBus.on('element.changed', (event) => {
            console.log('element.changed', event);
        });

        workflowEventBus.on('element.add', (event) => {
            console.log('element.add', event);
        });

        workflowEventBus.on('element.added', (event) => {
            console.log('element.added', event);
        });

        workflowEventBus.on('element.removed', (event) => {
            console.log('element.removed', event);
        });       
    }

    function handleWorkflowSubprocessNavigationEvents(modeler) {
        const workflowEventBus = modeler.get('eventBus');

        workflowEventBus.on('subprocess.expanded', (event) => {
            console.log('subprocess.expanded', event);
        });

        workflowEventBus.on('subprocess.collapsed', (event) => {
            console.log('subprocess.collapsed', event);
        });

        workflowEventBus.on('subprocess.clicked', (event) => {
            console.log('subprocess.clicked', event);
        }); 

        workflowEventBus.on('root.set', (event) => {
            console.log('root.set', event);
        }); 

        workflowEventBus.on('root.unset', (event) => {
            console.log('root.unset', event);
        }); 

        workflowEventBus.on('root.changed', (event) => {
            console.log('root.changed', event);
        });      
        
    }

    function getModelerElements(modeler) {
        return {
            modeler,
            canvas: modeler.get('canvas'),
            workflowEventBus: modeler.get('eventBus'),
            factory: modeler.get('bpmnFactory')
        };
    }

    return {
        modeler,
        importDiagram,
        saveDiagram     
    };
}
