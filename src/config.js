export const IS_APP_IN_MODE_DEV = import.meta.env.MODE === 'development';

function getBasePath(url) {
    const lastSlashIndex = url.lastIndexOf('/');
    return lastSlashIndex !== -1 ? url.substring(0, lastSlashIndex + 1) : url;
  }
  
  const CONFIG = IS_APP_IN_MODE_DEV
    ? {
        API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
        API_RESOURCE_DEFINITION_ENDPOINT: import.meta.env.VITE_API_RESOURCE_DEFINITION_ENDPOINT,
        API_RESOURCE_DEFINITION_PUBLISH_ENDPOINT: import.meta.env.VITE_API_RESOURCE_DEFINITION_PUBLISH_ENDPOINT,
        API_RESOURCE_DRAFT_ENDPOINT: import.meta.env.VITE_API_RESOURCE_DRAFT_ENDPOINT,
        API_RESOURCE_DRAFT_PUBLISH_ENDPOINT: import.meta.env.VITE_API_RESOURCE_DRAFT_PUBLISH_ENDPOINT,
        API_RESOURCE_SCRIPT_ENDPOINT: import.meta.env.VITE_API_RESOURCE_SCRIPT_ENDPOINT,
        API_LOCAL_BASE_URL: import.meta.env.VITE_API_LOCAL_BASE_URL,
        API_RESOURCE_CLASS_LISTING_URL: import.meta.env.VITE_API_CLASS_LISTING
      }
    : {
        API_BASE_URL: getBasePath(window.location.href),
        API_RESOURCE_DEFINITION_ENDPOINT: 'rest/api/v2/workflow/definition',
        API_RESOURCE_DEFINITION_PUBLISH_ENDPOINT: 'rest/api/v2/workflow/definition/publish',
        API_RESOURCE_DRAFT_ENDPOINT: 'rest/api/v2/workflow/definition/draft',
        API_RESOURCE_DRAFT_PUBLISH_ENDPOINT: 'rest/api/v2/workflow/definition/draft/publish',
        API_RESOURCE_SCRIPT_ENDPOINT: 'rest/api/v2/workflow/definition/script',
        API_LOCAL_BASE_URL: '/workflow-editor',
        API_RESOURCE_CLASS_LISTING_URL: '/fw-class-listing.json'
      };
  
  export const API_BASE_URL = CONFIG.API_BASE_URL;
  export const API_RESOURCE_DEFINITION_ENDPOINT = CONFIG.API_RESOURCE_DEFINITION_ENDPOINT;
  export const API_RESOURCE_DEFINITION_PUBLISH_ENDPOINT = CONFIG.API_RESOURCE_DEFINITION_PUBLISH_ENDPOINT;
  export const API_RESOURCE_DRAFT_ENDPOINT = CONFIG.API_RESOURCE_DRAFT_ENDPOINT;
  export const API_RESOURCE_DRAFT_PUBLISH_ENDPOINT = CONFIG.API_RESOURCE_DRAFT_PUBLISH_ENDPOINT;
  export const API_RESOURCE_SCRIPT_ENDPOINT = CONFIG.API_RESOURCE_SCRIPT_ENDPOINT;
  export const API_LOCAL_BASE_URL = CONFIG.API_LOCAL_BASE_URL;
  export const API_RESOURCE_CLASS_LISTING_URL = CONFIG.API_RESOURCE_CLASS_LISTING_URL;