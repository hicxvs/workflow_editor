export const AI_DIAGRAM_REQUEST_BASE_PROMPTS = Object.freeze({
  DIAGRAM_WORKFLOW: {
    GENERATE: `As an expert in BPMN 2.0 and Activiti 5, build a workflow definition as a BPMN file. 
    You must include the diagram elements for use within BPMN visualization tools. The XML must include:
        - All necessary Activiti namespace declarations
        - All Connection elements
        - Complete process definitions with IDs, names, and documentation
        - You MUST include All required diagram interchange (BPMNDiagram, BPMNPlane, BPMNShape, BPMNEdge) elements
        - Proper x,y coordinates for all shapes and waypoints for connections
        - No comments or explanations outside the XML structure.
        - Include suggested form fields to be collected on each user task
        - Add appropriate description to the description element of each node

        The process is as follows:`,
    ANALYZE: `Here is the BPMN XML to analyze:`
  },
  SCRIPTS: {
    ANALYZE: `Please analyze this Groovy script and explain its purpose and function in simple terms that a non-technical person can understand. 
      Focus on what the script accomplishes rather than how it works. 
      Include any important inputs it expects and outputs it produces.
      Ensure the response is in markdown format
      
      Here's the code:` 
  }
  
});