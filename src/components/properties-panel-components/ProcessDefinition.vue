<template>
  <div class="process-definition-container" data-testid="process-definition-container">

    <Card title="Process Definition" subtitle="Process Definition" text="Process Definition">
      <template #content>
        <div class="input-group">
          <TextInput v-if="model" label="Process ID" v-model="model.id" />
          <TextInput v-if="model" label="Process Name" v-model="model.name" />
          <TextInput v-if="model" label="Is Executable" v-model="model.isExecutable" />
        </div>
      </template>
    </Card>

  </div>
</template>

<script setup>
import Card from "../generic/Card.vue";
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
  padding: 0 16px;
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
