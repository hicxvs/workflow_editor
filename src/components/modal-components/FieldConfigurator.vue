<template>
    <div class="field-configurator-container" data-testid="field-configurator-container">
        <Modal
            :showCloseButton = "!showButton"
            :showSaveButton = "showButton"
            :showCancelButton = "showButton"
            :saveButtonClickHandler = "save"
            :cancelButtonClickHandler = "() => {}"
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
import { saveChanges } from '../../bpmn-workflow-editor/utils/save-changes';

import Modal from '../generic/Modal.vue';
import TextInput from '../generic/TextInput.vue';
import TextArea from '../generic/TextArea.vue';

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
        clearFields();
        initializeFields();
        showModal.value = true;
    });

    EventBus.on(EVENT_TYPE.EDIT_LISTENER_FIELD, (fieldItem) => {
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

function save() {
    saveChanges(originalField, {
        name: fieldName.value,
        string: fieldString.value,
        expression: fieldExpression.value
    });

    showModal.value = false;
}

</script>

<style scoped>

</style>