<template>
  <div class="properties-panel" data-testid="properties-panel">
    <ActionButtonGroup class="mb-6"/>
    <ProcessDefinition v-model="currentProcessDefinition" class="mb-6" />
    <MessageEditor v-model="currentDiagramMessages" class="mb-6" />
    <ErrorMessageEditor v-model="currentDiagramErrorMessages" class="mb-6" />
    <PropertyEditor v-model="currentWorkingElementProperties" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import { EVENT_TYPE } from "../bpmn-workflow-editor/modeler/eventTypes";
import EventBus from "../eventbus";
import StateManager from "../state-manager";
import { storeToRefs } from "pinia";

import ActionButtonGroup from "../components/properties-panel-components/ActionButtonGroup.vue";
import ProcessDefinition from "../components/properties-panel-components/ProcessDefinition.vue";
import MessageEditor from "../components/properties-panel-components/MessageEditor.vue";
import ErrorMessageEditor from "../components/properties-panel-components/ErrorMessageEditor.vue";
import PropertyEditor from "../components/properties-panel-components/PropertyEditor.vue";

const workflowEditorStore = StateManager.useWorkflowEditorStore();
const { currentProcessDefinition, currentWorkingElementProperties, currentDiagramMessages, currentDiagramErrorMessages } = storeToRefs(workflowEditorStore);
const { generateDiagram, clearWorkflowEditor } = workflowEditorStore;

onMounted(() => {
  registerDiagramEventHandlers();
});

onUnmounted(() => {
  unregisterDiagramEventHandlers();
});

function registerDiagramEventHandlers() {
  EventBus.on(EVENT_TYPE.GENERATE_DIAGRAM, () => generateDiagram()); 
  EventBus.on(EVENT_TYPE.CLEAR_DIAGRAM, () => clearWorkflowEditor());
}

function unregisterDiagramEventHandlers() {
  EventBus.off(EVENT_TYPE.GENERATE_DIAGRAM);
  EventBus.off(EVENT_TYPE.CLEAR_DIAGRAM);
}
</script>

<style scoped>
.properties-panel {
  padding: 0 16px;
  width: 98%;
  height: 96vh;
}


</style>

