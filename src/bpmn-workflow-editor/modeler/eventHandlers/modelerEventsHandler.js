export function modelerEventsHandler(modeler) {

    modeler.on('import.parse.start', (event) => {
        const {xml} = event;
        return processBPMNXML(xml);
    });

    modeler.on('import.parse.complete', (event) => {
        console.log('import.parse.complete', event);
    });

    modeler.on('import.done', (event) => {
        console.log('import.done', event);
    });

    modeler.on('import.error', (event) => {
        console.log('import.error', event);
    });

    modeler.on('save.done', (event) => {
        console.log('save.done', event);
    });
    

    function processBPMNXML(xmlString) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    
        // Check for parsing errors
        if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
            console.error("Error parsing XML");
            return null;
        }
    
        const definitionsElement = xmlDoc.documentElement;
        const defaultNamespace = definitionsElement.namespaceURI; // Get the default namespace URI
    
        // Utility function to find existing elements based on tag and attributes
        const findElement = (tagName, attributes) => {
            return Array.from(xmlDoc.getElementsByTagName(tagName)).find(el =>
                Object.keys(attributes).every(attr => el.getAttribute(attr) === attributes[attr])
            );
        };
    
        // Helper function to create an element with attributes in the correct namespace
        const createElementNS = (tagName, attributes) => {
            const element = xmlDoc.createElementNS(defaultNamespace, tagName);
            Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
            return element;
        };
    
        // Check all error references in the process and ensure they are defined
        const errorRefs = Array.from(xmlDoc.getElementsByTagName("errorEventDefinition"))
            .map(definition => definition.getAttribute("errorRef"))
            .filter(ref => ref); // Filter out null/undefined
    
        errorRefs.forEach(errorRef => {
            if (!findElement("error", { id: errorRef })) {
                const newError = createElementNS("error", { id: errorRef, name: `Generated Error - ${errorRef}` });
                definitionsElement.appendChild(newError);
            }
        });
    
        // Check all message references and ensure they are defined
        const messageRefs = Array.from(xmlDoc.getElementsByTagName("messageEventDefinition"))
            .map(definition => definition.getAttribute("messageRef"))
            .filter(ref => ref); // Filter out null/undefined
    
        messageRefs.forEach(messageRef => {
            if (!findElement("message", { id: messageRef })) {
                const newMessage = createElementNS("message", { id: messageRef, name: `Generated Message - ${messageRef}` });
                definitionsElement.appendChild(newMessage);
            }
        });
    
        // Serialize the updated XML back into a string
        const serializer = new XMLSerializer();
        return serializer.serializeToString(xmlDoc);
    }
            
}
