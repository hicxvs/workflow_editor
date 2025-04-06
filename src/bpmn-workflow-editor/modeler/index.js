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
    const replace = modeler.get('bpmnReplace');
 
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

    function saveFormProperty(elementProperties, formProperties) {
        if(!modeler) {
            console.error("Error: Workflow editor is not initialized.");
            return null;
        }

        if(!elementProperties || !formProperties) {
            console.error("Error: ElementPorperties and/or Listeners are not provided.");
            return null;
        }

        manageExtensionElements(elementProperties);
        createFormProperties(elementProperties, formProperties);
    }


    function saveListener(elementProperties, listeners) {
        if(!modeler) {
            console.error("Error: Workflow editor is not initialized.");
            return null;
        }

        if(!elementProperties || !listeners) {
            console.error("Error: ElementPorperties and/or Listeners are not provided.");
            return null;
        }

        manageExtensionElements(elementProperties);
        createListeners(elementProperties, listeners);
    }

    function manageExtensionElements(elementProperties) {

        let extensionElements = elementProperties?.extensionElements;

        if(!extensionElements || !extensionElements.values) {
            const newExtensionElements = moddle.create('bpmn:ExtensionElements', {
                values: []
            });

            newExtensionElements.$parent = elementProperties;
            extensionElements = newExtensionElements;            
        }
       
        elementProperties.extensionElements = extensionElements;
    }

    function createFormProperties(elementProperties, formProperties) {

        if(!formProperties || !formProperties.length) {
            return;
        }

        const itemsCollection = elementProperties.extensionElements.values;
        const untargetedItems = getUntargetedItems(itemsCollection, formProperties[0].type);
        const newFormProperties = createNewFormProperties(elementProperties, formProperties);       
        elementProperties.extensionElements.values = [...untargetedItems, ...newFormProperties];       
    }

    function createNewFormProperties(elementProperties, formProperties) {

        const defaultFalse = 'False';
        const defaultType = 'Boolean';

        return formProperties.map(formProperty => {
            const formPropertyItem = formProperty.formProperty;
        
            const newFormProperty = moddle.create(formPropertyItem.$type, {
                id: formPropertyItem.id || '',
                name: formPropertyItem.name || '',
                type: formPropertyItem.type || defaultType,
                expression: formPropertyItem.expression || '',
                variable: formPropertyItem.variable || '',
                pattern: formPropertyItem.pattern || '',
                formValue: formPropertyItem.formValue || '',
                default: formPropertyItem.default || defaultFalse,
                required: formPropertyItem.required || defaultFalse,
                readable: formPropertyItem.readable || defaultFalse,
                writable: formPropertyItem.writable || defaultFalse
            });
        
            newFormProperty.$parent = elementProperties;
            return newFormProperty;
        });
    }


    function createListeners(elementProperties, listeners) {

        if(!listeners || !listeners.length) {
            return;
        }

        const itemsCollection = elementProperties.extensionElements.values;
        const untargetedItems = getUntargetedItems(itemsCollection, listeners[0].type);
        const newListeners = createNewListeners(elementProperties, listeners);
        elementProperties.extensionElements.values = [...untargetedItems, ...newListeners];        
    }

    function createNewListeners(elementProperties, listeners) {
        return listeners.map(listener => {
            const listenerItem = listener.listener;        
            const newListener = createNewListener(elementProperties, listenerItem);
            return newListener;
        });
    }

    function createNewListener(elementProperties, listenerItem) {
        const listener = moddle.create(listenerItem.$type, {
            class: listenerItem.class || '',
            event: listenerItem.event || '',
            expression: listenerItem.expression || '',
            fields: createListenerFields(listenerItem)
        });

        listener.$parent = elementProperties;
        return listener;
    }

    function createListenerFields(listenerItem) {
        const fields = listenerItem?.fields;

        if(!fields || !fields.length) {
            return;
        }

        return fields.map(field => {
            const newField = moddle.create(field.$type, field);
            newField.$parent = listenerItem;
            return newField;
        });
    }
    
    function getUntargetedItems(collection, targetType) {
        return collection.filter(item => item.$type !== `activiti:${targetType}`);
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

    function updateElementType(selectedType) {
        try {
            const element = elementRegistry.get(selectedType.elementId);
    
            if (!element) {
                console.error('Element not found');
                return;
            }
    
            replace.replaceElement(element, {
                [selectedType.elementField]: selectedType.elementType
            });
        } 
        catch (error) {
            console.error(error);
        }
    }
       
    function updateElementAttribute(selectedAttribute) {
        try {
            const {element, businessObject} = getElementAndBusinessObject(selectedAttribute);
    
            if (!businessObject.$attrs) {
                businessObject.$attrs = {};
            }
    
            businessObject.$attrs[selectedAttribute.elementProperty] = selectedAttribute.elementPropertyValue;
            modeling.updateProperties(element, {});
        } catch (error) {
            console.error(error);
        }
    }

    function updateElementProperty(selectedProperty) {
        try  {    
            const {element, businessObject} = getElementAndBusinessObject(selectedProperty);
            businessObject[selectedProperty.elementProperty] = selectedProperty.elementPropertyValue;
            modeling.updateProperties(element, {});
        } catch (error) {
            console.error(error);
        }        
    }

    function updateElementConditionExpression(conditionExpressionToUpdate) {
        try{
            const {element, businessObject} = getElementAndBusinessObject(conditionExpressionToUpdate);
                        
            if (!businessObject.conditionExpression) {
                businessObject.conditionExpression = createConditionExpression(element, conditionExpressionToUpdate.elementPropertyValue);
                modeling.updateProperties(element, {});
                return;
            }

            businessObject.conditionExpression.body = conditionExpressionToUpdate.elementPropertyValue;
            modeling.updateProperties(element, {});
        } catch (error) {
            console.error(error);
        }
    }

    function updateElementDocumentation(documentationToUpdate) {
        try {
            const {element, businessObject} = getElementAndBusinessObject(documentationToUpdate);
            const documentation = createDocumentation(element, documentationToUpdate.elementPropertyValue);
            businessObject[documentationToUpdate.elementProperty] = [documentation];
            modeling.updateProperties(element, {});
        } catch(error) {
            console.error(error);
        }
    }

    function getElementAndBusinessObject(selectedDetails) {
        try {
            if (!selectedDetails.elementId || !selectedDetails.elementProperty || selectedDetails.elementPropertyValue === undefined) {
                console.error('Invalid property details');
                return;
            }
    
            const element = elementRegistry.get(selectedDetails.elementId);

            if(!element) {
                console.error('Element not found!');
                return;
            }

            if(!element.businessObject) {
                console.error("Element's business object no found!");
                return;
            }
    
            return {
                element: element,
                businessObject: element?.businessObject,
            };

        } catch(error) {
            console.error(error);
        }
    }

    function saveElementField(selectedElement) {
        try{    
            const parentElement = elementRegistry.get(selectedElement.$parent.id);

            if (!parentElement) {
                console.error('Element not found');
                return;
            }

            selectedElement.values = createElementFields(selectedElement, selectedElement.values);
            modeling.updateProperties(parentElement, {});

        } catch (error) {
            console.error(error);
        }
    }

    function createElementFields(selectedElement, fieldsCollectionToCreate) {
        const fields = fieldsCollectionToCreate;

        if(!fields || !fields.length) {
            return;
        }

        return fields.map(field => {
            const newField = moddle.create(field.$type, field);
            newField.$parent = selectedElement;
            return newField;
        });
    }

    function createConditionExpression(selectedElement, expressionBody) {
        const conditionExpression = moddle.create('bpmn:FormalExpression', {
            body: expressionBody
        });
        conditionExpression.$parent = selectedElement;
        return conditionExpression;
    }

    function createDocumentation(selectedElement, content) {
        const documentation = moddle.create('bpmn:Documentation', {
            text: content
        });
        documentation.$parent = selectedElement;
        return documentation;
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
        saveFormProperty,
        fitCanvasToDiagram,
        updateElementType,
        updateElementAttribute,
        updateElementProperty,
        updateElementConditionExpression,
        updateElementDocumentation,
        saveElementField
    };
}
