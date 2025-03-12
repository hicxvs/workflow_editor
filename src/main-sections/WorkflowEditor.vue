<template>
  <div data-testid="workflow-editor-container">
    <div ref="workflowEditorCanvasRef" data-testid="workflow-editor-canvas" class="workflow-editor-canvas"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';

import StateManager from '../state-manager';

const workflowEditorStore = StateManager.useWorkflowEditorStore();
const { unregisterWorkflowEditorEventHandlers,
        destroyWorkflowEditor,
        initializeWorkflowEditor,
        registerWorkflowEditorEventHandlers,
      } = workflowEditorStore;

const workflowEditorCanvasRef = ref(null);

onBeforeMount(() => {
  unregisterWorkflowEditorEventHandlers();
  destroyWorkflowEditor();
});

onMounted(() => {
  initializeWorkflowEditor(workflowEditorCanvasRef.value);
  registerWorkflowEditorEventHandlers();  
});

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
