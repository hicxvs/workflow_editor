<template>
    <div class="message-configurator-container" data-testid="message-configurator-container">
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
                <TextInput v-model="formValueCopy.id" :label="formValueLabels.id" :clearable="isClearable" />
                <TextInput v-model="formValueCopy.name" :label="formValueLabels.name" :clearable="isClearable" />              
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

const showButton = ref(true);
const isClearable = ref(false);
const showModal = ref(false);
const requestedOperation = ref(null);
const modalTitle = "Form Value Configuration";

const originalFormValue = ref(null);
const formValueCopy = ref(null);

const formValueLabels = {
    id: 'Id',        
    name: 'Name'
};

onMounted(() => {
    EventBus.on(EVENT_TYPE.CREATE_FORM_VALUE, (formValue) => {
        requestedOperation.value = OPERATION_TYPE.CREATE;
        clearFormValue();
        initializeFormValue(formValue);
        showModal.value = true;
    });

    EventBus.on(EVENT_TYPE.EDIT_FORM_VALUE, (formValue) => {
        requestedOperation.value = OPERATION_TYPE.EDIT;
        clearFormValue();
        initializeFormValue(formValue);
        showModal.value = true;
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.CREATE_FORM_VALUE);
    EventBus.off(EVENT_TYPE.EDIT_FORM_VALUE);
});

function clearFormValue() {
    originalFormValue.value = null;
    formValueCopy.value = null;
}

function initializeFormValue(formValue) {
    if(!formValue.field) {
        formValue.field = generateFormValue(formValue);
    }

    originalFormValue.value = formValue.field;
    formValueCopy.value = createDeepCopy(originalFormValue.value);
}

function generateFormValue(formValue) {
    return {
        $type: formValue.type,
        id: '',
        name: ''
    };
}

function save() {
    if (!requestedOperation.value) {
        return;
    }

    saveChanges(originalFormValue.value, formValueCopy.value);

    if(requestedOperation.value === OPERATION_TYPE.CREATE) {
        EventBus.emit(EVENT_TYPE.ADD_CREATED_FORM_VALUE, originalFormValue.value);
        showModal.value = false;
        return;
    }

    EventBus.emit(EVENT_TYPE.UPDATE_EDITED_FORM_VALUE, originalFormValue.value);
    showModal.value = false;   
}

function cancel() {
    requestedOperation.value = null;
}

</script>

<style scoped>

</style>