import ApiEngine from '../../api-engine';
import { API_BASE_URL, API_RESOURCE_EVENTS_PUBLISH_ENDPOINT,
         API_RESOURCE_DEFINITION_ENDPOINT,
         API_RESOURCE_DEFINITION_PUBLISH_ENDPOINT
    } from '../../config';
import { DiagramsApiUtils } from './diagrams-api-utils';

export function SystemDiagrams() {

    const apiEngine = new ApiEngine(`${API_BASE_URL}`);
    const { checkApiKey, getRequestHeaders, generateRequestPayload } = DiagramsApiUtils();

    async function getAllSystemDiagrams(apiKey) {
        try {
            checkApiKey(apiKey);
            const requestPayload = generateRequestPayload(null);
            const response = await apiEngine.post(`${API_RESOURCE_EVENTS_PUBLISH_ENDPOINT}`, requestPayload, getRequestHeaders(apiKey));

            return response?.data?.entity?.data?.bpmn_details.map(diagram => ({
                version: diagram?.version,
                id: diagram?.key_
            })) || null;
            
        } catch (error) {            
            console.error('Error loading system diagrams', error);
            throw error;
        }
    }

    async function getSystemDiagramById(apiKey, id) {
        try {            
            checkApiKey(apiKey);
            const response = await apiEngine.get(`${API_RESOURCE_DEFINITION_ENDPOINT}/${id}`, getRequestHeaders(apiKey));
            return atob(response?.data?.result?.content);
        } catch (error) {
            console.error('Error loading system diagram by id', error);
            throw error;
        }
    }

    async function saveDiagramToSystem(apiKey, diagramXML) {
        try {
            checkApiKey(apiKey);
            const {content} = diagramXML;
            const isXMLContent = true;
            await apiEngine.post(`${API_RESOURCE_DEFINITION_PUBLISH_ENDPOINT}`, content, getRequestHeaders(apiKey, isXMLContent));
        } catch (error) {
            console.error('Error saving diagram to the System', error);
            throw error;
        }
    }

    return {
        getAllSystemDiagrams,
        getSystemDiagramById,
        saveDiagramToSystem
    };
}
