const DEV_API_BASE_URL = 'https://hicx-manage-template-uat5.hicxsolutions.net/template/hicxesm-manager/app/';

function getBasePath(url) {
    const lastSlashIndex = url.lastIndexOf('/');
    return lastSlashIndex !== -1 ? url.substring(0, lastSlashIndex + 1) : url;
}

function getValidApiURL(baseApiURLString, backupApiURLString) {
    if (baseApiURLString.startsWith("https://manage")) {
        return baseApiURLString;
    } else {
        return backupApiURLString;
    }
}

const CONFIG = {
    API_BASE_URL: getValidApiURL(getBasePath(window.location.href), DEV_API_BASE_URL),
    API_RESOURCE_DEFINITION_ENDPOINT: 'rest/api/v2/workflow/definition',
    API_RESOURCE_DEFINITION_PUBLISH_ENDPOINT: 'rest/api/v2/workflow/definition/publish',
    API_RESOURCE_DRAFT_ENDPOINT: 'rest/api/v2/workflow/definition/draft',
    API_RESOURCE_DRAFT_PUBLISH_ENDPOINT: 'rest/api/v2/workflow/definition/draft/publish',
    API_RESOURCE_SCRIPT_ENDPOINT: 'rest/api/v2/workflow/definition/script',
    API_LOCAL_BASE_URL: '/workflow-editor',
    API_RESOURCE_CLASS_LISTING_URL: '/fw-class-listing.json'
};

export const IS_APP_IN_MODE_DEV = import.meta.env.MODE === 'development';
export const API_BASE_URL = CONFIG.API_BASE_URL;
export const API_RESOURCE_DEFINITION_ENDPOINT = CONFIG.API_RESOURCE_DEFINITION_ENDPOINT;
export const API_RESOURCE_DEFINITION_PUBLISH_ENDPOINT = CONFIG.API_RESOURCE_DEFINITION_PUBLISH_ENDPOINT;
export const API_RESOURCE_DRAFT_ENDPOINT = CONFIG.API_RESOURCE_DRAFT_ENDPOINT;
export const API_RESOURCE_DRAFT_PUBLISH_ENDPOINT = CONFIG.API_RESOURCE_DRAFT_PUBLISH_ENDPOINT;
export const API_RESOURCE_SCRIPT_ENDPOINT = CONFIG.API_RESOURCE_SCRIPT_ENDPOINT;
export const API_LOCAL_BASE_URL = CONFIG.API_LOCAL_BASE_URL;
export const API_RESOURCE_CLASS_LISTING_URL = CONFIG.API_RESOURCE_CLASS_LISTING_URL;