import ApiEngine from '../../api-engine';
import { API_BASE_URL,
    API_RESOURCE_EVENTS_ENDPOINT
    } from '../../config';
import { DiagramsApiUtils } from './diagrams-api-utils';
import { IS_APP_IN_MODE_DEV } from '../../config';
import { AI_DIAGRAM_REQUEST_BASE_PROMPTS } from './ai-diagram-request-base-prompts';

export function AIDiagrams() {

    const apiEngine = new ApiEngine(`${API_BASE_URL}`);
    const { checkApiKey, getRequestHeaders, generateAIRequestPayload} = DiagramsApiUtils();

    async function analiseDiagram(apiKey, prompt, diagramXMLContent) {
        try {            
            if(IS_APP_IN_MODE_DEV) {
                checkApiKey(apiKey);
            }

            const requestPrompt = `${AI_DIAGRAM_REQUEST_BASE_PROMPTS.ANALYZE}${prompt}${diagramXMLContent}`;
            const requestHeaders = (IS_APP_IN_MODE_DEV) ? getRequestHeaders(apiKey) : getRequestHeaders(); 
            //const response = await apiEngine.post(`${API_RESOURCE_EVENTS_ENDPOINT}`, generateAIRequestPayload(requestPrompt), requestHeaders);
            //return response?.data?.entity?.data?.answer;

            console.log(requestPrompt);

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

            const requestPrompt = `${AI_DIAGRAM_REQUEST_BASE_PROMPTS.GENERATE}${prompt}`;
            const requestHeaders = (IS_APP_IN_MODE_DEV) ? getRequestHeaders(apiKey) : getRequestHeaders(); 
            const response = await apiEngine.post(`${API_RESOURCE_EVENTS_ENDPOINT}`, generateAIRequestPayload(requestPrompt), requestHeaders);
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