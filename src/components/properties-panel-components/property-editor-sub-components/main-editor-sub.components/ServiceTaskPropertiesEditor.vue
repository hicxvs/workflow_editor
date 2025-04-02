<template>
    <div class="service-task-properties-editor-container" data-testid="service-task-properties-editor-container">
        <Select :label="serviceTaskPropertiesLabels.serviceTaskType" v-model="serviceTaskExpressionType" :selectOptionItems="serviceTaskExpressionTypeSelectOptions" :selectItemClickHandler="updatesServiceTaskExpressionType" :clearable="isClearable" />
        <TextInput :label="serviceTaskPropertiesLabels.resultVariable" v-model="resultVariable" @input="updateResultVariable" :clearHandler="updateResultVariable"/>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

import EventBus from '../../../../eventbus';
import { EVENT_TYPE } from '../../../../bpmn-workflow-editor/modeler/eventTypes';
import ServiceTask from '../../../../bpmn-workflow-editor/activiti-model-definitions/activiti-model-types/service-task';

import Select from '../../../generic/Select.vue';
import TextInput from '../../../generic/TextInput.vue';

const model = defineModel();
const isClearable = ref(false);
const serviceTaskExpressionType = ref(null);
const resultVariable = ref(null);

const serviceTaskExpressionTypeSelectOptions = ref([
    {
        value: 'class',
        label: 'Class'
    },
    {
        value: 'expression',
        label: 'Expression'
    },
    {
        value: 'delegateExpression',
        label: 'Delegate Expression'
    }
]);

const serviceTaskPropertiesLabels = {
    serviceTaskType: 'Service Task Type',
    resultVariable: 'Result Variable'
};

const fieldKeys = {
    serviceTaskExpressionType: 'serviceTaskExpressionType',
    resultVariable: 'resultVariable'
};

function setServiceTaskExpressionType(serviceTaskExpressionType) {
    
    if(!serviceTaskExpressionType) {
        return serviceTaskExpressionTypeSelectOptions.value[0].label;
    }

    return serviceTaskExpressionTypeSelectOptions.value.find(type => type.value === serviceTaskExpressionType).label;
}

function updatesServiceTaskExpressionType() {
    if(!serviceTaskExpressionType.value) {
        return;
    }

    const selectedExpressionType = serviceTaskExpressionTypeSelectOptions.value.find(type => type.label === serviceTaskExpressionType.value).value;
    updateProperty(fieldKeys.serviceTaskExpressionType, selectedExpressionType);
}

function updateResultVariable() {
    updateProperty(fieldKeys.resultVariable, resultVariable.value);
}


function updateProperty(propertyKey, propertyValue) {
    const targetProperty = ServiceTask.properties.find(property => property.ns.localName === propertyKey);

    EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT_PROPERTY, 
        {
            elementId: model.value?.id,
            elementProperty: targetProperty.ns.localName,
            elementPropertyValue: propertyValue
        }
    );
}

watch(
  () => model, 
  () => {  

    serviceTaskExpressionType.value = setServiceTaskExpressionType(model.value?.serviceTaskExpressionType);
    resultVariable.value = model.value?.resultVariable || '';
    
  },
  { immediate: true, deep: true }
);
</script>

<style scoped>

</style>