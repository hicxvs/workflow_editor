<template>
    <div class="form-key-property-editor-container" data-testid="form-key-property-editor-container">
        <TextInput :label="inputTaskPropertiesLabels.formKey" v-model="formKey" @input="updatesFormKey" :clearHandler="updatesFormKey"/>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

import EventBus from '../../../../eventbus';
import { EVENT_TYPE } from '../../../../bpmn-workflow-editor/modeler/eventTypes';
import UserTask from '../../../../bpmn-workflow-editor/activiti-model-definitions/activiti-model-types/user-task';
import StartEvent from '../../../../bpmn-workflow-editor/activiti-model-definitions/activiti-model-types/start-event';

import TextInput from '../../../generic/TextInput.vue';

const model = defineModel();
const formKey = ref(null);

const inputTaskPropertiesLabels = {
    formKey: "Form Key",
}

const fieldKeys = {
    formKey: 'formKey'
};

const elementTypes = {
    userTasK: 'bpmn:UserTask',
    startEvent: 'bpmn:StartEvent'
};

function updatesFormKey() {
    let targetProperty = StartEvent.properties.find(property => property.ns.localName === fieldKeys.formKey);

    if(model.value?.$type === elementTypes.userTasK) {
        targetProperty = UserTask.properties.find(property => property.ns.localName === fieldKeys.formKey);
    }

    EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT_PROPERTY, 
        {
            elementId: model.value?.id,
            elementProperty: targetProperty.ns.localName,
            elementPropertyValue: formKey.value
        }
    );
}



watch(
  () => model, 
  () => {
    formKey.value = model.value?.formKey || '';
  },
  { immediate: true, deep: true }
);

</script>

<style scoped>
</style>