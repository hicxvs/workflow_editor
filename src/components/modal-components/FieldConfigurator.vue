<template>
    <div class="field-configurator-container" data-testid="field-configurator-container">
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
                <TextInput :label="fieldInputLabels.name" v-model="fieldName" :clearable="isClearable" />
                <TextArea  :label="fieldInputLabels.string" v-model="fieldString" :clearable="isClearable" />
                <TextArea  :label="fieldInputLabels.expression" v-model="fieldExpression" :clearable="isClearable" />
            </template>
        </Modal>
    </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted } from 'vue';
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';
import { OPERATION_TYPE } from '../../bpmn-workflow-editor/modeler/operationTypes';
import { FieldType } from '../../bpmn-workflow-editor/activiti-model-definitions/activiti-model-types/field';
import { saveChanges } from '../../bpmn-workflow-editor/utils/save-changes';

import Modal from '../generic/Modal.vue';
import TextInput from '../generic/TextInput.vue';
import TextArea from '../generic/TextArea.vue';

const requestedOperation = ref(null);
const isClearable = ref(false);
const showButton = ref(true);
const showModal = ref(false);
const originalField = ref(null);
const fieldName = ref(null);
const fieldString = ref(null);
const fieldExpression = ref(null);
const fieldInputLabels = {
    name: 'Field name',
    string: 'String value',
    expression: 'Expression',
};

const modalTitle = "Listener Field Configuration";


onMounted(() => {
    EventBus.on(EVENT_TYPE.CREATE_LISTENER_FIELD, () => {
        requestedOperation.value = OPERATION_TYPE.CREATE;
        clearFields();
        initializeFields(null);
        showModal.value = true;
    });

    EventBus.on(EVENT_TYPE.EDIT_LISTENER_FIELD, (fieldItem) => {
        requestedOperation.value = OPERATION_TYPE.EDIT;
        clearFields();
        initializeFields(fieldItem.item);
        showModal.value = true;
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.CREATE_LISTENER_FIELD);
    EventBus.off(EVENT_TYPE.EDIT_LISTENER_FIELD);
});

function clearFields() {
    fieldName.value = null;
    fieldString.value = null;
    fieldExpression.value = null;
    originalField.value = null;
}

function initializeFields(fieldItem) {

    originalField.value = fieldItem;

    if(!fieldItem) {
        initializeForCreate();
        return;
    }

    initializeForEdit(fieldItem);
}

function initializeForCreate() {
    fieldName.value = '';
    fieldString.value = '';
    fieldExpression.value = '';
}

function initializeForEdit(fieldItem) {
    fieldName.value = fieldItem?.name || '';
    fieldString.value = fieldItem?.string || '';
    fieldExpression.value = fieldItem?.expression || '';
}


function saveNewCreatedField() {
    originalField.value = {
        $type: `activiti:${FieldType}`
    };

    saveChanges(originalField, {
        name: fieldName.value,
        string: fieldString.value,
        expression: fieldExpression.value
    });

    EventBus.emit(EVENT_TYPE.CREATE_LISTENER_FIELD, originalField.value);
    showModal.value = false;
}

function save() {
    if (!requestedOperation.value) {
        return;
    }

    if(requestedOperation.value === OPERATION_TYPE.EDIT) {
        saveChanges(originalField, {
            name: fieldName.value,
            string: fieldString.value,
            expression: fieldExpression.value
        });

        showModal.value = false;
        return;
    }

    saveNewCreatedField();
}

function cancel() {
    requestedOperation.value = null;
}

</script>

<style scoped>

</style>