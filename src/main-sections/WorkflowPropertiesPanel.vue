<template>
  <div class="properties-panel" data-testid="properties-panel">
    <ProcessDefinition v-model="currentProcessDefinition" class="mb-6" />
    <ProcessMessagesEditor v-if="showProcessMessagesEditor" v-model="processMessages" class="mb-6" />
    <PropertyEditor v-if="showPropertyEditor" v-model="currentWorkingElementProperties" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import EventBus from '../eventbus';
import { EVENT_TYPE } from '../bpmn-workflow-editor/modeler/eventTypes';
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

const showProcessMessagesEditor = ref(false);
const showPropertyEditor = ref(false);

onMounted(() => {
  EventBus.on(EVENT_TYPE.CANVAS_SELECTED, () => {
    showProcessMessagesEditor.value = true;
  });

  EventBus.on(EVENT_TYPE.CANVAS_DESELECTED, () => {
    showProcessMessagesEditor.value = false;
  });

  EventBus.on(EVENT_TYPE.ELEMENT_SELECTED, () => {
    showPropertyEditor.value = true;
  });

  EventBus.on(EVENT_TYPE.ELEMENT_DESELECTED, () => {
    showPropertyEditor.value = false;
  });
});

onUnmounted(() => {
  EventBus.off(EVENT_TYPE.CANVAS_SELECTED);
  EventBus.off(EVENT_TYPE.CANVAS_DESELECTED);
  EventBus.off(EVENT_TYPE.ELEMENT_SELECTED);
  EventBus.off(EVENT_TYPE.ELEMENT_DESELECTED);
});

</script>

<style scoped>
.properties-panel {
  padding: 16px;
  width: 98%;
  height: 96vh;
}


</style>

