<template>
  <div class="properties-panel" data-testid="properties-panel">
    <ProcessDefinition v-model="currentProcessDefinition" class="mb-6" />
    <ProcessMessagesEditor v-model="processMessages" class="mb-6" />
    <PropertyEditor v-model="currentWorkingElementProperties" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import StateManager from "../state-manager";
import { storeToRefs } from "pinia";

import ProcessDefinition from "../components/properties-panel-components/ProcessDefinition.vue";
import ProcessMessagesEditor from "../components/properties-panel-components/ProcessMessagesEditor.vue";
import PropertyEditor from "../components/properties-panel-components/PropertyEditor.vue";

const workflowEditorStore = StateManager.useWorkflowEditorStore();
const { currentProcessDefinition, currentWorkingElementProperties, currentDiagramMessages, currentDiagramErrorMessages} = storeToRefs(workflowEditorStore);

const processMessages = ref({
  diagramMessages: currentDiagramMessages,
  diagramErrorMessages: currentDiagramErrorMessages
});

</script>

<style scoped>
.properties-panel {
  padding: 16px;
  width: 98%;
  height: 96vh;
}


</style>

