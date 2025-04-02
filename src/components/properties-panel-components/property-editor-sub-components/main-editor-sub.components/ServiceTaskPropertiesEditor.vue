<template>
    <div class="service-task-properties-editor-container" data-testid="service-task-properties-editor-container">
        here!!!
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

import EventBus from '../../../../eventbus';
import { EVENT_TYPE } from '../../../../bpmn-workflow-editor/modeler/eventTypes';

import TextInput from '../../../generic/TextInput.vue';

const model = defineModel();

watch(
  () => model, 
  () => {
    
  },
  { immediate: true, deep: true }
);
</script>

<style scoped>

</style>