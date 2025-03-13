<template>
  <div class="process-definition-container" data-testid="process-definition-container">
    <h1>Process Definition</h1>

    <div class="input-group">
      <TextInput v-if="model?.id" label="Process ID" v-model="model.id" />
      <TextInput v-if="model?.name" label="Process Name" v-model="model.name" />
      <TextInput v-if="model?.isExecutable" label="Is Executable" v-model="model.isExecutable" />
    </div>
  </div>
</template>

<script setup>
import TextInput from "../generic/TextInput.vue";
const model = defineModel();

</script>

<style scoped>
.process-definition-container {
  display: flex;
  flex-direction: column;
}

.input-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; 
  justify-content: space-between;
}

.input-group > * {
  flex: 1 1 calc(33.333% - 10px); 
  min-width: 150px;
}

@media (max-width: 600px) {
  .input-group {
    flex-direction: column;
    gap: 5px; 
  }

  .input-group > * {
    flex: 1 1 100%;
  }
}
</style>
