<template>
    <div class="call-activity-parameter-configurator-container" data-testid="call-activity-parameter-configurator-container">
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
                <TextInput :label="fieldInputLabels.source" v-model="copyParamenter.field.source" :clearable="isClearable" />
                <TextInput :label="fieldInputLabels.sourceExpression" v-model="copyParamenter.field.sourceExpression" :clearable="isClearable" />
                <TextInput :label="fieldInputLabels.target" v-model="copyParamenter.field.target" :clearable="isClearable" />
                <TextInput :label="fieldInputLabels.targetExpression" v-model="copyParamenter.field.targetExpression" :clearable="isClearable" />
            </template>
        </Modal>
    </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted } from 'vue';
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';
import { OPERATION_TYPE } from '../../bpmn-workflow-editor/modeler/operationTypes';
import { ACTIVITY_TYPES } from '../../bpmn-workflow-editor/modeler/modelerTypes/activityTypes';
import { createDeepCopy } from '../../bpmn-workflow-editor/utils/create-deep-copy';
import { saveChanges } from '../../bpmn-workflow-editor/utils/save-changes';

import Modal from '../generic/Modal.vue';
import TextInput from '../generic/TextInput.vue';

const showButton = ref(true);
const isClearable = ref(false);
const showModal = ref(false);
const requestedOperation = ref(null);
const modalTitle = "Call Activity Parameter Configuration";

const originalParamenter = ref(null);
const copyParamenter = ref(null);

const fieldInputLabels = {
    source: 'Source',
    sourceExpression: 'Source Expression',
    target: 'Target',
    targetExpression: 'Target Expression',
};

onMounted(() => {
    EventBus.on(EVENT_TYPE.CREATE_CALL_ACTIVITY_INPUT_PARAMETER, (parameterItem) => {
        requestedOperation.value = OPERATION_TYPE.CREATE;
        clearFields();
        initializeParameter(parameterItem);
        showModal.value = true;
    });

    EventBus.on(EVENT_TYPE.EDIT_CALL_ACTIVITY_INPUT_PARAMETER, (parameterItem) => {
        requestedOperation.value = OPERATION_TYPE.EDIT;
        clearFields();
        initializeParameter(parameterItem);
        showModal.value = true;
    });

    EventBus.on(EVENT_TYPE.CREATE_CALL_ACTIVITY_OUTPUT_PARAMETER, (parameterItem) => {
        requestedOperation.value = OPERATION_TYPE.CREATE;
        clearFields();
        initializeParameter(parameterItem);
        showModal.value = true;
    });

    EventBus.on(EVENT_TYPE.EDIT_CALL_ACTIVITY_OUTPUT_PARAMETER, (parameterItem) => {
        requestedOperation.value = OPERATION_TYPE.EDIT;
        clearFields();
        initializeParameter(parameterItem);
        showModal.value = true;
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.CREATE_CALL_ACTIVITY_INPUT_PARAMETER);
    EventBus.off(EVENT_TYPE.EDIT_CALL_ACTIVITY_INPUT_PARAMETER);
    EventBus.off(EVENT_TYPE.CREATE_CALL_ACTIVITY_OUTPUT_PARAMETER);
    EventBus.off(EVENT_TYPE.EDIT_CALL_ACTIVITY_OUTPUT_PARAMETER);
});

function clearFields() {
    originalParamenter.value = null;
    copyParamenter.value = null;
}

function initializeParameter(parameterItem) {

    if(!parameterItem.field) {
        parameterItem.field = generateNewParamter(parameterItem);
    }

    originalParamenter.value = parameterItem;
    copyParamenter.value = createDeepCopy(parameterItem);
}

function generateNewParamter(field) {
    return {
        $type: field.type,
        source: '',
        sourceExpression: '',
        target: '',
        targetExpression: '',
    };
}

function save() {
    if (!requestedOperation.value) {
        return;
    }

    saveChanges(originalParamenter.value.field, copyParamenter.value.field);

    if (requestedOperation.value === OPERATION_TYPE.CREATE) {
        const eventTypeKey = ( originalParamenter.value.type === ACTIVITY_TYPES.IN) ? EVENT_TYPE.ADD_CREATED_CALL_ACTIVITY_INPUT_PARAMETER : EVENT_TYPE.ADD_CREATED_CALL_ACTIVITY_OUTPUT_PARAMETER;
        EventBus.emit(eventTypeKey, originalParamenter.value);
        showModal.value = false;
        return;
    }

    const eventTypeKey = ( originalParamenter.value.type === ACTIVITY_TYPES.IN) ? EVENT_TYPE.UPDATE_EDITED_CALL_ACTIVITY_INPUT_PARAMETER : EVENT_TYPE.UPDATE_EDITED_CALL_ACTIVITY_OUTPUT_PARAMETER;
    EventBus.emit(eventTypeKey, originalParamenter.value);
    showModal.value = false;
}

function cancel() {
    requestedOperation.value = null;
}

</script>

<style scoped>
</style>