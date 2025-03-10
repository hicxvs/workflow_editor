import axios from 'axios';
import { ApiEngineEventTypes } from './api-engine-event-types';
import Eventbus from './event-bus';

export function ApiEngine(baseURL) {

    const engine = axios.create({
        baseURL: baseURL,
        timeout: ( 60 * 1000 ),
        timeoutErrorMessage: 'Timeout error. Please verify service availability and network connection.',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    engine.interceptors.request.use((config) => {
        Eventbus.emit(ApiEngineEventTypes.SERVICE_REQUEST_STARTED);
        return config;

    },handleRejectError);

    engine.interceptors.response.use((response) => {
        Eventbus.emit(ApiEngineEventTypes.SERVICE_REQUEST_ENDED);
        return response;
    },handleRejectError);

    function handleRejectError(error) {
        Eventbus.emit(ApiEngineEventTypes.SERVICE_REQUEST_ENDED);
        return Promise.reject(error);
    }
    
    return engine;
}
