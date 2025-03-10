<template>
  <div data-testid="workflow-editor-container">
    <div ref="workflowEditorCanvasRef" data-testid="workflow-editor-container" class="workflow-editor-canvas"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createWorkflowEditor } from '../bpmn-workflow-editor/modeler';

const workflowEditorCanvasRef = ref(null);

onMounted(() => {
  if(!workflowEditorCanvasRef.value) {
    return; 
  }

  const workflowEditor = createWorkflowEditor(workflowEditorCanvasRef.value);
  console.log(workflowEditor);
  //debugger;
});

</script>

<style scoped>

</style>
