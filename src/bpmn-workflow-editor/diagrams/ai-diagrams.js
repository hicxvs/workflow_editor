import ApiEngine from '../../api-engine';
import { API_BASE_URL,
    API_RESOURCE_EVENTS_ENDPOINT
    } from '../../config';
import { DiagramsApiUtils } from './diagrams-api-utils';
import { IS_APP_IN_MODE_DEV } from '../../config';

export function AIDiagrams() {

    const apiEngine = new ApiEngine(`${API_BASE_URL}`);
    const { checkApiKey, getRequestHeaders, generateAIRequestPayload} = DiagramsApiUtils();

    async function analiseDiagram(apiKey, prompt, diagramXMLContent) {
        try {            
            if(IS_APP_IN_MODE_DEV) {
                checkApiKey(apiKey);
            }

            const requestHeaders = (IS_APP_IN_MODE_DEV) ? getRequestHeaders(apiKey) : getRequestHeaders(); 
            const response = await apiEngine.post(`${API_RESOURCE_EVENTS_ENDPOINT}`, generateAIRequestPayload(`${prompt}${diagramXMLContent}`), requestHeaders);
            return response?.data?.entity?.data?.answer;

        } catch (error) {            
            console.error('Error analysing diagram', error);
            throw error;
        }
    }

    async function generateDiagram(apiKey, prompt) {
        try {            
            if(IS_APP_IN_MODE_DEV) {
                checkApiKey(apiKey);
            }

            const generatePrompt = `As an expert in BPMN 2.0 and Activiti 5, build a workflow definition as a BPMN file. 
            You must include the diagram elements for use within BPMN visualization tools. The XML must include:
                - All necessary Activiti namespace declarations
                - All Connection elements
                - Complete process definitions with IDs, names, and documentation
                - You MUST include All required diagram interchange (BPMNDiagram, BPMNPlane, BPMNShape, BPMNEdge) elements
                - Proper x,y coordinates for all shapes and waypoints for connections
                - No comments or explanations outside the XML structure.
                - Include suggested form fields to be collected on each user task
                - Add appropriate description to the description element of each node

                The process is as follows:${prompt}
            `;

            const requestHeaders = (IS_APP_IN_MODE_DEV) ? getRequestHeaders(apiKey) : getRequestHeaders(); 
            const response = await apiEngine.post(`${API_RESOURCE_EVENTS_ENDPOINT}`, generateAIRequestPayload(generatePrompt), requestHeaders);
            return response?.data?.entity?.data?.answer;
                      
        } catch (error) {            
            console.error('Error generating diagram', error);
            throw error;
        }
    }

    return {
        analiseDiagram,
        generateDiagram
    };
}