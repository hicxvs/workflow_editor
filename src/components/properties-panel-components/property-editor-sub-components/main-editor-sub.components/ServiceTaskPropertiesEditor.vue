<template>
    <div class="service-task-properties-editor-container" data-testid="service-task-properties-editor-container">
        <Select :label="serviceTaskPropertiesLabels.serviceTaskType" v-model="serviceTaskExpressionType" :selectOptionItems="serviceTaskExpressionTypeSelectOptions" :selectItemClickHandler="updatesServiceTaskExpressionType" :clearable="isClearable" />

        <TextInput v-if="serviceTaskExpressionType?.toLowerCase() === fieldKeys.class" :label="serviceTaskPropertiesLabels.class" v-model="serviceTaskClass" @input="filterJavaClasses" :clearHandler="filterJavaClasses"/>

        <Select v-if="showFilterClassSelect" :label="classSelectorLabel" v-model="selectedClass" :selectOptionItems="filteredClasses" :clearable="isClearable" :openMenu="showFilterClassSelectAlreadyOpen" :selectItemClickHandler="updateServiceTaskClass" />

        <TextInput v-if="serviceTaskExpressionType?.toLowerCase() === fieldKeys.expression" :label="serviceTaskPropertiesLabels.expression" v-model="serviceTaskExpression" @input="updateServiceTaskExpression" :clearHandler="updateServiceTaskExpression"/>

        <TextInput v-if="serviceTaskExpressionType?.toLowerCase() === fieldKeys.delegateExpression" :label="serviceTaskPropertiesLabels.delegateExpression" v-model="serviceTaskDelegateExpression" @input="updateServiceTaskDelegateExpression" :clearHandler="updateServiceTaskDelegateExpression"/>
        <SkipExpressionPropertyEditor v-model="model" />

        <TextInput :label="serviceTaskPropertiesLabels.resultVariable" v-model="serviceTaskResultVariable" @input="updateResultVariable" :clearHandler="updateResultVariable"/>
        
        <ConfigurationTable
            :title="serviceTaskPropertiesLabels.fields"
            :headers="fieldsHeaders"
            v-model="serviceTaskExtentionElementsCopy.values"
            :createNewItemHandler="serviceTaskFieldHandler.create"
            :editItemHandler="serviceTaskFieldHandler.edit"
            :removeItemHandler="serviceTaskFieldHandler.remove"
        >
            <template #row="{ item }">
                <td>{{ item?.name }}</td>
                <td>{{ item?.string }}</td>
                <td>{{ item?.expression }}</td>
            </template>
        </ConfigurationTable>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

import ServiceTask from '../../../../bpmn-workflow-editor/activiti-model-definitions/activiti-model-types/service-task';
import EventBus from '../../../../eventbus';
import { EVENT_TYPE } from '../../../../bpmn-workflow-editor/modeler/eventTypes';
import { ClassFilterer } from '../../../../bpmn-workflow-editor/utils/class-filterer';
import { createDeepCopy } from '../../../../bpmn-workflow-editor/utils/create-deep-copy';
import { FieldType } from '../../../../bpmn-workflow-editor/activiti-model-definitions/activiti-model-types/field';
import { ELEMENT_TYPES } from '../../../../bpmn-workflow-editor/modeler/modelerTypes/elementTypes';

import Select from '../../../generic/Select.vue';
import TextInput from '../../../generic/TextInput.vue';
import SkipExpressionPropertyEditor from './SkipExpressionPropertyEditor.vue';
import ConfigurationTable from '../../../generic/ConfigurationTable.vue';
import { saveChanges } from '../../../../bpmn-workflow-editor/utils/save-changes';

const model = defineModel();
const isClearable = ref(false);
const serviceTaskExpressionType = ref(null);
const serviceTaskClass = ref(null);
const serviceTaskExpression = ref(null);
const serviceTaskDelegateExpression = ref(null);
const serviceTaskResultVariable = ref(null);

const classFilterer = ref(null);
const filteredClasses = ref(null);
const selectedClass = ref(null);
const showFilterClassSelect = ref(false);
const showFilterClassSelectAlreadyOpen = ref(true);
const classSelectorLabel = 'Select a class';

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

const originalServiceTaskExtentionElements = ref(null);
const serviceTaskExtentionElementsCopy = ref(null);

const fieldsHeaders = [
    'Field name',
    'String value',
    'Expression'
];

const serviceTaskPropertiesLabels = {
    serviceTaskType: 'Service Task Type',
    resultVariable: 'Result Variable',
    class: 'Class Name',
    expression: 'Expression',
    delegateExpression: 'Delegate Expression',
    fields: 'Fields'
};

const fieldKeys = {
    serviceTaskExpressionType: 'serviceTaskExpressionType',
    resultVariable: 'resultVariable',
    class: 'class',
    expression: 'expression',
    delegateExpression: 'delegateExpression',
    fields: 'fields'
};

const serviceTaskFieldHandler = {
    create: () => {
        EventBus.emit(EVENT_TYPE.CREATE_SERVICE_TASK_FIELD, {
            type: FieldType,
            field: null
        });
    },
    edit: (fieldItem) => {
        EventBus.emit(EVENT_TYPE.EDIT_SERVICE_TASK_FIELD,  {
            type: FieldType,
            field: fieldItem.item
        });
    },
    remove: (fieldItem) => {
        const indexToRemove = fieldItem.index;
        serviceTaskExtentionElementsCopy.value.values = serviceTaskExtentionElementsCopy.value.values.filter((_, index) => index !== indexToRemove);
        save();
    }
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


function filterJavaClasses() {
    const searchedClass = serviceTaskClass.value;
    filteredClasses.value = classFilterer.value?.fitlerClasses(searchedClass);

    if(!filteredClasses.value.length) {
        showFilterClassSelect.value = false;
        return;
    }

    showFilterClassSelect.value = true;
}

function updateServiceTaskClass() {
    serviceTaskClass.value = selectedClass.value;
    updateProperty(fieldKeys.class, serviceTaskClass.value);
    showFilterClassSelect.value = false;
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

function generateNewExtentionElements(listener) {
    return {
        $type: `${ELEMENT_TYPES.EXTENTION_ELEMENTS}`,
        values: []
    };
}

onMounted(() => {
    EventBus.emit(EVENT_TYPE.LOAD_WORKFLOW_JAVA_CLASSES);

    EventBus.on(EVENT_TYPE.WORKFLOW_JAVA_CLASSES_READY, (classes) => {
        if(!classes || !Array.isArray(classes)) {
            return;
        }

        selectedClass.value = null;
        classFilterer.value = null;
        classFilterer.value = ClassFilterer(classes);
    });

    EventBus.on(EVENT_TYPE.ADD_CREATED_SERVICE_TASK_FIELD, (newFieldItem) => {
        if(!newFieldItem) {
            return;
        }

        serviceTaskExtentionElementsCopy.value.values.push(newFieldItem.field);
        save();
    });

    EventBus.on(EVENT_TYPE.UPDATE_SERVICE_TASK_FIELD, (updatedFieldItem) => {
        if(!updatedFieldItem) {
            return;
        }

        save();
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.WORKFLOW_JAVA_CLASSES_READY);
    EventBus.off(EVENT_TYPE.ADD_CREATED_SERVICE_TASK_FIELD);
    EventBus.off(EVENT_TYPE.UPDATE_SERVICE_TASK_FIELD);
});

watch(
  () => model, 
  () => {
    serviceTaskExpressionType.value = setServiceTaskExpressionType(model.value?.serviceTaskExpressionType);
    serviceTaskResultVariable.value = model.value?.resultVariable || '';
    serviceTaskClass.value = model.value?.class || '';
    serviceTaskExpression.value = model.value?.expression || '';
    serviceTaskDelegateExpression.value = model.value?.delegateExpression || '';
    originalServiceTaskExtentionElements.value = model.value?.extensionElements || generateNewExtentionElements();
    serviceTaskExtentionElementsCopy.value = createDeepCopy(originalServiceTaskExtentionElements.value);
  },
  { immediate: true, deep: true }
);

function save() {
    saveChanges(originalServiceTaskExtentionElements.value.values, serviceTaskExtentionElementsCopy.value.values);

    EventBus.emit(EVENT_TYPE.SAVE_SERVICE_TASK_FIELD, originalServiceTaskExtentionElements.value);
}
</script>

<style scoped>

</style>