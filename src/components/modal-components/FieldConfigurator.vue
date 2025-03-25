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

                
                NAME:: {{ fieldName }} <br/>
                STRING:: {{ fieldString }}<br/>
                EXPRESSION:: {{ fieldExpression }}<br/>

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

import Modal from '../generic/Modal.vue';
import TextInput from '../generic/TextInput.vue';
import TextArea from '../generic/TextArea.vue';

const isClearable = ref(false);
const showButton = ref(true);
const showModal = ref(false);
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
        initializeFields(fieldItem);
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
}

function initializeFields(fieldItem) {
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
    console.log('ready to save field');
}

function cancel() {
    console.log('cancel everything');
}

</script>

<style scoped>

</style>