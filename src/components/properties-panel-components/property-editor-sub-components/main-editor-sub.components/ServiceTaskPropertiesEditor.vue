<template>
    <div class="service-task-properties-editor-container" data-testid="service-task-properties-editor-container">
        <Select :label="serviceTaskPropertiesLabels.serviceTaskType" v-model="serviceTaskExpressionType" :selectOptionItems="serviceTaskExpressionTypeSelectOptions" :selectItemClickHandler="updatesServiceTaskExpressionType" :clearable="isClearable" />
        <TextInput v-if="serviceTaskExpressionType?.toLowerCase() === fieldKeys.class" :label="serviceTaskPropertiesLabels.class" v-model="serviceTaskClass" @input="updateServiceTaskClass" :clearHandler="updateServiceTaskClass"/>
        <TextInput v-if="serviceTaskExpressionType?.toLowerCase() === fieldKeys.expression" :label="serviceTaskPropertiesLabels.expression" v-model="serviceTaskExpression" @input="updateServiceTaskExpression" :clearHandler="updateServiceTaskExpression"/>
        <TextInput v-if="serviceTaskExpressionType?.toLowerCase() === fieldKeys.delegateExpression" :label="serviceTaskPropertiesLabels.delegateExpression" v-model="serviceTaskDelegateExpression" @input="updateServiceTaskDelegateExpression" :clearHandler="updateServiceTaskDelegateExpression"/>
        <SkipExpressionPropertyEditor v-model="model" />
        <TextInput :label="serviceTaskPropertiesLabels.resultVariable" v-model="serviceTaskResultVariable" @input="updateResultVariable" :clearHandler="updateResultVariable"/>
        
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

import EventBus from '../../../../eventbus';
import { EVENT_TYPE } from '../../../../bpmn-workflow-editor/modeler/eventTypes';
import ServiceTask from '../../../../bpmn-workflow-editor/activiti-model-definitions/activiti-model-types/service-task';

import Select from '../../../generic/Select.vue';
import TextInput from '../../../generic/TextInput.vue';
import SkipExpressionPropertyEditor from './SkipExpressionPropertyEditor.vue';

const model = defineModel();
const isClearable = ref(false);
const serviceTaskExpressionType = ref(null);
const serviceTaskClass = ref(null);
const serviceTaskExpression = ref(null);
const serviceTaskDelegateExpression = ref(null);
const serviceTaskResultVariable = ref(null);

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
    resultVariable: 'Result Variable',
    class: 'Class Name',
    expression: 'Expression',
    delegateExpression: 'Delegate Expression'
};

const fieldKeys = {
    serviceTaskExpressionType: 'serviceTaskExpressionType',
    resultVariable: 'resultVariable',
    class: 'class',
    expression: 'expression',
    delegateExpression: 'delegateExpression'
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
    updateProperty(fieldKeys.resultVariable, serviceTaskResultVariable.value);
}

function updateServiceTaskClass() {
    updateProperty(fieldKeys.class, serviceTaskClass.value);
}

function updateServiceTaskExpression() {
    updateProperty(fieldKeys.expression, serviceTaskExpression.value);
}

function updateServiceTaskDelegateExpression() {
    updateProperty(fieldKeys.delegateExpression, serviceTaskDelegateExpression.value);
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
    serviceTaskResultVariable.value = model.value?.resultVariable || '';
    serviceTaskClass.value = model.value?.class || '';
    serviceTaskExpression.value = model.value?.expression || '';
    serviceTaskDelegateExpression.value = model.value?.delegateExpression || '';
  },
  { immediate: true, deep: true }
);
</script>

<style scoped>

</style>