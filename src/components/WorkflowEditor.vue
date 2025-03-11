<template>
  <div data-testid="workflow-editor-container">
    <div ref="workflowEditorCanvasRef" data-testid="workflow-editor-container" class="workflow-editor-canvas full-height full-width"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { createWorkflowEditor } from '../bpmn-workflow-editor/modeler';
import EventBus from '../eventbus';
import { EVENT_TYPE } from '../bpmn-workflow-editor/modeler/eventTypes';

const workflowEditorCanvasRef = ref(null);
const modelerRef = ref(null);

onBeforeMount(() => {
  if(modelerRef.value) {
    modelerRef.value.destroy();
  }
});

onMounted(() => {
  if(!workflowEditorCanvasRef.value) {
    return; 
  }

  const {modeler} = createWorkflowEditor(workflowEditorCanvasRef.value);
  modelerRef.value = modeler;

  EventBus.on(EVENT_TYPE.UPDATE_ELEMENT, (element) => {
    console.log('update current working element on store');
    console.log('UPDATE_ELEMENT', element);
  });

  EventBus.on(EVENT_TYPE.UPDATE_NAVIGATION_PATH, (navigationPath) => {
    console.log('UPDATE_NAVIGATION_PATH', navigationPath);
  });
  
});

</script>

<style scoped>

</style>
