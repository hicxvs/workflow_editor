import ApiEngine from '../../api-engine';
import { API_BASE_URL, API_RESOURCE_SCRIPT_ENDPOINT } from '../../config';
import { DiagramsApiUtils } from './diagrams-api-utils';
import { IS_APP_IN_MODE_DEV } from '../../config';

export function DiagramScripts() {

    const apiEngine = new ApiEngine(`${API_BASE_URL}`);
    const { checkApiKey, callRequestHeaders } = DiagramsApiUtils();

    async function getScriptByScriptCode(apiKey, scriptCode) {
        try {           

            if(IS_APP_IN_MODE_DEV) {
                checkApiKey(apiKey);
            }

            const requestHeaders = (IS_APP_IN_MODE_DEV) ? callRequestHeaders(apiKey) : callRequestHeaders();           
            const response = await apiEngine.get(`${API_RESOURCE_SCRIPT_ENDPOINT}/${scriptCode}`, requestHeaders);

            return {
                codeLanguage: response?.data?.result?.language || 'java',
                codeScript: atob(response.data.result.body),
                codeScriptId: response?.data?.result?.id || null,
                codeScriptCode: scriptCode
            };
        } catch (error) {
            console.error('Error loading diagram script by id script code', error);
            throw error;
        }
    }

    async function saveScript(apiKey, id, script) {
        try {           

            if(IS_APP_IN_MODE_DEV) {
                checkApiKey(apiKey);
            }

            const requestHeaders = (IS_APP_IN_MODE_DEV) ? callRequestHeaders(apiKey) : callRequestHeaders();           
            return await apiEngine.post(`${API_RESOURCE_SCRIPT_ENDPOINT}/${id}`,script , requestHeaders);
        } catch (error) {
            console.error('Error saving diagram script', error);
            throw error;
        }
    }

    return {
        getScriptByScriptCode,
        saveScript
    };
}