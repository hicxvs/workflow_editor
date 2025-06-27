<template>
    <div class="action-confirmation-container" data-testid="action-confirmation-container">
        <Modal
             :width="'30%'"
             :showSaveButton = "!showButton"
             :showCancelButton = "showButton"
             :showDeployButton = "showAddConfirmation"             
             :showDeleteButton = "!showAddConfirmation"            
             :deleteButtonClickHandler = "handleRequestedConfirmationAction"
             :deployButtonClickHandler = "handleRequestedConfirmationAction"
             
             v-model="showModal"
        >
            <template #title>
                {{ modalTitle }}
            </template>

            <template #content>
                {{ modalContent }}                             
            </template>
        </Modal>
    </div>
</template>

<script setup>
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';
import {ref, onMounted, onUnmounted} from 'vue';

import Modal from '../generic/Modal.vue';
import { CONFIRMATION_TYPE } from '../../bpmn-workflow-editor/modeler/confirmationTypes';

const showButton = ref(true);
const showModal = ref(false);
const modalTitle = ref('');
const modalContent = ref('');
const showAddConfirmation = ref(false);
const modalConfirmationAction = ref(null);

onMounted(() => {
    EventBus.on(EVENT_TYPE.SHOW_ACTION_CONFIRMATION, (requestedAction) => {
        clearActionConfirmation();

        if(!requestedAction) {
            return;
        }

        showAddConfirmation.value = (requestedAction.type === CONFIRMATION_TYPE.ADD) ? true : false;
        modalTitle.value = requestedAction.title || '';
        modalContent.value = requestedAction.message || '';
        modalConfirmationAction.value = requestedAction.actionHandler || null;
        showModal.value = true;
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.SHOW_ACTION_CONFIRMATION);
});

function clearActionConfirmation() {
    modalTitle.value = '';
    modalContent.value = '';
    showAddConfirmation.value = false;
    modalConfirmationAction.value = null;
}

function handleRequestedConfirmationAction() {
    if(!modalConfirmationAction.value) {
        showModal.value = false;
        return;
    }

    modalConfirmationAction.value();
    showModal.value = false;
}
</script>