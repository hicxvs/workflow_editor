<template>
    <div class="service-task-field-configurator-container" data-testid="service-task-field-configurator-container">
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
                <TextInput :label="fieldInputLabels.name" v-model="fieldCopy.field.name" :clearable="isClearable" />
                <TextArea  :label="fieldInputLabels.string" v-model="fieldCopy.field.string" :clearable="isClearable" />
                <TextArea  :label="fieldInputLabels.expression" v-model="fieldCopy.field.expression" :clearable="isClearable" />
            </template>
        </Modal>
    </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted } from 'vue';
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';
import { OPERATION_TYPE } from '../../bpmn-workflow-editor/modeler/operationTypes';
import { createDeepCopy } from '../../bpmn-workflow-editor/utils/create-deep-copy';
import { saveChanges } from '../../bpmn-workflow-editor/utils/save-changes';

import Modal from '../generic/Modal.vue';
import TextInput from '../generic/TextInput.vue';
import TextArea from '../generic/TextArea.vue';

const requestedOperation = ref(null);
const isClearable = ref(false);
const showButton = ref(true);
const showModal = ref(false);
const originalField = ref(null);
const fieldCopy = ref(null);

const fieldInputLabels = {
    name: 'Field name',
    string: 'String value',
    expression: 'Expression',
};

const modalTitle = "Service Task Field Configuration";

onMounted(() => {
    EventBus.on(EVENT_TYPE.CREATE_SERVICE_TASK_FIELD, (fieldItem) => {
        requestedOperation.value = OPERATION_TYPE.CREATE;
        clearFields();
        initializeFields(fieldItem);
        showModal.value = true;
    });

    EventBus.on(EVENT_TYPE.EDIT_SERVICE_TASK_FIELD, (fieldItem) => {
        requestedOperation.value = OPERATION_TYPE.EDIT;
        clearFields();
        initializeFields(fieldItem);
        showModal.value = true;
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.CREATE_SERVICE_TASK_FIELD);
    EventBus.off(EVENT_TYPE.EDIT_SERVICE_TASK_FIELD);
});

function clearFields() {
    originalField.value = null;
    fieldCopy.value = null;
}

function initializeFields(fieldItem) { 

    if(!fieldItem.field) {
        fieldItem.field = generateNewField(fieldItem);
    }

    originalField.value = fieldItem;
    fieldCopy.value = createDeepCopy(fieldItem);
    const field = fieldCopy.value.field;
    field.name = field.name || '';
    field.string = field.string || '';
    field.expression = field.expression || '';
}

function generateNewField(field) {
    return {
        $type: `activiti:${field.type}`,
        name: '',
        expression: '',
        string: ''
    };
}

function save() {
    if (!requestedOperation.value) {
        return;
    }

    saveChanges(originalField.value.field, fieldCopy.value.field);

    if(requestedOperation.value === OPERATION_TYPE.CREATE) {
        EventBus.emit(EVENT_TYPE.ADD_CREATED_SERVICE_TASK_FIELD, originalField.value);
        showModal.value = false;
        return;
    }

    EventBus.emit(EVENT_TYPE.UPDATE_SERVICE_TASK_FIELD, originalField.value);
    showModal.value = false;
}

function cancel() {
    requestedOperation.value = null;
}

</script>

<style scoped>

</style>