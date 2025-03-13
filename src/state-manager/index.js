import { defineStore } from 'pinia';
import { WorkflowEditorStore, WorkflowEditorStoreIdentifier } from './sub-managers/workflow-editor.store';


export default {
    useWorkflowEditorStore: defineStore(WorkflowEditorStoreIdentifier, WorkflowEditorStore)
};