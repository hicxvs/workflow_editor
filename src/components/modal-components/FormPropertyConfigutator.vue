<template>
    <div class="form-property-configurator-container" data-testid="form-property-configurator-container">
        <Modal
            :showCloseButton = "!showButton"
            :showSaveButton = "showButton"
            :showCancelButton = "showButton"
            :saveButtonClickHandler = "save"
            :cancelButtonClickHandler = "cancel"
            v-model="showModal"
        >
            <template #title>
                {{ modalTitle }}
            </template>

            <template #content>
                <TextInput v-if="formPropertyCopy" v-model="formPropertyCopy.formProperty.id" :label="formPropertiesLabels.id" />
                <TextInput v-if="formPropertyCopy" v-model="formPropertyCopy.formProperty.name" :label="formPropertiesLabels.name" />
                <TextInput v-if="formPropertyCopy" v-model="formPropertyCopy.formProperty.type" :label="formPropertiesLabels.type" />
                <TextInput v-if="formPropertyCopy" v-model="formPropertyCopy.formProperty.expression" :label="formPropertiesLabels.expression" />
                <TextInput v-if="formPropertyCopy" v-model="formPropertyCopy.formProperty.variable" :label="formPropertiesLabels.variable" />                
                <TextInput v-if="formPropertyCopy" v-model="formPropertyCopy.formProperty.pattern" :label="formPropertiesLabels.pattern" />
                <Select v-if="formPropertyCopy" v-model="formPropertyCopy.formProperty.default" :label="formPropertiesLabels.default" :selectOptionItems="formPropertySelectOptions" :clearable="isClearable" />
                <Select v-if="formPropertyCopy" v-model="formPropertyCopy.formProperty.required" :label="formPropertiesLabels.required" :selectOptionItems="formPropertySelectOptions" :clearable="isClearable" />
                <Select v-if="formPropertyCopy" v-model="formPropertyCopy.formProperty.readable" :label="formPropertiesLabels.readable" :selectOptionItems="formPropertySelectOptions" :clearable="isClearable" />
                <Select v-if="formPropertyCopy" v-model="formPropertyCopy.formProperty.writable" :label="formPropertiesLabels.writable" :selectOptionItems="formPropertySelectOptions" :clearable="isClearable" />
                <!--<TextInput v-if="formPropertyCopy" v-model="formValue" :label="formPropertiesLabels.formValue"  @input="updatesFormValue" :clearHandler="updatesFormValue"/> -->

                <ConfigurationTable
                    :title="formPropertiesLabels.formValue"
                    :headers="formValueTableHeaders"
                    v-model="formValue"
                    :createNewItemHandler="formValueHandler.create"
                    :editItemHandler="formValueHandler.edit"
                    :removeItemHandler="formValueHandler.remove"
                >
                    <template #row="{ item }">
                        <td>{{ item?.id }}</td>
                        <td>{{ item?.name }}</td>
                    </template>
                </ConfigurationTable>

            </template>
        </Modal>
    </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted } from 'vue';
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';
import { OPERATION_TYPE } from '../../bpmn-workflow-editor/modeler/operationTypes';
import { ValueType } from '../../bpmn-workflow-editor/activiti-model-definitions/activiti-model-types/value';
import { createDeepCopy } from '../../bpmn-workflow-editor/utils/create-deep-copy';
import { saveChanges } from '../../bpmn-workflow-editor/utils/save-changes';

import Modal from '../generic/Modal.vue';
import Select from '../generic/Select.vue';
import TextInput from '../generic/TextInput.vue';
import ConfigurationTable from '../generic/ConfigurationTable.vue';

const showButton = ref(true);
const isClearable = ref(false);
const showModal = ref(false);
const requestedOperation = ref(null);
const modalTitle = "Form Property Configuration";

const originalFormProperty = ref(null);
const formPropertyCopy = ref(null);
const formValue = ref(null);

const formPropertySelectOptions = ref([
    {
        value: false,
        label: 'False'
    },
    {
        value: true,
        label: 'True'
    }
]);

const formPropertiesLabels = {
    id: 'Id',        
    name: 'Name',        
    type: 'Type',        
    expression: 'Expression',        
    variable: 'Variable',        
    default: 'Default',        
    pattern: 'Pattern',        
    required: 'Required',        
    readable: 'Readable',        
    writable: 'Writable',        
    formValue: 'Form value'
};

const formValueTableHeaders = [
    'Id', 
    'Name'
];

const formValueHandler = {
    create: () => {
        EventBus.emit(EVENT_TYPE.CREATE_FORM_VALUE, {
            type: ValueType,
            field: null
        });
    },
    edit: (fieldItem) => {
        EventBus.emit(EVENT_TYPE.EDIT_FORM_VALUE,  {
            type: ValueType,
            field: fieldItem.item
        });
    },
    remove: (fieldItem) => {
        const indexToRemove = fieldItem.index;
        formValue.value = formValue.value.filter((_, index) => index !== indexToRemove);
    }
};

onMounted(() => {
    EventBus.on(EVENT_TYPE.CREATE_FORM_PROPERTY, (formProperty) => {
        requestedOperation.value = OPERATION_TYPE.CREATE;
        clearFormProperties();
        initializeFormProperty(formProperty);
        showModal.value = true;
    });

    EventBus.on(EVENT_TYPE.EDIT_FORM_PROPERTY, (formProperty) => {
        requestedOperation.value = OPERATION_TYPE.EDIT;
        clearFormProperties();
        initializeFormProperty(formProperty);
        showModal.value = true;
    });

    EventBus.on(EVENT_TYPE.ADD_CREATED_FORM_VALUE, (newformValue) => {
        formValue.value.push(newformValue);
    });

});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.CREATE_FORM_PROPERTY);
    EventBus.off(EVENT_TYPE.EDIT_FORM_PROPERTY);
    EventBus.off(EVENT_TYPE.ADD_CREATED_FORM_VALUE);
});

function clearFormProperties() {
    originalFormProperty.value = null;
    formPropertyCopy.value = null;
}

function initializeFormProperty(formProperty) {
    
    if(!formProperty.formProperty) {
        formProperty.formProperty = generateFormProperty(formProperty);
    }
    
    originalFormProperty.value = formProperty;
    formPropertyCopy.value = createDeepCopy(formProperty);
    formValue.value = formPropertyCopy.value.formProperty?.formValue || [];
}

function generateFormProperty(formProperty) {
    const defaultFalse = 'False';
    const defaultType = 'Boolean';
    return {
        $type: `activiti:${formProperty.type}`,
        id: '',        
        name: '',        
        type: defaultType,        
        expression: '',        
        variable: '',    
        pattern: '',    
        default: defaultFalse,
        required: defaultFalse,        
        readable: defaultFalse,        
        writable: defaultFalse,        
        formValue: ''        
    };
}

function updateFormValue() {
    formPropertyCopy.value.formProperty.formValue = formValue.value;
}

function save() {
    if (!requestedOperation.value) {
        return;
    }

    updateFormValue();
    saveChanges(originalFormProperty.value.formProperty, formPropertyCopy.value.formProperty);

    if(requestedOperation.value === OPERATION_TYPE.CREATE) {
        EventBus.emit(EVENT_TYPE.ADD_CREATED_FORM_PROPERTY, originalFormProperty.value);
        showModal.value = false;
        return;
    }

    EventBus.emit(EVENT_TYPE.UPDATE_EDITED_FORM_PROPERTY, originalFormProperty.value);
    showModal.value = false;   
}

function cancel() {
    requestedOperation.value = null;
}

</script>

<style scoped>
</style>