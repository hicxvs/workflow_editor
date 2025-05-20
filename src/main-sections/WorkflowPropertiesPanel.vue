<template>
  <div class="properties-panel" data-testid="properties-panel">
    <ProcessDefinition v-model="currentProcessDefinition" class="mb-6" />
    <MessageEditor v-if="isBackgroundSelected" v-model="currentDiagramMessages" class="mb-6" />
    <ErrorMessageEditor v-if="isBackgroundSelected" v-model="currentDiagramErrorMessages" class="mb-6" />
    <PropertyEditor v-model="currentWorkingElementProperties" />
  </div>
</template>

<script setup>
import StateManager from "../state-manager";
import { storeToRefs } from "pinia";

import ProcessDefinition from "../components/properties-panel-components/ProcessDefinition.vue";
import MessageEditor from "../components/properties-panel-components/MessageEditor.vue";
import ErrorMessageEditor from "../components/properties-panel-components/ErrorMessageEditor.vue";
import PropertyEditor from "../components/properties-panel-components/PropertyEditor.vue";

const workflowEditorStore = StateManager.useWorkflowEditorStore();
const { currentProcessDefinition, currentWorkingElementProperties, currentDiagramMessages, currentDiagramErrorMessages, isBackgroundSelected } = storeToRefs(workflowEditorStore);
</script>

<style scoped>
.properties-panel {
  padding: 16px;
  width: 98%;
  height: 96vh;
}


</style>

