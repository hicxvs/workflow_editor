import ApiEngine from '../../api-engine';
import { API_BASE_URL, API_RESOURCE_EVENTS_PUBLISH_ENDPOINT,
         API_RESOURCE_DEFINITION_ENDPOINT
    } from '../../config';
import { DiagramsApiUtils } from './diagrams-api-utils';
import { IS_APP_IN_MODE_DEV } from '../../config';

export function SystemDiagrams() {

    const apiEngine = new ApiEngine(`${API_BASE_URL}`);
    const { checkApiKey, getRequestHeaders, generateRequestPayload } = DiagramsApiUtils();

    async function getAllDiagramsFromSystem(apiKey) {
        try {            
            if(IS_APP_IN_MODE_DEV) {
                checkApiKey(apiKey);
            }

            const requestPayload = generateRequestPayload(null);
            const requestHeaders = (IS_APP_IN_MODE_DEV) ? getRequestHeaders(apiKey) : getRequestHeaders(); 
            const response = await apiEngine.post(`${API_RESOURCE_EVENTS_PUBLISH_ENDPOINT}`, requestPayload, requestHeaders);

            return response?.data?.entity?.data?.bpmn_details.map(diagram => ({
                version: diagram?.version,
                id: diagram?.key_
            })) || null;
            
        } catch (error) {            
            console.error('Error loading system diagrams', error);
            throw error;
        }
    }

    async function getDiagramByIdFromSystem(apiKey, id) {
        try {            
            if(IS_APP_IN_MODE_DEV) {
                checkApiKey(apiKey);
            }
            const requestHeaders = (IS_APP_IN_MODE_DEV) ? getRequestHeaders(apiKey) : getRequestHeaders(); 
            const response = await apiEngine.get(`${API_RESOURCE_DEFINITION_ENDPOINT}/${id}`, requestHeaders);
            return atob(response?.data?.result?.content);
        } catch (error) {
            console.error('Error loading system diagram by id', error);
            throw error;
        }
    }

    async function saveDiagramToSystem(apiKey, diagramXMLContent) {
        try {
            if(IS_APP_IN_MODE_DEV) {
                checkApiKey(apiKey);
            }
            const isXMLContent = true;
            const requestHeaders = (IS_APP_IN_MODE_DEV) ? getRequestHeaders(apiKey, isXMLContent) : getRequestHeaders(null, isXMLContent);
            await apiEngine.post(`${API_RESOURCE_DEFINITION_ENDPOINT}`, diagramXMLContent, requestHeaders);
        } catch (error) {
            console.error('Error saving diagram to the System', error);
            throw error;
        }
    }

    return {
        getAllDiagramsFromSystem,
        getDiagramByIdFromSystem,
        saveDiagramToSystem
    };
}
