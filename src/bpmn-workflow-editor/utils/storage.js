import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../modeler/eventTypes';

export function Storage() {
    
    const storageKey = 'bpmn_api_key';

    function saveAPIKey(apiKey) {
        if(!apiKey) {
            console.error("No API key provided.");
            return;
        }
    
        if(!isLocalStorageSupported()) {
            console.error("Local storage not supported.");
            return;
        }
        
        localStorage.setItem(storageKey, apiKey);
        EventBus.emit(EVENT_TYPE.API_KEY_SAVED, apiKey);
    }

    function loadAPIKey() {
        if(!isLocalStorageSupported()) {
            console.error("Local storage not supported.");
            return;
        }
    
        const apiKey = localStorage.getItem(storageKey);
        if(!apiKey) {
            console.error("No API key found.");
            return;
        }

        EventBus.emit(EVENT_TYPE.API_KEY_LOADED, apiKey);
        return apiKey;
    }

    function clearAPIKey() {
        if(!isLocalStorageSupported()) {
            console.error("Local storage not supported.");
            return;
        }
        localStorage.removeItem(storageKey);
        EventBus.emit(EVENT_TYPE.API_KEY_CLEARED);
    }

    function isLocalStorageSupported() {
        if(!localStorage) {
            console.error("Local storage not supported.");
            return false;
        }
        return true;
    }
    
    return {
        saveAPIKey,
        loadAPIKey,
        clearAPIKey
    };
}