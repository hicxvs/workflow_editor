export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://hicx-manage-template-uat5.hicxsolutions.net';
export const RESOURCE_PUBLISH_ENDPOINT = import.meta.env.VITE_API_RESOURCE_PUBLISH_ENDPOINT || '/template/hicxesm-manager/app/rest/api/v2/events/publish';
export const API_RESOURCE_PUBLISH_URL = `${API_BASE_URL}${RESOURCE_PUBLISH_ENDPOINT}`;
