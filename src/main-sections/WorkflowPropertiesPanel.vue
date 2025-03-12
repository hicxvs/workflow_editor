<template>
  <div class="properties-panel" data-testid="properties-panel">
    <ActionButtonGroup />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import ActionButtonGroup from "../components/properties-panel-components/ActionButtonGroup.vue";
import { EVENT_TYPE } from "../bpmn-workflow-editor/modeler/eventTypes";
import EventBus from "../eventbus";
import StateManager from "../state-manager";

const workflowEditorStore = StateManager.useWorkflowEditorStore();
const { generateDiagram, clearDiagram } = workflowEditorStore;

onMounted(() => {
  EventBus.on(EVENT_TYPE.GENERATE_DIAGRAM, () => generateDiagram()); 
  EventBus.on(EVENT_TYPE.CLEAR_DIAGRAM, () => clearDiagram());
});

onUnmounted(() => {
  EventBus.off(EVENT_TYPE.GENERATE_DIAGRAM);
  EventBus.off(EVENT_TYPE.CLEAR_DIAGRAM);
});
</script>

<style scoped>
</style>

