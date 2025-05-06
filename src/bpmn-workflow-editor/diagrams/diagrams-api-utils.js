export function DiagramsApiUtils() {

    function isApiKeyValid(apikey) {
        const apiKeyPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
        return apiKeyPattern.test(apikey);
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

    function getRequestHeaders(apiKey, isXMLContent = false) {
        return {
            headers: {
                'HICX-API-KEY': apiKey,
                'Content-Type': (!isXMLContent)? 'application/json' : 'application/xml'
            }
        };
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

    return {
        isApiKeyValid,
        checkApiKey,
        getRequestHeaders,
        generateRequestPayload
    };
}