export function isValidDiagramWorkflow(xmlString) {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
  
      // Check for XML parsing errors
      const parserErrors = xmlDoc.getElementsByTagName('parsererror');
      if (parserErrors.length > 0) {
        console.error('XML parsing error:', parserErrors[0].textContent);
        return false;
      }
  
      // Validate essential BPMN elements
      const definitions = xmlDoc.getElementsByTagName('definitions')[0];
      if (!definitions) return false;
  
      const process = definitions.getElementsByTagName('process')[0];
      if (!process || !process.getAttribute('id')) return false;
  
      const startEvents = process.getElementsByTagName('startEvent');
      if (startEvents.length === 0) return false;
  
      const bpmnDiagram = xmlDoc.getElementsByTagNameNS('*', 'BPMNDiagram')[0];
      const bpmnPlane = xmlDoc.getElementsByTagNameNS('*', 'BPMNPlane')[0];
  
      if (!bpmnDiagram || !bpmnPlane) return false;
  
      return true;
    } catch (error) {
      console.error('Validation failed:', error);
      return false;
    }
  }