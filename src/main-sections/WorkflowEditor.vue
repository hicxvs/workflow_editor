<template>
  <div data-testid="workflow-editor-container">
    <TabPanels />
    <div ref="workflowEditorCanvasRef" data-testid="workflow-editor-canvas" class="workflow-editor-canvas"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import StateManager from '../state-manager';
import TabPanels from '../components/singleton-components/TabPanels.vue';

const workflowEditorStore = StateManager.useWorkflowEditorStore();
const { unregisterWorkflowEditorEventHandlers,
        destroyWorkflowEditor,
        initializeWorkflowEditor,
        registerWorkflowEditorEventHandlers
      } = workflowEditorStore;

const workflowEditorCanvasRef = ref(null);

onMounted(async () => {
  initializeWorkflowEditor(workflowEditorCanvasRef.value);
  registerWorkflowEditorEventHandlers();  
});

onUnmounted(() => {
  unregisterWorkflowEditorEventHandlers();
  destroyWorkflowEditor();
});

</script>

<style scoped>
.workflow-editor-canvas {
  height: 89vh;
  border:1 px solid #e0e0e0;
}

.djs-palette.two-column.open {
  width: 45px !important
}
</style>
