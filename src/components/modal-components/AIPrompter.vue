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
                <Select v-model="selectedPrompt" :label="AIPrompterLabels.promptSelect" :selectOptionItems="AIDiagramPromptsOptions" :selectItemClickHandler="promptSelectItemClickHandler" />
                <TextArea :label="modalMessage" v-model="promptText" :clearHandler="promptTextClearHandler"/>
                <Checkbox v-if="showGenerateImageOption" :label="AIPrompterLabels.imageOption" v-model="generateDiagramImage"  @update:modelValue="promptImageGenerateHandler"/>
            </template>
        </Modal>
    </div>
</template>

<script setup>
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';
import { PROMPTER_TYPE } from '../../bpmn-workflow-editor/modeler/prompterTypes';
import { DEFAULT_AI_DIAGRAM_EXAMPLE_PROMPTS } from '../../bpmn-workflow-editor/diagrams/default-ai-diagram-example-prompts';
import {ref, onMounted, onUnmounted} from 'vue';

import Modal from '../generic/Modal.vue';
import Select from '../generic/Select.vue';
import TextArea from '../generic/TextArea.vue';
import Checkbox from "../generic/Checkbox.vue";

const showButton = ref(true);
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const modalPrompterType = ref(null);
const modalActionHandler = ref(null);
const showGenerateButton = ref(false);
const showAnalyzeButton = ref(false);
const AIDiagramPromptsOptions = ref(null);
const selectedPrompt = ref(null);
const promptText = ref(null);
const showGenerateImageOption = ref(false);
const generateDiagramImage = ref(false);

const AIPrompterLabels = {
    promptSelect: 'Select and try an prompt',
    imageOption: 'Generate process diagram image'
};

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
        showGenerateImageOption.value = (requestedAction.type === PROMPTER_TYPE.ANALYZE);
        AIDiagramPromptsOptions.value = (requestedAction.type === PROMPTER_TYPE.GENERATE) ? transformPromptsForSelect(DEFAULT_AI_DIAGRAM_EXAMPLE_PROMPTS.generate_examples): transformPromptsForSelect(DEFAULT_AI_DIAGRAM_EXAMPLE_PROMPTS.analyze_examples);

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
    AIDiagramPromptsOptions.value = null;
    promptText.value = null;
    showGenerateImageOption.value = false;
    selectedPrompt.value = null;
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

function transformPromptsForSelect(collectionToTransform) {
    if(!Array.isArray(collectionToTransform) && !collectionToTransform.length) {
        return;
    }

    return collectionToTransform.map((item) => ({
        label: item?.process_name || '',
        value: item?.process_definition || ''
    }));
}

function promptSelectItemClickHandler() {
    if(!selectedPrompt.value) {
        promptText.value = '';
        return;
    }

    promptText.value = AIDiagramPromptsOptions.value.find(item => item.label === selectedPrompt.value)?.value || '';
}

function promptTextClearHandler() {
    if(!selectedPrompt.value) {
        return;
    }
    selectedPrompt.value = null;
}

function promptImageGenerateHandler() {
    if(!promptText.value) {
        return;
    }
    
    console.log(generateDiagramImage.value);
    console.log(promptText.value);
}

</script>