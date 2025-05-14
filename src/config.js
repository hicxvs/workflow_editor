export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || window.location.host;

export const API_RESOURCE_EVENTS_ENDPOINT = import.meta.env.VITE_API_RESOURCE_EVENTS_ENDPOINT || '/template/hicxesm-manager/app/rest/api/v2/events';
export const API_RESOURCE_EVENTS_PUBLISH_ENDPOINT = import.meta.env.VITE_API_RESOURCE_EVENTS_PUBLISH_ENDPOINT || `${API_RESOURCE_EVENTS_ENDPOINT}/publish`;

export const API_RESOURCE_DEFINITION_ENDPOINT = import.meta.env.VITE_API_RESOURCE_DEFINITION_ENDPOINT || '/template/hicxesm-manager/app/rest/api/v2/workflow/definition';
export const API_RESOURCE_DEFINITION_PUBLISH_ENDPOINT = import.meta.env.VITE_API_RESOURCE_DEFINITION_PUBLISH_ENDPOINT || `${API_RESOURCE_DEFINITION_ENDPOINT}/publish`;

export const API_RESOURCE_DRAFT_ENDPOINT = import.meta.env.VITE_API_RESOURCE_DRAFT_ENDPOINT || '/template/hicxesm-manager/app/rest/api/v2/workflow/definition/draft';
export const API_RESOURCE_DRAFT_PUBLISH_ENDPOINT = import.meta.env.VITE_API_RESOURCE_DRAFT_PUBLISH_ENDPOINT || `${API_RESOURCE_DRAFT_ENDPOINT}/publish`;

export const API_RESOURCE_SCRIPT_ENDPOINT = import.meta.env.VITE_API_RESOURCE_SCRIPT_ENDPOINT || '/template/hicxesm-manager/app/rest/api/v2/workflow/definition/script';

export const API_LOCAL_BASE_URL = import.meta.env.VITE_API_LOCAL_BASE_URL || '/workflow-editor';
export const API_RESOURCE_CLASS_LISTING_URL = import.meta.env.VITE_API_CLASS_LISTING || '/fw-class-listing.json';

export const IS_APP_IN_MODE_DEV = import.meta.env.MODE === 'development';
