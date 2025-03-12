<template>
  <div class="properties-panel" data-testid="properties-panel">
    <ActionButtonGroup />
    <ProcessDefinition />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import ActionButtonGroup from "../components/properties-panel-components/ActionButtonGroup.vue";
import ProcessDefinition from "../components/properties-panel-components/ProcessDefinition.vue";
import { EVENT_TYPE } from "../bpmn-workflow-editor/modeler/eventTypes";
import EventBus from "../eventbus";
import StateManager from "../state-manager";

const workflowEditorStore = StateManager.useWorkflowEditorStore();
const { generateDiagram, clearDiagram } = workflowEditorStore;

onMounted(() => {
  registerDiagramEventHandlers();
});

onUnmounted(() => {
  unregisterDiagramEventHandlers();
});

function registerDiagramEventHandlers() {
  EventBus.on(EVENT_TYPE.GENERATE_DIAGRAM, () => generateDiagram()); 
  EventBus.on(EVENT_TYPE.CLEAR_DIAGRAM, () => clearDiagram());
}

function unregisterDiagramEventHandlers() {
  EventBus.off(EVENT_TYPE.GENERATE_DIAGRAM);
  EventBus.off(EVENT_TYPE.CLEAR_DIAGRAM);
}
</script>

<style scoped>
</style>

