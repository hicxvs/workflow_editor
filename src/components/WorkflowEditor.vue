<template>
  <div data-testid="workflow-editor-container">
    <div ref="workflowEditorCanvasRef" data-testid="workflow-editor-container" class="workflow-editor-canvas full-height full-width"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { createWorkflowEditor } from '../bpmn-workflow-editor/modeler';

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
});

</script>

<style scoped>

</style>
