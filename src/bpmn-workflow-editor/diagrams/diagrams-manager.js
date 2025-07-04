export function DiagramManager() {

    const engine = sessionStorage;

    if(!engine) {
        console.error('Session Storage engine not available on this browser');
        return;
    }

    const collectionKey = 'local_session_diagrams';
    initDiagramManager();
    
    function initDiagramManager() {
        const items = JSON.parse(sessionStorage.getItem(collectionKey));

        if(!items || !Array.isArray(items)) {
            sessionStorage.setItem(collectionKey, JSON.stringify([]));
        }
    }
    
    function getAllDiagrams() {
        return JSON.parse(sessionStorage.getItem(collectionKey));
    }

    function getDiagramByManagerId() {
        console.log('getDiagramById: soon');
    }

    function saveDiagram(diagramId, diagramContent) {
        if(!diagramId || !diagramContent) {
            return;
        }

        const items = getAllDiagrams();

        items.push({
            managerId: generateUUID(),
            id: diagramId,
            xmlContent: diagramContent 
        });

        sessionStorage.setItem(collectionKey, JSON.stringify(items));
    }

    function removeDiagramByManagerId(managerId) {
        try {      
            const items = getAllDiagrams();

            if (!Array.isArray(items)) {
                console.warn('Expected getAllDiagrams() to return an array, got:', items);
                return;
            }
        
            const updatedItems = items.filter(item => item.managerId !== managerId);      
            sessionStorage.setItem(collectionKey, JSON.stringify(updatedItems));
        } catch (error) {
            console.error('Error removing diagram by managerId:', error);
        }
    }

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    return {
        getAllDiagrams,
        getDiagramByManagerId,
        saveDiagram,
        removeDiagramByManagerId
    };
}