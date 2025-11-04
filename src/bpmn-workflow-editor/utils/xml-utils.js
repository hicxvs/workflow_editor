export function XMLUtils() {

    function removeActivitiPropertyFieldType(xmlString) {
        const parser = new DOMParser();
        const serializer = new XMLSerializer();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");
        
        // Find all extensionElements tags
        const extensionElementsList = xmlDoc.getElementsByTagName("extensionElements");
        
        for (let i = 0; i < extensionElementsList.length; i++) {
            const extension = extensionElementsList[i];
        
            // Loop through all child elements of extensionElements
            for (let j = 0; j < extension.children.length; j++) {
                const child = extension.children[j];
        
                // Remove $type attribute if it exists and equals "activiti:Field"
                if (child.hasAttribute("$type") && child.getAttribute("$type") === "activiti:Field") {
                    child.removeAttribute("$type");
                }
            }
        }
        
        return serializer.serializeToString(xmlDoc);
    }

    return {
        removeActivitiPropertyFieldType
    };
}