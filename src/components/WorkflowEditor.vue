<template>
  <div data-testid="workflow-editor-container">
    <div ref="workflowEditorCanvasRef" data-testid="workflow-editor-container" class="workflow-editor-canvas"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createWorkflowEditorModeler } from '../bpmn-workflow-editor/modeler';

const workflowEditorCanvasRef = ref(null);

onMounted(() => {
  if(!workflowEditorCanvasRef.value) {
    return; 
  }

  const modeler = createWorkflowEditorModeler(workflowEditorCanvasRef.value);
  console.log(modeler);
  debugger;
});

</script>

<style scoped>

</style>
