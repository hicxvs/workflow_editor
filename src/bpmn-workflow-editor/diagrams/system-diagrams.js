import ApiEngine from '../../api-engine';
import { API_BASE_URL, API_RESOURCE_EVENTS_PUBLISH_ENDPOINT, API_RESOURCE_DEFINITION_ENDPOINT} from '../../config';

export function SystemDiagrams() {

    const apiEngine = new ApiEngine(`${API_BASE_URL}`);

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

    async function getAllDiagramDrafts(apiKey) {
        try {
            checkApiKey(apiKey);
            console.log(apiKey);
            /*const response = await apiEngine.get(`${API_RESOURCE_DRAFT_ENDPOINT}`, getRequestHeaders(apiKey));

            return response?.data?.entity?.data?.bpmn_details.map(diagram => ({
                version: diagram?.version,
                name: diagram?.key_
            })) || null; */
            console.log('getAllDiagramDrafts::BACKEND ENDPOINT NOT IMPLEMNETED YET!!');
            
        } catch (error) {            
            console.error('Error get all diagram drafts', error);
            throw error;
        }
    }

    async function saveDiagramDraft(apiKey, diagramXML) {
        try {            
            checkApiKey(apiKey);
            const {id, content} = diagramXML;
            const isXMLContent = true;
            const response = await apiEngine.post(`${API_RESOURCE_DRAFT_ENDPOINT}/${id}`, content, getRequestHeaders(apiKey, isXMLContent));
            return atob(response?.data?.result?.content);
        } catch (error) {
            console.error('Error get system diagram draft by name', error);
            throw error;
        }
    }

    async function getSystemDiagramDraftByName(apiKey, diagramXML) {
        try {            
            checkApiKey(apiKey);
            const {id} = diagramXML;
            const response = await apiEngine.get(`${API_RESOURCE_DRAFT_ENDPOINT}/${id}`, getRequestHeaders(apiKey));
            return atob(response?.data?.result?.content);
        } catch (error) {
            console.error('Error get system diagram draft by name', error);
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

    function getRequestHeaders(apiKey, isXMLContent = false) {
        return {
            headers: {
                'HICX-API-KEY': apiKey,
                'Content-Type': (!isXMLContent)? 'application/json' : 'application/xml'
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
        getSystemDiagramById,
        isApiKeyValid,
        saveDiagramToSystem,
        getAllDiagramDrafts,
        saveDiagramDraft,
        getSystemDiagramDraftByName
    };
}
