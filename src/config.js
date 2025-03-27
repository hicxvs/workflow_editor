export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://hicx-manage-template-uat5.hicxsolutions.net';
export const API_RESOURCE_PUBLISH_ENDPOINT = import.meta.env.VITE_API_RESOURCE_PUBLISH_ENDPOINT || '/template/hicxesm-manager/app/rest/api/v2/events/publish';
export const API_RESOURCE_PUBLISH_URL = `${API_BASE_URL}${API_RESOURCE_PUBLISH_ENDPOINT}`;
export const API_LOCAL_BASE_URL = import.meta.env.VITE_API_LOCAL_BASE_URL || '/workflow-editor';
export const API_RESOURCE_CLASS_LISTING_URL = import.meta.env.VITE_API_CLASS_LISTING || '/fw-class-listing.json';
