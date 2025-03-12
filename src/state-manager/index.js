import { defineStore } from 'pinia';
import { SampleStore, SampleStoreIdentifier } from './sub-managers/sample.store';
import { WorkflowEditorStore, WorkflowEditorStoreIdentifier } from './sub-managers/workflow-editor.store';

export default {
    useSampleStore: defineStore(SampleStoreIdentifier, SampleStore),
    useWorkflowEditorStore: defineStore(WorkflowEditorStoreIdentifier, WorkflowEditorStore)
};