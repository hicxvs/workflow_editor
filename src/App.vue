<template>
  <div class="app-layout-container">
    <div class="section-navbar">
      <h1>Navbar goes here</h1>
    </div>

    <div class="main-content">
      <div class="section-workflow-editor">
        <WorkflowEditor />
      </div>

      <div class="section-properties-panel">
        <PropertiesPanel />
      </div>
    </div>
  </div>
</template>

<script setup>
import WorkflowEditor from './components/WorkflowEditor.vue';
import PropertiesPanel from './components/PropertiesPanel.vue';
</script>

<style scoped>
/* Ensure the container fills the viewport without scrolling */
.app-layout-container {
  display: flex;
  flex-direction: column;
  width: 100vw; /* Full viewport width */
  height: 100vh; /* Full viewport height */
  overflow: hidden; /* Prevent scrolling */
}

.section-navbar {
  text-align: center;
  flex: 0 0 auto; /* Keeps the navbar at its height */
}

.main-content {
  display: flex;
  flex: 1; /* Takes up the remaining space below the navbar */
}

.section-workflow-editor {
  flex: 0 0 60%; /* Occupies 60% of the width */
  box-sizing: border-box; /* Ensures padding doesn't cause overflow */
}

.section-properties-panel {
  flex: 1; /* Occupies the remaining width */
  background-color: #d8d8d8; /* Example background color */
  padding: 1rem;
  box-sizing: border-box; /* Ensures padding doesn't cause overflow */
}
</style>
