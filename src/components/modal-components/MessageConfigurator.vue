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
                <TextInput v-model="messageCopy.id" :label="messageLabels.id" :clearable="isClearable" />
                <TextInput v-model="messageCopy.name" :label="messageLabels.name" :clearable="isClearable" />              
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
const modalTitle = "Process Message Configuration";

const originalMessage = ref(null);
const messageCopy = ref(null);

const messageLabels = {
    id: 'Id',        
    name: 'Name'
};

onMounted(() => {
    EventBus.on(EVENT_TYPE.CREATE_WORKFLOW_MESSAGE, (workflowMessage) => {
        requestedOperation.value = OPERATION_TYPE.CREATE;
        clearWorkflowMessage();
        initializeWorkflowMessage(workflowMessage);
        showModal.value = true;
    });

    EventBus.on(EVENT_TYPE.EDIT_WORKFLOW_MESSAGE, (workflowMessage) => {
        requestedOperation.value = OPERATION_TYPE.EDIT;
        clearWorkflowMessage();
        initializeWorkflowMessage(workflowMessage);
        showModal.value = true;
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.CREATE_WORKFLOW_MESSAGE);
    EventBus.off(EVENT_TYPE.EDIT_WORKFLOW_MESSAGE);
});

function clearWorkflowMessage() {
    originalMessage.value = null;
    messageCopy.value = null;
}

function initializeWorkflowMessage(workflowMessage) {
    if(!workflowMessage.field) {
        workflowMessage.field = generateWorkflowMessage(workflowMessage);
    }

    originalMessage.value = workflowMessage.field;
    messageCopy.value = createDeepCopy(originalMessage.value);
}

function generateWorkflowMessage(workflowMessage) {
    return {
        $type: workflowMessage.type,
        id: '',
        name: ''
    };
}

function save() {
    if (!requestedOperation.value) {
        return;
    }

    saveChanges(originalMessage.value, messageCopy.value);

    if(requestedOperation.value === OPERATION_TYPE.CREATE) {
        EventBus.emit(EVENT_TYPE.ADD_CREATED_WORKFLOW_MESSAGE, originalMessage.value);
        showModal.value = false;
        return;
    }

    EventBus.emit(EVENT_TYPE.UPDATE_EDITED_WORKFLOW_MESSAGE, originalMessage.value);
    showModal.value = false;   
}

function cancel() {
    requestedOperation.value = null;
}

</script>

<style scoped>

</style>