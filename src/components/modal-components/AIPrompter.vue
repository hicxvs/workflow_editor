<template>
    <div class="ai-prompter-container" data-testid="ai-prompter-container">
        <Modal
            :showSaveButton="!showButton"
            :showCancelButton="!showButton"
            :showCloseButton="showButton"
            :showGenerateButton="showGenerateButton"
            :showAnalyzeButton="showAnalyzeButton"
            :isGenerateButtonDisabled="isDisabled"
            :isAnalyzeButtonDisabled="isDisabled"
            :generateButtonClickHandler="handleRequestedOperationAction"
            :analyzeButtonClickHandler="handleRequestedOperationAction"
            v-model="showModal"
        >
            <template #title>
                {{ modalTitle }}
            </template>

            <template #content>
                <div class="mb-4 d-flex align-center">
                    <v-icon icon="fa-solid fa-robot" color="blue" size="x-large" class="mr-3"/>
                    <p class="font-weight-medium">{{ AIPrompterMessages.welcome }}</p>
                </div>

                <Select v-model="selectedPrompt" :label="AIPrompterLabels.promptSelect" :selectOptionItems="AIDiagramPromptsOptions" :selectItemClickHandler="promptSelectItemClickHandler" />

                <TextArea :label="modalMessage" v-model="promptText" :clearHandler="handleTextAreaClear"/>

                <Checkbox v-if="showGenerateImageOption" :label="AIPrompterLabels.imageOption" v-model="generateDiagramImage" />
                
                <div v-if="showAIAnalises">
                    <div class="mb-4 d-flex align-center">
                        <v-icon icon="fa-solid fa-robot" color="blue" size="x-large" class="mr-3"/>
                        <p class="font-weight-medium">{{ AIPrompterMessages.analisesResult }}</p>
                    </div>
                    <div class="analises-container">                                                
                        <div class="analises-content-in-html mb-6" v-html="modalAnalisesFormatedToHTML"></div>
                        <div v-if="showAnalisesImage">
                            <h2 class="mb-2">{{ AIPrompterLabels.imageTitle }}</h2>
                            <div class="analises-svg-container" v-html="modalAnalisesImage"></div>
                        </div>
                    </div>
                    <div class="analises-buttons-container">
                        <Button :label="buttonLabels.downloadReport" :buttonColor="buttonColors.blue" @click="buttonClickHandlers.downloadAnalysis" />
                        <Button :label="buttonLabels.downloadImage" :buttonColor="buttonColors.blue" @click="buttonClickHandlers.downloadImage" />
                    </div>                    
                </div>
                
            </template>
        </Modal>
    </div>
</template>

<script setup>
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';
import { PROMPTER_TYPE } from '../../bpmn-workflow-editor/modeler/prompterTypes';
import { DEFAULT_AI_DIAGRAM_EXAMPLE_PROMPTS } from '../../bpmn-workflow-editor/diagrams/default-ai-diagram-example-prompts';
import { MarkdownUtils } from '../../bpmn-workflow-editor/utils/markdown-utils';
import { SVGUtils } from '../../bpmn-workflow-editor/utils/svg-utils';
import {ref, onMounted, onUnmounted, watch} from 'vue';

import Modal from '../generic/Modal.vue';
import Select from '../generic/Select.vue';
import TextArea from '../generic/TextArea.vue';
import Checkbox from "../generic/Checkbox.vue";
import Button from '../generic/Button.vue';
import { IMAGE_TYPE } from '../../bpmn-workflow-editor/modeler/imageTypes';

const showButton = ref(true);
const showModal = ref(false);
const isDisabled = ref(true);
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
const showAIAnalises = ref(false);
const modalAnalises = ref(null);
const modalAnalisesFormatedToHTML = ref(null);
const modalAnalisesImage = ref(null);
const showAnalisesImage = ref(false);
const processId = ref(null);

const svgUtils = SVGUtils();
const markdownUtils = MarkdownUtils();

const AIPrompterLabels = {
    promptSelect: 'Select and try an prompt',
    imageOption: 'Generate process diagram image',
    imageTitle: 'Diagram image'
};

const AIPrompterMessages = {
    welcome: 'Welcome! Try a example prompt or create your own.',
    analisesResult: `Here is your analysis result.`
};

const buttonLabels = {
    downloadReport: 'Download Analysis',
    downloadImage: 'Download Image',
};

const buttonColors = {
    blue: 'blue',
    grey: 'grey'
};

const buttonClickHandlers = {
    downloadAnalysis: () => {
        const filename = `diagram_analyses_${processId.value}`;
        markdownUtils.downloadMarkdown(modalAnalises.value, filename);
    },
    downloadImage: async () => {
        const filename = `diagram_analyses_image_${processId.value}`;
        await svgUtils.downloadDiagramImage(modalAnalisesImage.value, filename, IMAGE_TYPE.JPG);
    }
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
    
    EventBus.on(EVENT_TYPE.WORKFLOW_DIAGRAM_ANALYSES_READY, (analises) => {
        if(!analises || !analises.text || !analises.processId) {
            modalAnalises.value = null;
            modalAnalisesFormatedToHTML.value = null;
            modalAnalisesImage.value = null;
            showAIAnalises.value = false;
            showAnalisesImage.value = false;
            processId.value = null;
            return;
        }

        showAIAnalises.value = true;
        modalAnalises.value = markdownUtils.formatMarkdown(analises.text);
        processId.value = analises.processId;

        modalAnalisesFormatedToHTML.value = markdownUtils.convertMarkdownToHTML(analises.text, {
            h2: {
                'margin-top': '1em'
            }
        });

        showAIAnalises.value = true;

        if(analises?.svgImage) {
            modalAnalisesImage.value = svgUtils.cleanSvg(analises.svgImage);
            showAnalisesImage.value = true;
        }
    });

    EventBus.on(EVENT_TYPE.WORKFLOW_DIAGRAM_READY, () => {
        showModal.value = false;
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.SHOW_AI_PROMPTER);
    EventBus.off(EVENT_TYPE.WORKFLOW_DIAGRAM_ANALYSES_READY);
    EventBus.off(EVENT_TYPE.WORKFLOW_DIAGRAM_READY);
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
    modalAnalises.value = null;
    modalAnalisesFormatedToHTML.value = null;
    showAIAnalises.value = false;
    isDisabled.value = true;
    generateDiagramImage.value = false;
    modalAnalisesImage.value = null;
    showAnalisesImage.value = false;
    processId.value = null;
}

function handleTextAreaClear() {
    handleTextAreaInput();
    promptTextClearHandler();
}

function handleTextAreaInput() {
    if(!promptText.value) {
        isDisabled.value = true;
        return;
    }

    isDisabled.value = false;
}

function promptTextClearHandler() {
    if(!selectedPrompt.value) {
        return;
    }
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
    
    modalActionHandler.value({
        promptText: promptText.value,
        promptGenerateImage: generateDiagramImage.value
    });
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

watch(
    () => promptText.value,
    () => {
        handleTextAreaInput();
    },
    { immediate: true, deep: true }
);
</script>

<style scoped>
.analises-container {
  max-width: 100%;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #eeeeee;
  font-family: "Segoe UI", Arial, sans-serif;
  color: #333;

  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  overflow-x: auto;
  margin-bottom: 1em;
}

.analises-svg-container {
  text-align: center;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 1rem;
  overflow-x: auto;
}

.analises-svg-container svg {
  display: inline-block;
}

.analises-buttons-container {
  display: flex;
  justify-content: flex-end;
  gap: 10px; 
}
</style>