<template>
  <div class="process-definition-container" data-testid="process-definition-container">
    <h1>Process Definition</h1>
    <div>{{ processDefinition?.id }}</div>
    <div>{{ processDefinition?.name }}</div>
    <div>{{ processDefinition?.isExecutable }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  processDefinition: {
    type: Object,
    required: false,  
    default: () => ({
      name: '',
      id: '',
      isExecutable: false    
    })
  }
});


</script>

<style scoped>
</style>

