import ApiEngine from '../../api-engine';
import { API_BASE_URL, API_RESOURCE_SCRIPT_ENDPOINT } from '../../config';
import { DiagramsApiUtils } from './diagrams-api-utils';
import { IS_APP_IN_MODE_DEV } from '../../config';

export function DiagramScripts() {

    const apiEngine = new ApiEngine(`${API_BASE_URL}`);
    const { checkApiKey, getRequestHeaders } = DiagramsApiUtils();

    async function getScriptById(apiKey, id) {
        try {           

            if(IS_APP_IN_MODE_DEV) {
                checkApiKey(apiKey);
            }

            const requestHeaders = (IS_APP_IN_MODE_DEV) ? getRequestHeaders(apiKey) : getRequestHeaders();           
            const response = await apiEngine.get(`${API_RESOURCE_SCRIPT_ENDPOINT}/${id}`, requestHeaders);

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