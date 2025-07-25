import ApiEngine from '../../api-engine';
import { API_BASE_URL,
         API_RESOURCE_DEFINITION_ENDPOINT
    } from '../../config';
import { DiagramsApiUtils } from './diagrams-api-utils';
import { IS_APP_IN_MODE_DEV } from '../../config';

export function SystemDiagrams() {

    const apiEngine = new ApiEngine(`${API_BASE_URL}`);
    const { checkApiKey, getRequestHeaders} = DiagramsApiUtils();

    async function getAllDiagramsFromSystem(apiKey) {
        try {            
            if(IS_APP_IN_MODE_DEV) {
                checkApiKey(apiKey);
            }

            const requestHeaders = (IS_APP_IN_MODE_DEV) ? getRequestHeaders(apiKey) : getRequestHeaders(); 
            const response = await apiEngine.get(`${API_RESOURCE_DEFINITION_ENDPOINT}`, requestHeaders);

            return response?.data?.result.map(diagram => ({
                id: diagram?.fileName,
                version: diagram?.version,
                hasDraft: diagram?.draft,
                versionToLoad: diagram?.version
            })) || null;
            
        } catch (error) {            
            console.error('Error loading system diagrams', error);
            throw error;
        }
    }

    async function getDiagramByIdFromSystem(apiKey, id, version) {
        try {            
            if(IS_APP_IN_MODE_DEV) {
                checkApiKey(apiKey);
            }
            const requestHeaders = (IS_APP_IN_MODE_DEV) ? getRequestHeaders(apiKey) : getRequestHeaders(); 
            const response = await apiEngine.get(`${API_RESOURCE_DEFINITION_ENDPOINT}/${id}/${version}`, requestHeaders);
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

    async function removeDiagramFromSystem(apiKey, id) {
        try {
            if(IS_APP_IN_MODE_DEV) {
                checkApiKey(apiKey);
            }
            const requestHeaders = (IS_APP_IN_MODE_DEV) ? getRequestHeaders(apiKey) : getRequestHeaders(); 
            await apiEngine.delete(`${API_RESOURCE_DEFINITION_ENDPOINT}/${id}`, requestHeaders);    
        } catch (error) {
            console.error('Error removing diagram from the System', error);
            throw error;
        }
    }

    return {
        getAllDiagramsFromSystem,
        getDiagramByIdFromSystem,
        saveDiagramToSystem,
        removeDiagramFromSystem
    };
}
