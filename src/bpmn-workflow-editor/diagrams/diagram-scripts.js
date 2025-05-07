import ApiEngine from '../../api-engine';
import { API_BASE_URL, API_RESOURCE_SCRIPT_ENDPOINT } from '../../config';
import { DiagramsApiUtils } from './diagrams-api-utils';

export function DiagramScripts() {

    const apiEngine = new ApiEngine(`${API_BASE_URL}`);
    const { checkApiKey, getRequestHeaders } = DiagramsApiUtils();

    async function getScriptById(apiKey, id) {
        try {            
            checkApiKey(apiKey);
            const response = await apiEngine.get(`${API_RESOURCE_SCRIPT_ENDPOINT}/${id}`, getRequestHeaders(apiKey));
            return {
                codeLanguage: response?.data?.result?.language || 'java',
                codeScript: atob(response.data.result.body),
                codeScriptId: id
            };
        } catch (error) {
            console.error('Error loading diagram script by id', error);
            throw error;
        }
    }

    return {
        getScriptById
    };
}