<template>
  <div class="app-layout-container">
    <div class="section-navbar">
      <h1>Navbar goes here</h1>
    </div>

    <div class="main-content">
      <div class="section-workflow-editor" :style="{ flex: workflowEditorFlex }">
        <WorkflowEditor />
      </div>

      <div class="resizer" @mousedown="startResizing"></div>

      <div class="section-properties-panel" :style="{ flex: propertiesPanelFlex }">
        <PropertiesPanel />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WorkflowEditor from './components/WorkflowEditor.vue';
import PropertiesPanel from './components/PropertiesPanel.vue';

const workflowEditorFlex = ref(3); // Initial flex ratio for the workflow editor
const propertiesPanelFlex = ref(2); // Initial flex ratio for the properties panel
let isUserResizing = false;

function startResizing(event) {
  isUserResizing = true;
  const containerTotalWidth = event.target.parentElement.offsetWidth;
  const initialMousePositionX = event.clientX;
  const initialWorkflowFlexRatio = workflowEditorFlex.value;
  
  function stopResizing() {
    isUserResizing = false;
    window.removeEventListener('mousemove', updatePanelSizes);
    window.removeEventListener('mouseup', stopResizing);
  }

  function updatePanelSizes(event) {
    if (!isUserResizing){
      return;
    }

    // Constants for configurable values
    const maxPanelFlexRatio = 4; // Maximum flex value (80%)
    const minPanelFlexRatio = 1; // Minimum flex value (20%)
    const totalFlexRatio = 5; // Total flex value for both panels combined
    const dragSensitivityMultiplier = 5; // Sensitivity for drag-to-flex conversion

    const horizontalDragDistance = event.clientX - initialMousePositionX;
    const flexChangeRatio = (horizontalDragDistance / containerTotalWidth) * dragSensitivityMultiplier;

    // Calculate new flex ratios within constraints
    const updatedWorkflowFlex = Math.min(
        Math.max(initialWorkflowFlexRatio + flexChangeRatio, minPanelFlexRatio), // Minimum 20%
        maxPanelFlexRatio // Maximum 80%
    );
    const updatedPropertiesFlex = totalFlexRatio - updatedWorkflowFlex;

    if ( updatedWorkflowFlex <= maxPanelFlexRatio && updatedWorkflowFlex >= minPanelFlexRatio && updatedPropertiesFlex <= maxPanelFlexRatio && updatedPropertiesFlex >= minPanelFlexRatio ) {
        workflowEditorFlex.value = updatedWorkflowFlex;
        propertiesPanelFlex.value = updatedPropertiesFlex;
    }
  }

  window.addEventListener('mousemove', updatePanelSizes);
  window.addEventListener('mouseup', stopResizing);
}


</script>

<style scoped>
.app-layout-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.section-navbar {
  text-align: center;
  flex: 0 0 auto;
}

.main-content {
  display: flex;
  flex: 1;
  position: relative;
}

.section-workflow-editor,
.section-properties-panel {
  overflow: auto;
  box-sizing: border-box;
}

.resizer {
  width: 5px;
  background-color: #e9ecef;
  cursor: col-resize;
  position: relative;
  z-index: 1;
}

.resizer:hover,
.resizer:active {
  background-color: #0d6efd;
}

.main-content.resizing {
  user-select: none;
}

</style>
