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
        
    function registerDiagram(diagramToRegister) {
        if(!diagramToRegister && !diagramToRegister.diagramId && !diagramToRegister.diagramContent) {
            return;
        }

        const items = getAllDiagrams() || [];

        const item = {
            managerId: generateUUID(),
            id: diagramToRegister?.diagramId,
            xmlContent: diagramToRegister?.diagramContent,
            version: diagramToRegister?.diagramVersion,
            loadedVersion: diagramToRegister?.diagramLoadedVersion,
            isLatestVersion: diagramToRegister?.isDiagramLastestVersion,
            active: false,
            showSystemDraftOperations: false
        };

        items.push(item);
        updateManagerCollection(items);
        activateItem(item.managerId);
        return item.managerId;
    }

    function activateItem(managerId) {
        updateItemProperties(managerId, (item, id) => {
            item.active = item.managerId === id;
        });
    }

    function enableDraftOperations(managerId) {
        updateItemProperties(managerId, (item, id) => {
            if (item.managerId === id) {
                item.showSystemDraftOperations = true;
            }     
        });
    }

    function updateDiagramContent(managerId, diagramContent) {
        updateItemProperties(managerId, (item, id) => {
            if (item.managerId === id) {
                item.xmlContent = diagramContent;
            }
        });
    }
    
    function updateItemProperties(managerId, updateFunction) {
        if(!managerId || !updateFunction) {
            return;
        }

        const items = getAllDiagrams();

        if (!items.length) {
            return;
        }

        items.forEach(item => {
            updateFunction(item, managerId);
        });

        updateManagerCollection(items);
    }

    function getAllDiagrams() {
        return JSON.parse(sessionStorage.getItem(collectionKey));
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

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, character => {
            const randomValue = crypto.getRandomValues(new Uint8Array(1))[0] & 0x0f;
            const replacementValue = character === 'x'
                ? randomValue
                : (randomValue & 0x3) | 0x8;
            return replacementValue.toString(16);
        });
    }

    function updateManagerCollection(items) {
        sessionStorage.removeItem(collectionKey);
        sessionStorage.setItem(collectionKey, JSON.stringify(items));
    }
    
    return {
        initializeDiagramManager,
        registerDiagram,
        getAllDiagrams,
        getSelectedDiagram,
        removeDiagramByManagerId,        
        enableDraftOperations,
        updateDiagramContent
    };
}