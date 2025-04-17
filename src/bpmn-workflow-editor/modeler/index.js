import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import BpmnModeler  from 'bpmn-js/lib/Modeler';
import activitiModelDefinitions from '../activiti-model-definitions';
import WorkflowEditorPaletteProvider from '../workflow-editor-palette-provider';
import { modelerEventsHandler } from './eventHandlers/modelerEventsHandler';
import { workflowEditorSelectionEventsHandler } from './eventHandlers/workflowEditorSelectionEventsHandler';
import { workflowElementEventsHandler } from './eventHandlers/workflowElementEventsHandler';
import { workflowSubprocessNavigationEventsHandler } from './eventHandlers/workflowSubprocessNavigationEventsHandler';
import { ELEMENT_TYPES } from './modelerTypes/elementTypes';
import { PROCESS_TYPES } from './modelerTypes/processTypes';
import { EVENT_DEFINITION_TYPES } from './modelerTypes/eventDefinitionTypes';

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
            if(tempElement.type === PROCESS_TYPES.PROCESS) {
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
            const newExtensionElements = moddle.create(ELEMENT_TYPES.EXTENTION_ELEMENTS, {
                values: []
            });

            newExtensionElements.$parent = elementProperties;
            extensionElements = newExtensionElements;
            return;            
        }
       
        elementProperties.extensionElements = extensionElements;
    }

    function createFormProperties(element, formProperties) {

        if(!formProperties || !formProperties.length) {
            return;
        }

        const itemsCollection = element.extensionElements.values;
        const untargetedItems = getUntargetedItems(itemsCollection, formProperties[0].type);
        const newFormProperties = createNewFormProperties(element, formProperties); 
        element.extensionElements.values = [...untargetedItems, ...newFormProperties];     
    }

    function createNewFormProperties(element, formProperties) {

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
                formValue: createFormValues(element, formPropertyItem.formValue),
                default: formPropertyItem.default || defaultFalse,
                required: formPropertyItem.required || defaultFalse,
                readable: formPropertyItem.readable || defaultFalse,
                writable: formPropertyItem.writable || defaultFalse
            });
        
            newFormProperty.$parent = element;
            return newFormProperty;
        });
    }

    function createFormValues(element, formValuesCollection) {

        if(!formValuesCollection || !formValuesCollection.length) {
            return;
        }

        return formValuesCollection.map(formValue => {
            const newFormValue = moddle.create(`${formValue.$type}`, {
                id: formValue.id || '',
                name: formValue.name || ''
            });

            newFormValue.$parent = element;
            return newFormValue;
        });
    }

    function createListeners(element, listeners) {

        if(!listeners || !listeners.length) {
            return;
        }

        const itemsCollection = element.extensionElements.values;
        const untargetedItems = getUntargetedItems(itemsCollection, listeners[0].type);
        const newListeners = createNewListeners(element, listeners);
        element.extensionElements.values = [...untargetedItems, ...newListeners];        
    }

    function createNewListeners(element, listeners) {
        return listeners.map(listener => {
            const listenerItem = listener.listener;        
            const newListener = createNewListener(element, listenerItem);
            return newListener;
        });
    }

    function createNewListener(element, listenerItem) {
        const listener = moddle.create(listenerItem.$type, {
            class: listenerItem.class || '',
            event: listenerItem.event || '',
            expression: listenerItem.expression || '',
            fields: createListenerFields(listenerItem)
        });

        listener.$parent = element;
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
        } catch(error) {
            const local = 'updateElementType';
            console.error(local,error);
            throw new Error(local,error); 
        }
    }
       
    function updateElementAttribute(selectedAttribute) {
        if(!validatePropertyObject(selectedAttribute)) {
            return;
        }

        try {
            const {element, businessObject} = getElementAndBusinessObject(selectedAttribute);
    
            if (!businessObject.$attrs) {
                businessObject.$attrs = {};
            }
    
            businessObject.$attrs[selectedAttribute.elementProperty] = selectedAttribute.elementPropertyValue;
            modeling.updateProperties(element, {});
        } catch(error) {
            const local = 'updateElementAttribute';
            console.error(local,error);
            throw new Error(local,error); 
        }
    }

    function updateElementProperty(selectedProperty) {
        try  {    
            const {element, businessObject} = getElementAndBusinessObject(selectedProperty);
            businessObject[selectedProperty.elementProperty] = selectedProperty.elementPropertyValue;
            modeling.updateProperties(element, {});
        } catch(error) {
            const local = 'updateElementProperty';
            console.error(local,error);
            throw new Error(local,error); 
        }      
    }

    function updateElementConditionExpression(conditionExpressionToUpdate) {
        if(!validatePropertyObject(conditionExpressionToUpdate)) {
            return;
        }

        try {
            const {element, businessObject} = getElementAndBusinessObject(conditionExpressionToUpdate);
                        
            if (!businessObject.conditionExpression) {
                businessObject.conditionExpression = createConditionExpression(element, conditionExpressionToUpdate.elementPropertyValue);
                modeling.updateProperties(element, {});
                return;
            }

            businessObject.conditionExpression.body = conditionExpressionToUpdate.elementPropertyValue;
            modeling.updateProperties(element, {});

        } catch(error) {
            const local = 'updateElementConditionExpression';
            console.error(local,error);
            throw new Error(local,error); 
        }
    }

    function updateElementDocumentation(documentationToUpdate) {
        if(!validatePropertyObject(documentationToUpdate)) {
            return;
        }

        try {
            const {element, businessObject} = getElementAndBusinessObject(documentationToUpdate);
            const documentation = createDocumentation(element, documentationToUpdate.elementPropertyValue);
            businessObject[documentationToUpdate.elementProperty] = [documentation];
            modeling.updateProperties(element, {});
        } catch(error) {
            const local = 'updateElementDocumentation';
            console.error(local,error);
            throw new Error(local,error); 
        }
    }

    function updateBoundaryEventElementProperty(boundaryPropertyToUpdate) {
        if(!validatePropertyObject(boundaryPropertyToUpdate)) {
            return;
        }

        try {
            const element = getSelectedFlowElement(boundaryPropertyToUpdate);

            if(!element) {
                console.error('Element not found!');
                return;
            }

            element[boundaryPropertyToUpdate.elementProperty] = null;
            element[boundaryPropertyToUpdate.elementProperty] = boundaryPropertyToUpdate.elementPropertyValue;
            updateElementProperty(boundaryPropertyToUpdate);
        
        } catch(error) {
            const local = 'updateBoundaryEventElementProperty';
            console.error(local,error);
            throw new Error(local,error); 
        }        
    }

    function updateCatchEventElementProperty(catchPropertyToUpdate) {
        if(!validatePropertyObject(catchPropertyToUpdate)) {
            return;
        }

        try {
            const element = getSelectedFlowElement(catchPropertyToUpdate);

            if(!element) {
                console.error('Element not found!');
                return;
            }

            if(!element.eventDefinitions || !element.eventDefinitions.length) {
                element.eventDefinitions = [createTimerEventDefinition(element)];
            }

            element.eventDefinitions[0][catchPropertyToUpdate.elementProperty] = null;
            element.eventDefinitions[0][catchPropertyToUpdate.elementProperty] = createExpressionElement(element, catchPropertyToUpdate.elementPropertyValue);

        } catch(error) {
            const local = 'updateBoundaryEventElementProperty';
            console.error(local,error);
            throw new Error(local,error); 
        }           
    }
    
    function saveCallActivityInputParameter(inputParamenterToSave) {
        saveCallActivityParameter(inputParamenterToSave);
    }  

    function saveCallActivityOutputParameter(outputParamenterToSave) {
        saveCallActivityParameter(outputParamenterToSave);
    }

    function saveCallActivityParameter(parameterToSave) {
        if (!validatePropertyObject(parameterToSave)) {
            return;
        }
    
        try {

            const element = getSelectedFlowElement(parameterToSave);
            manageExtensionElements(element);
    
            const itemsCollection = element.extensionElements.values;
            const type = parameterToSave.elementPropertyValue[0].$type.split(':')[1];
            const untargetedItems = getUntargetedItems(itemsCollection, type);
            const newParameters = createCallActivityParameters(element, parameterToSave.elementPropertyValue);
            element.extensionElements.values = [...untargetedItems, ...newParameters];
    
        } catch (error) {
            const local = 'saveCallActivityParameter';
            console.error(local, error);
            throw new Error(local, error);
        }
    }

    function createCallActivityParameters(element, callActivityParameters) {        
        return callActivityParameters.map(callActivityParameter => {
            const newCallActivityParameter = createCallActivityParameter(callActivityParameter);
            newCallActivityParameter.$parent = element;
            return newCallActivityParameter;
        });
    }

    function createCallActivityParameter(callActivityParameter) {
        return moddle.create(callActivityParameter.$type, {
            source: callActivityParameter?.source || '',
            sourceExpression: callActivityParameter?.sourceExpression || '',
            target: callActivityParameter?.target || '',
            targetExpression: callActivityParameter?.targetExpression || '',
        });
    }

    function updateBoundaryEventElementReferenceProperty(boundaryReferencePropertyToUpdate) {
        updateEventElementReferenceProperty(boundaryReferencePropertyToUpdate);
    }


    function updateCatchEventElementReferenceProperty(catchReferencePropertyToUpdate) {
        updateEventElementReferenceProperty(catchReferencePropertyToUpdate);
    }

    function updateEventElementReferenceProperty(referencePropertyToUpdate) {
        if(!validatePropertyObject(referencePropertyToUpdate)) {
            return;
        }

        try {
            const element = getSelectedFlowElement(referencePropertyToUpdate);
    
            if (!element) {
                console.error('Element not found!');
                return;
            }
        
            const messages = getDiagramMessages();
        
            if (!messages || !messages.length) {
                return;
            }
        
            const selectedMessage = messages.find(message => message.id === referencePropertyToUpdate.elementPropertyValue);
        
            if (!selectedMessage) {
                return;
            }
        
            element.eventDefinitions[0][referencePropertyToUpdate.elementProperty] = selectedMessage;

        } catch(error) {
            const local = 'updateEventElementReferenceProperty';
            console.error(local,error);
            throw new Error(local,error); 
        }        
    }
    

    function getSelectedFlowElement(selectedDetails) {
        const processDefinition = getProcessDefinition();

        if(!processDefinition.flowElements || !processDefinition.flowElements.length) {
            return;
        }

        return processDefinition.flowElements.find(flowEvent => flowEvent.id === selectedDetails.elementId);
    }

    function getElementAndBusinessObject(selectedDetails) {
        if(!validatePropertyObject(selectedDetails)) {
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

    function createConditionExpression(selectedElement, conditionExpressionBody) {
        return createElement(selectedElement, ELEMENT_TYPES.FORMAL_EXPRESSION, { body: conditionExpressionBody });;
    }

    function createExpressionElement(selectedElement, expressionBody) {
        return createElement(selectedElement, ELEMENT_TYPES.EXPRESSION, { body: expressionBody });
    }

    function createDocumentation(selectedElement, content) {
        return createElement(selectedElement, ELEMENT_TYPES.DOCUMENTATION, { text: content });
    }

    function createTimerEventDefinition(selectedElement) {
        return createElement(selectedElement, EVENT_DEFINITION_TYPES.TIMER_EVENT_DEFINITION, {});
    }

    function createElement(selectedElement, elementType, elementProperties) {
        const element = moddle.create(elementType, elementProperties);
        element.$parent = selectedElement;
        return element;
    }

    function getDiagramRootElements() {
        return modeler.getDefinitions()?.rootElements || null;
    }

    function getDiagramMessages() {
        return getMessagesByType(ELEMENT_TYPES.MESSAGE);
    }

    function getDiagramErrorMessages() {
        return getMessagesByType(ELEMENT_TYPES.ERROR);
    }

    function getMessagesByType(MessageType) {
        const rootElements = getDiagramRootElements();

        if(!rootElements) {
            return;
        }

        return rootElements.filter(element => element.$type === MessageType) || [];
    }

    function saveDiagramMessages(diagramMessagesToSave) {
        saveDiagramElements(diagramMessagesToSave, ELEMENT_TYPES.MESSAGE, diagramMessage =>
            createDiagramElement(diagramMessage, ELEMENT_TYPES.MESSAGE)
        );
    }
    
    function saveDiagramErrorMessages(diagramErrorMessagesToSave) {
        saveDiagramElements(diagramErrorMessagesToSave, ELEMENT_TYPES.ERROR, diagramErrorMessage =>
            createDiagramElement(diagramErrorMessage, ELEMENT_TYPES.ERROR)
        );
    }

    function createDiagramElement(diagramElementToCreate, elementType) {
        return moddle.create(elementType, {
            id: diagramElementToCreate.id,
            name: diagramElementToCreate.name
        });
    }

    function saveDiagramElements(diagramElementsToSave, elementType, createElementFunction) {
        const definitions = modeler.getDefinitions();
    
        const elements = diagramElementsToSave.map(diagramElement => {
            const newElement = createElementFunction(diagramElement);
            newElement.$parent = definitions;
            return newElement;
        });
    
        const rootElements = getDiagramRootElements();
        const rootElementsWithoutSpecificElements = rootElements.filter(element => element.$type !== elementType);
        modeler.getDefinitions().rootElements = [...rootElementsWithoutSpecificElements, ...elements];
    }

    function validatePropertyObject(propertyObjectToUpdate) {
        if (
            !propertyObjectToUpdate ||
            !propertyObjectToUpdate.elementId ||
            !propertyObjectToUpdate.elementProperty ||
            propertyObjectToUpdate.elementPropertyValue === undefined
        ) {
            console.error('Invalid propertyObjectToUpdate object:', propertyObjectToUpdate);
            return false;
        }
        return true;
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
        saveElementField,
        updateBoundaryEventElementProperty,
        updateBoundaryEventElementReferenceProperty,
        updateCatchEventElementProperty,
        updateCatchEventElementReferenceProperty,
        getDiagramRootElements,
        getDiagramMessages,
        getDiagramErrorMessages,
        saveDiagramMessages,
        saveDiagramErrorMessages,
        saveCallActivityInputParameter,
        saveCallActivityOutputParameter
    };
}
