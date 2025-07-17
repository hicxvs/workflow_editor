<template>
  <div class="process-definition-container" data-testid="process-definition-container">
    <Card :title="cardProps.title" :subtitle="cardProps.subtitle" :text="cardProps.text">
      <template #content>
        <div class="input-group">
          <TextInput v-if="model" :label="inputLabel.id" v-model="model.id" />
          <TextInput v-if="model" :label="inputLabel.name" v-model="model.name" />
          <Checkbox v-if="model" :label="inputLabel.isExecutable" v-model="model.isExecutable" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from "../generic/Card.vue";
import TextInput from "../generic/TextInput.vue";
import Checkbox from "../generic/Checkbox.vue";

const model = defineModel();

const cardProps = {
  title: "Process Definition",
  subtitle: "",
  text: ""
};

const inputLabel = {
  id: "Process ID",
  name: "Process Name",
  isExecutable: "Is Executable"
};

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
