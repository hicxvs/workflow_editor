import ApiEngine from '../../api-engine';
import { API_BASE_URL, API_RESOURCE_DRAFT_PUBLISH_ENDPOINT, API_RESOURCE_DRAFT_ENDPOINT
} from '../../config';
import { DiagramsApiUtils } from './diagrams-api-utils';

export function DraftDiagrams() {

    const apiEngine = new ApiEngine(`${API_BASE_URL}`);
    const { checkApiKey, getRequestHeaders, generateRequestPayload } = DiagramsApiUtils();

    async function getAllDiagramsFromDraft(apiKey) {
        try {
            console.log('Not implemented by the backend yet!');
            
            checkApiKey(apiKey);
            const requestPayload = generateRequestPayload(null);
            
            const response = await apiEngine.get(`${API_RESOURCE_DRAFT_ENDPOINT}`, requestPayload, getRequestHeaders(apiKey));
            
            return response?.data?.entity?.data?.bpmn_details.map(diagram => ({
                version: diagram?.version,
                id: diagram?.key_
            })) || null;         
            
        } catch (error) {            
            console.error('Error get all diagram from drafts', error);
        }
    }

    async function getDiagramByIdFromDraft(apiKey, id) {
        try {            
            checkApiKey(apiKey);
            const response = await apiEngine.get(`${API_RESOURCE_DRAFT_ENDPOINT}/${id}`, getRequestHeaders(apiKey));
            return atob(response?.data?.result?.content);
        } catch (error) {
            console.error('Error get diagram from draft', error);
        }
    }

    async function saveDiagramToDraft(apiKey, diagramXMLContent) {
        try {            
            checkApiKey(apiKey);
            const isXMLContent = true;
            await apiEngine.post(`${API_RESOURCE_DRAFT_ENDPOINT}`, diagramXMLContent, getRequestHeaders(apiKey, isXMLContent));
        } catch (error) {
            console.error('Error save diagram to draft', error);
        }
    }

    async function deleteDiagramFromDraft(apiKey, id) {
        try {            
            checkApiKey(apiKey);
            await apiEngine.delete(`${API_RESOURCE_DRAFT_ENDPOINT}/${id}`, getRequestHeaders(apiKey));
        } catch (error) {
            console.error('Error delete diagram to draft', error);
        }
    }

    return {
        getAllDiagramsFromDraft,
        getDiagramByIdFromDraft,
        saveDiagramToDraft,
        deleteDiagramFromDraft
    };
}