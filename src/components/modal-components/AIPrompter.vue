<template>
    <div class="ai-prompter-container" data-testid="ai-prompter-container">
        <Modal
            :showSaveButton = "!showButton"
            :showCancelButton = "!showButton"
            :showCloseButton = "showButton"
            :showGenerateButton = "showGenerateButton"
            :showAnalyzeButton = "showAnalyzeButton"
            :generateButtonClickHandler="handleRequestedOperationAction"
            :analyzeButtonClickHandler="handleRequestedOperationAction"
            v-model="showModal"
        >
            <template #title>
                {{ modalTitle }}
            </template>

            <template #content>
                {{ modalMessage }}                             
            </template>
        </Modal>
    </div>
</template>

<script setup>
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';
import {ref, onMounted, onUnmounted} from 'vue';

import Modal from '../generic/Modal.vue';

const showButton = ref(true);
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const modalContentType = ref(null);
const modalActionHandler = ref(null);
const showGenerateButton = ref(false);
const showAnalyzeButton = ref(false);

onMounted(() => {
    EventBus.on(EVENT_TYPE.SHOW_AI_PROMPTER, (requestedAction) => {
        clearAIPrompter();

        if(!requestedAction) {
            return;
        }

        modalTitle.value = requestedAction.title || '';
        modalMessage.value = requestedAction.message || '';
        modalContentType.value = requestedAction.type || null;
        modalActionHandler.value = requestedAction.actionHandler || null;
        showModal.value = true;
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.SHOW_AI_PROMPTER);
});

function clearAIPrompter() {
    modalTitle.value = '';
    modalMessage.value = '';
    modalContentType.value = null;
    modalActionHandler.value = null;
    showGenerateButton.value = false;
    showAnalyzeButton.value = false;
}

function handleRequestedOperationAction() {
    if(!modalActionHandler.value) {
        showModal.value = false;
        return;
    }
    console.log('on the right path!');
}

</script>