export function DiagramManager() {

    const engine = sessionStorage;

    if(!engine) {
        console.error('Session Storage engine not available on this browser');
        return;
    }

    const collectionKey = 'local_session_diagrams';
    initializeDiagramManager();

    function initializeDiagramManager() {
        const items = JSON.parse(sessionStorage.getItem(collectionKey));
        
        if(!items || !items.length) {
            updateManagerCollection([]);
        }       
    }
        
    function getAllDiagrams() {
        return JSON.parse(sessionStorage.getItem(collectionKey));
    }

    function registerDiagram(diagramId, diagramContent) {
        if(!diagramId || !diagramContent) {
            return;
        }

        const items = getAllDiagrams() || [];
        const newManagerId = generateUUID();

        items.push({
            managerId: newManagerId,
            id: diagramId,
            xmlContent: diagramContent,
            active: false
        });

        updateManagerCollection(items);
        activateItem(newManagerId);
    }

    function getSelectedDiagram(managerId) {
        const items = getAllDiagrams();

        if(!items.length) {
            updateManagerCollection([]);
            return;
        }

        const seletedItem = items.find(item => item.managerId === managerId) || null;

        if(!seletedItem) {
            return;
        }

        activateItem(seletedItem.managerId);
        return seletedItem;
    }

    function removeDiagramByManagerId(managerId) {
        const items = getAllDiagrams();

        if(!items?.length) {
            updateManagerCollection([]);
            return;
        }

        const updatedItems = items.filter(item => item.managerId !== managerId);
        updateManagerCollection(updatedItems);
    }

    function updateDiagramContent(managerId, diagramContent) {
        const items = getAllDiagrams();

        if(!items.length) {
            return;
        }

        const itemToUpdate = items.find(item => item.managerId === managerId);

        if(!itemToUpdate) {
            return;
        }

        itemToUpdate.xmlContent = diagramContent;
        updateManagerCollection(items);
    }

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function activateItem(managerId) {
        const items = getAllDiagrams();

        if(!items.length) {
            return;
        }

        items.forEach(item => {
            item.active = false;

            if(item.managerId === managerId) {
                item.active = true;
            }
        });

        updateManagerCollection(items);    
    }

    function updateManagerCollection(items) {
        sessionStorage.removeItem(collectionKey);
        sessionStorage.setItem(collectionKey, JSON.stringify(items));
    }
    
    return {
        initializeDiagramManager,
        getAllDiagrams,
        getSelectedDiagram,
        registerDiagram,
        removeDiagramByManagerId,
        updateDiagramContent
    };
}