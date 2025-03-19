import ApiEngine from '../../api-engine';
import { API_BASE_URL, API_RESOURCE_PUBLISH_ENDPOINT } from '../../config';

export function SystemDiagrams() {

    const apiEngine = new ApiEngine(`${API_BASE_URL}`);

    async function getAllSystemDiagrams(apiKey) {
        try {
            checkApiKey(apiKey);
            const requestPayload = generateRequestPayload(null);
            const response = await apiEngine.post(`${API_RESOURCE_PUBLISH_ENDPOINT}`, requestPayload, getRequestHeaders(apiKey));

            return response?.data?.entity?.data?.bpmn_details.map(diagram => ({
                version: diagram?.version,
                name: diagram?.key_
            })) || null;
            
        } catch (error) {            
            console.error('Error loading system diagrams', error);
            throw error;
        }
    }

    async function getSystemDiagramByName(apiKey, name) {
        try {            
            checkApiKey(apiKey);
            const requestPayload = generateRequestPayload(name);
            const response = await apiEngine.post(`${API_RESOURCE_PUBLISH_ENDPOINT}`, requestPayload, getRequestHeaders(apiKey));
            return atob(response?.data?.entity?.data?.bpmn_details?.content);
        } catch (error) {
            console.error('Error loading system diagram by name', error);
            throw error;
        }
    }

    function generateRequestPayload(diagramBPMNName) {
        return {
            "eClass": "/hicxapi/2#//Event",
            "code": "STREAMBPMN.SYNC",
            "name": "not needed",
            "sourceSystem": "UI",
            "_resolveDataItemsCodes": true,
            "data": diagramBPMNName ? { "bpmn": diagramBPMNName } : {}
        };
    }

    function getRequestHeaders(apiKey) {
        return {
            headers: {
                'HICX-API-KEY': apiKey
            }
        };
    }

    function checkApiKey(apiKey) {
        if(!apiKey?.trim()) {
            console.error("API key is required");
            return;
        }

        if(!isApiKeyValid(apiKey)) {
            console.error("API key is invalid");
            return;
        }        
    }

    function isApiKeyValid(apikey) {
        const apiKeyPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
        return apiKeyPattern.test(apikey);
    }

    return {
        getAllSystemDiagrams,
        getSystemDiagramByName,
        isApiKeyValid
    };
}
