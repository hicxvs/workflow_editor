export const EVENT_TYPE = Object.freeze({
    UPDATE_ELEMENT: 'update-element',
    UPDATE_NAVIGATION_PATH: 'update-navigation-path',
    GENERATE_XML_DIAGRAM: 'generate-xml-diagram',
    GENERATED_XML_DIAGRAM_READY: 'generated-xml-diagram-ready',
    CLEAR_GENERATED_XML_DIAGRAM: 'clear-generated-xml-diagram',
    CREATE_NEW_DIAGRAM: 'create-new-diagram',
    IMPORTED_DIAGRAM_READY: 'imported-diagram-ready',
    CLEAR_DIAGRAM: 'clear-diagram',
    SAVE_DIAGRAM: 'save-diagram',
    REMOVE_DIAGRAM: 'remove-diagram',
    SAVE_DIAGRAM_DRAFT: 'save-diagram-draft',
    DELETE_DIAGRAM_DRAFT: 'delete-diagram-draft',
    DOWNLOAD_DIAGRAM: 'download-diagram',
    LOAD_FILE: 'load-file',
    LOAD_FILE_SUCCESS: 'load-file-success',
    LOAD_FILE_ERROR: 'load-file-error',
    CLEAR_FILE: 'clear-file',
    SET_API_KEY: 'set-api-key',
    API_KEY_LOADED: 'api-key-loaded',
    API_KEY_SAVED: 'api-key-saved',
    API_KEY_CLEARED: 'api-key-cleared',
    LOAD_DIAGRAM_DRAFT_FROM_SYSTEM: 'load-diagram-draft-from-system',
    LOAD_DIAGRAMS_FROM_SYSTEM: 'load-diagrams-from-system',
    LOAD_DIAGRAM_FROM_SYSTEM: 'load-diagram-from-system',
    SHOW_DIAGRAMS_FROM_SYSTEM: 'show-diagrams-from-system',
    LOAD_WORKFLOW_JAVA_CLASSES: 'load-workflow-java-classes',
    OPEN_MODAL: 'open-modal',
    CLOSE_MODAL: 'close-modal',
    MODAL_CLOSED: 'modal-closed',
    CREATE_LISTENER: 'create-listener',
    EDIT_LISTENER: 'edit-listener',
    REMOVE_LISTENER: 'remove-listener',
    SAVE_LISTENER: 'save-listener',
    ADD_CREATED_LISTENER: 'add-create-listener',
    UPDATE_EDITED_LISTENER: 'update-edited-listener',
    CREATE_LISTENER_FIELD: 'create-listener-field',
    EDIT_LISTENER_FIELD: 'edit-listener-field',
    REMOVE_LISTENER_FIELD: 'remove-listener-field',
    ADD_CREATED_LISTENER_FIELD: 'add-create-listener-field',
    TASK_TYPES_READY: 'task-types-ready',
    GATEWAY_TYPES_READY: 'gateway-types-ready',
    WORKFLOW_JAVA_CLASSES_READY: 'workflow-java-classes-ready',
    CREATE_FORM_PROPERTY: 'create-form-property',
    EDIT_FORM_PROPERTY: 'edit-form-property',
    ADD_CREATED_FORM_PROPERTY: 'add-created-form-property',
    SAVE_FORM_PROPERTY: 'save-form-property',
    UPDATE_EDITED_FORM_PROPERTY: 'update-edited-form-property',
    UPDATE_ELEMENT_ATTRIBUTE: 'update-element-attribute',    
    UPDATE_ELEMENT_PROPERTY: 'update-element-property',
    UPDATE_ELEMENT_TYPE: 'update-element-type',
    UPDATE_ELEMENT_CONDITION_EXPRESSION: 'update-element-condition-expression',
    UPDATE_ELEMENT_DOCUMENTATION: 'update-element-documentation',
    CREATE_SERVICE_TASK_FIELD: 'create-service-task-field',    
    EDIT_SERVICE_TASK_FIELD: 'edit-service-task-field',
    ADD_CREATED_SERVICE_TASK_FIELD: 'add-created-service-task-field',  
    UPDATE_SERVICE_TASK_FIELD: 'update-service-task-field',  
    SAVE_SERVICE_TASK_FIELD: 'save-service-task-field',
    UPDATE_BOUNDARY_EVENT_ELEMENT_PROPERTY: 'update-boundary-event-element-property',
    UPDATE_BOUNDARY_EVENT_ELEMENT_REFERENCE_PROPERTY: 'update-boundary-event-element-reference-property',
    CREATE_WORKFLOW_MESSAGE: 'create-workflow-message',
    CREATE_WORKFLOW_ERROR_MESSAGE: 'create-workflow-error-message',
    EDIT_WORKFLOW_MESSAGE: 'edit-workflow-message',
    EDIT_WORKFLOW_ERROR_MESSAGE: 'edit-workflow-error-message',
    REMOVE_WORKFLOW_MESSAGE: 'remove-workflow-message',
    REMOVE_WORKFLOW_ERROR_MESSAGE: 'remove-workflow-error-message',
    ADD_CREATED_WORKFLOW_MESSAGE: 'add-created-workflow-message',
    ADD_CREATED_WORKFLOW_ERROR_MESSAGE: 'add-created-workflow-error-message',
    UPDATE_EDITED_WORKFLOW_MESSAGE: 'update-edited-workflow-message',
    UPDATE_EDITED_WORKFLOW_ERROR_MESSAGE: 'update-edited-workflow-error-message',
    SAVE_WORKFLOW_MESSAGE: 'save-workflow-message',
    SAVE_WORKFLOW_ERROR_MESSAGE: 'save-workflow-error-message',
    GET_WORKFLOW_MESSAGES: 'get-workflow-messages',
    GET_WORKFLOW_ERROR_MESSAGES: 'get-workflow-error-messages',
    WORKFLOW_MESSAGES_READY: 'workflow-messages-ready',
    WORKFLOW_ERROR_MESSAGES_READY: 'workflow-error-messages-ready',
    UPDATE_CATCH_EVENT_ELEMENT_PROPERTY: 'update-catch-event-element-property',
    UPDATE_CALL_ACTIVITY_ELEMENT_PROPERTY: 'update-call-activity-element-property',
    CREATE_CALL_ACTIVITY_INPUT_PARAMETER: 'create-call-activity-input-parameter',
    ADD_CREATED_CALL_ACTIVITY_INPUT_PARAMETER: 'add-created-call-activity-input-parameter',
    EDIT_CALL_ACTIVITY_INPUT_PARAMETER: 'edit-call-activity-input-parameter',
    UPDATE_EDITED_CALL_ACTIVITY_INPUT_PARAMETER: 'update-edited-call-activity-input-parameter',
    REMOVE_CALL_ACTIVITY_INPUT_PARAMETER: 'remove-call-activity-input-parameter',
    SAVE_CALL_ACTIVITY_INPUT_PARAMETER: 'save-call-activity-input-parameter',
    CREATE_CALL_ACTIVITY_OUTPUT_PARAMETER: 'create-call-activity-output-parameter',
    ADD_CREATED_CALL_ACTIVITY_OUTPUT_PARAMETER: 'add-created-call-activity-output-parameter',
    EDIT_CALL_ACTIVITY_OUTPUT_PARAMETER: 'edit-call-activity-output-parameter',
    UPDATE_EDITED_CALL_ACTIVITY_OUTPUT_PARAMETER: 'update-edited-call-activity-output-parameter',
    REMOVE_CALL_ACTIVITY_OUTPUT_PARAMETER: 'remove-call-activity-output-parameter',
    SAVE_CALL_ACTIVITY_OUTPUT_PARAMETER: 'save-call-activity-output-parameter',
    CREATE_FORM_VALUE: 'create-form-value',
    ADD_CREATED_FORM_VALUE: 'add-created-form-value',
    EDIT_FORM_VALUE: 'edit-form-value',
    REMOVE_FORM_VALUE: 'remove-form-value',
    SAVE_FORM_VALUE: 'save-form-value',
    UPDATE_MULTI_INSTANCE_ELEMENT_PROPERTY: 'update-multi-instance-element-property',
    LOAD_CODE_SCRIPT: 'load-code-script',
    GET_SCRIPT_CODE: 'get-script-code',
    SHOW_SYSTEM_DRAFT_OPTIONS: 'show-system-draft-options',
    HIDE_SYSTEM_DRAFT_OPTIONS: 'hide-system-draft-options',
    GET_DIAGRAM_DATA: 'get-diagram-data',
    DIAGRAM_DATA_READY: 'diagram-data-ready',
    CANVAS_SELECTED: 'canvas-selected',
    CANVAS_DESELECTED: 'canvas-deselected',
    SHOW_PROPERTIES_PANEL: 'show-properties-panel',
    HIDE_PROPERTIES_PANEL: 'hide-properties-panel',
    ELEMENT_SELECTED: 'element-selected',
    ELEMENT_DESELECTED: 'element-deselected',
    SHOW_NOTIFICATION: 'show-notification',
    SHOW_ACTION_CONFIRMATION: 'show-action-confirmation',
    GET_ALL_MANAGER_DIAGRAMS: 'get-all-manager-diagrams',
    GET_DIAGRAM_FROM_MANAGER_DIAGRAMS: 'get-diagram-from-manager-diagrams',
    REMOVE_DIAGRAM_FROM_MANAGER_DIAGRAMS: 'remove-diagram-from-manager-diagrams',
    UPDATE_SCRIPT_VALUE: 'update-script-value',
    SHOW_ALERT_NOTIFICATION: 'show-alert-notification',
    HIDE_ALERT_NOTIFICATION: 'hide-alert-notification',
    PROCESS_DEFINITION_CHANGED: 'process-definition-changed'
});


