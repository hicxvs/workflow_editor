import ApiEngine from '../../api-engine';
import { API_BASE_URL, API_RESOURCE_DRAFT_ENDPOINT
} from '../../config';
import { DiagramsApiUtils } from './diagrams-api-utils';
import { IS_APP_IN_MODE_DEV } from '../../config';

export function DraftDiagrams() {

    const apiEngine = new ApiEngine(`${API_BASE_URL}`);
    const { checkApiKey, getRequestHeaders, generateRequestPayload } = DiagramsApiUtils();

    async function getAllDiagramsFromDraft(apiKey) {
        try {
            console.log('Not implemented by the backend yet!');
            
            if(IS_APP_IN_MODE_DEV) {
                checkApiKey(apiKey);
            }
            const requestPayload = generateRequestPayload(null);
            const requestHeaders = (IS_APP_IN_MODE_DEV) ? getRequestHeaders(apiKey) : getRequestHeaders();
            
            const response = await apiEngine.get(`${API_RESOURCE_DRAFT_ENDPOINT}`, requestPayload, requestHeaders);
            
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
            if(IS_APP_IN_MODE_DEV) {
                checkApiKey(apiKey);
            }
            const requestHeaders = (IS_APP_IN_MODE_DEV) ? getRequestHeaders(apiKey) : getRequestHeaders();
            const response = await apiEngine.get(`${API_RESOURCE_DRAFT_ENDPOINT}/${id}`, requestHeaders);
            return atob(response?.data?.result?.content);
        } catch (error) {
            console.error('Error get diagram from draft', error);
        }
    }

    async function saveDiagramToDraft(apiKey, diagramXMLContent) {
        try {            
            if(IS_APP_IN_MODE_DEV) {
                checkApiKey(apiKey);
            }
            const isXMLContent = true;
            const requestHeaders = (IS_APP_IN_MODE_DEV) ? getRequestHeaders(apiKey, isXMLContent) : getRequestHeaders(null, isXMLContent);
            await apiEngine.post(`${API_RESOURCE_DRAFT_ENDPOINT}`, diagramXMLContent, requestHeaders);
        } catch (error) {
            console.error('Error save diagram to draft', error);
        }
    }

    async function deleteDiagramFromDraft(apiKey, id) {
        try {            
            if(IS_APP_IN_MODE_DEV) {
                checkApiKey(apiKey);
            }
            const requestHeaders = (IS_APP_IN_MODE_DEV) ? getRequestHeaders(apiKey) : getRequestHeaders();
            await apiEngine.delete(`${API_RESOURCE_DRAFT_ENDPOINT}/${id}`, requestHeaders);
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