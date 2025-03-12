<template>
  <div data-testid="workflow-editor-container">
    <div ref="workflowEditorCanvasRef" data-testid="workflow-editor-canvas" class="workflow-editor-canvas"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { createWorkflowEditor } from '../../bpmn-workflow-editor/modeler';
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';

const workflowEditorCanvasRef = ref(null);
const modelerRef = ref(null);

onBeforeMount(() => {
  destroyWorkflowEditor();
  unregisterWorkflowEditorEventHandlers();
});

onMounted(() => {
  initializeWorkflowEditor();
  registerWorkflowEditorEventHandlers();  
});

function initializeWorkflowEditor() {
  if(!workflowEditorCanvasRef.value) {
    return; 
  }

  const {modeler} = createWorkflowEditor(workflowEditorCanvasRef.value);
  modelerRef.value = modeler;
}

function destroyWorkflowEditor() {
  if(modelerRef.value) {
    modelerRef.value.destroy();
  }
}

function registerWorkflowEditorEventHandlers() {
  EventBus.on(EVENT_TYPE.UPDATE_ELEMENT, (element) => {
    console.log('update current working element on store');
    console.log('UPDATE_ELEMENT', element);
  });

  EventBus.on(EVENT_TYPE.UPDATE_NAVIGATION_PATH, (navigationPath) => {
    console.log('UPDATE_NAVIGATION_PATH', navigationPath);
  });
}

function unregisterWorkflowEditorEventHandlers() {
  EventBus.off(EVENT_TYPE.UPDATE_ELEMENT);
  EventBus.off(EVENT_TYPE.UPDATE_NAVIGATION_PATH);
}

</script>

<style scoped>
.workflow-editor-canvas {
  height: 98vh;
  border:1 px solid #e0e0e0;
}

.djs-palette.two-column.open {
  width: 45px !important
}
</style>
