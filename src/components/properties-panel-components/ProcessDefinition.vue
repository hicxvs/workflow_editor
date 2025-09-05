<template>
  <div class="process-definition-container" data-testid="process-definition-container">
    <Card :title="cardProps.title" :subtitle="cardProps.subtitle" :text="cardProps.text">
      <template #content>
        <div class="input-group">
          <TextInput v-if="model" :label="inputLabel.id" v-model="processDefinition.id" @input="updateProcessDefinitionId" />
          <TextInput v-if="model" :label="inputLabel.name" v-model="processDefinition.name" @input="updateProcessDefinitionName" />
          <Checkbox v-if="model" :label="inputLabel.isExecutable" v-model="processDefinition.isExecutable" @update:modelValue="updateProcessDefinitionIsExecutable"/>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';
import EventBus from '../../eventbus';
import Card from "../generic/Card.vue";
import TextInput from "../generic/TextInput.vue";
import Checkbox from "../generic/Checkbox.vue";
import { GLOBAL_DEBOUNCE_TIME } from '../../config';
import { debounce } from "../../bpmn-workflow-editor/utils/debounce";

const model = defineModel();

const processDefinition = ref({
  id: '',
  name: '',
  isExecutable: false
});

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

const fieldKeys = {
    id: 'id',
    name: 'name',
    isExecutable: 'isExecutable'
};

const updateProcessDefinition = debounce((propertyKey, propertyValue) => {
  EventBus.emit(EVENT_TYPE.UPDATE_PROCESS_DEFINITION, {
    elementId: model.value?.id,
    elementProperty: propertyKey,
    elementPropertyValue: propertyValue
  });
}, GLOBAL_DEBOUNCE_TIME);

function updateProcessDefinitionId() {
  updateProcessDefinition(fieldKeys.id, processDefinition.value.id);
}

function updateProcessDefinitionName() {
  updateProcessDefinition(fieldKeys.name, processDefinition.value.name);
}

function updateProcessDefinitionIsExecutable() {
  updateProcessDefinition(fieldKeys.isExecutable, processDefinition.value.isExecutable);
}

watch(
  () => model.value,
  () => {
    processDefinition.value.id = model.value?.id || '';
    processDefinition.value.name = model.value?.name || '';
    processDefinition.value.isExecutable = model.value?.isExecutable || false; 
  },
  { immediate: true, deep: true}
);

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