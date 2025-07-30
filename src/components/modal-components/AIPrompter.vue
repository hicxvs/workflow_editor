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
                <TextArea :label="modalMessage" v-model="promptText" />
            </template>
        </Modal>
    </div>
</template>

<script setup>
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';
import { PROMPTER_TYPE } from '../../bpmn-workflow-editor/modeler/prompterTypes';
import {ref, onMounted, onUnmounted} from 'vue';

import Modal from '../generic/Modal.vue';
import TextArea from '../generic/TextArea.vue';

const showButton = ref(true);
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const modalPrompterType = ref(null);
const modalActionHandler = ref(null);
const showGenerateButton = ref(false);
const showAnalyzeButton = ref(false);
const promptText = ref(null); 

onMounted(() => {
    EventBus.on(EVENT_TYPE.SHOW_AI_PROMPTER, (requestedAction) => {
        clearAIPrompter();

        if(!requestedAction) {
            return;
        }

        modalTitle.value = requestedAction.title || '';
        modalMessage.value = requestedAction.message || '';
        modalPrompterType.value = requestedAction.type || null;
        modalActionHandler.value = requestedAction.actionHandler || null;
        showGenerateButton.value = (requestedAction.type === PROMPTER_TYPE.GENERATE);
        showAnalyzeButton.value = (requestedAction.type === PROMPTER_TYPE.ANALYZE);
        showModal.value = true;
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.SHOW_AI_PROMPTER);
});

function clearAIPrompter() {
    modalTitle.value = '';
    modalMessage.value = '';
    modalPrompterType.value = null;
    modalActionHandler.value = null;
    showGenerateButton.value = false;
    showAnalyzeButton.value = false;
    promptText.value = null;
}

function handleRequestedOperationAction() {
    if(!modalActionHandler.value) {
        showModal.value = false;
        return;
    }

    if(!promptText.value) {
        return;
    }
    
    modalActionHandler.value(promptText.value);

    if(modalPrompterType.value !== PROMPTER_TYPE.ANALYZE) {
        showModal.value = false;
    }
}

</script>