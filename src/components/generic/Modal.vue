<template>
    <div class="modal-container" data-testid="modal-container">
        <v-dialog v-model="model" min-width="20%" :width="width" max-width="80%" :attach="OVERLAY_CONTAINER_ID">
            <v-card>
                <v-card-title>
                    <slot name="title">This is modal's default title</slot> 
                    <v-btn icon="fa-solid fa-circle-xmark" variant="text" color="red" class="close-btn" @click="closeModal">
                        <v-icon/>
                    </v-btn>  
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text>
                    <slot name="content">This is modal's default content</slot>
                </v-card-text>  

                <v-divider></v-divider>

                <v-card-actions>
                    <Button v-if="showSaveButton" :label="buttonLabels.save" :buttonColor="buttonColors.save" @click="save"></Button>                    
                    <Button v-if="showDeployButton" :label="buttonLabels.deploy" :buttonColor="buttonColors.deploy" @click="deploy"></Button>                    
                    <Button v-if="showGenerateButton" :label="buttonLabels.generate" :buttonColor="buttonColors.generate" :disabled="isGenerateButtonDisabled" @click="generate"></Button>                    
                    <Button v-if="showAnalyzeButton" :label="buttonLabels.analyze" :buttonColor="buttonColors.analyze" :disabled="isAnalyzeButtonDisabled" @click="analyze"></Button>                    
                    <Button v-if="showDeleteButton" :label="buttonLabels.delete" :buttonColor="buttonColors.delete" @click="remove"></Button>
                    <Button v-if="showCancelButton" :label="buttonLabels.cancel" :buttonColor="buttonColors.cancel" @click="cancelModal"></Button>                    
                    <Button v-if="showCloseButton" :label="buttonLabels.close" :buttonColor="buttonColors.close" @click="closeModal"></Button>
                </v-card-actions>          
            </v-card>       
        </v-dialog>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import Button from '../generic/Button.vue';
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';
import { OVERLAY_CONTAINER_ID } from '../../config';

const model = defineModel();

const props = defineProps({
    width: {
        type: String,
        required: false,
        default: "80%"
    },
    showSaveButton: {
        type: Boolean,
        required: false,
        default: true
    },
    showCancelButton: {
        type: Boolean,
        required: false,
        default: true
    },
    showCloseButton: {
        type: Boolean,
        required: false,
        default: false
    },
    showDeleteButton: {
        type: Boolean,
        required: false,
        default: false
    },
    showDeployButton: {
        type: Boolean,
        required: false,
        default: false
    },
    showGenerateButton: {
        type: Boolean,
        required: false,
        default: false
    },
    showAnalyzeButton: {
        type: Boolean,
        required: false,
        default: false
    },
    isGenerateButtonDisabled: {
        type: Boolean,
        required: false,
        default: false
    },
    isAnalyzeButtonDisabled: {
        type: Boolean,
        required: false,
        default: false
    },
    saveButtonClickHandler: {
        type: Function,
        required: false,
        default: () => { console.warn('saveButtonClickHandler is not defined'); }
    },   
    deleteButtonClickHandler: {
        type: Function,
        required: false,
        default: () => { console.warn('deleteButtonClickHandler is not defined'); }
    },
    deployButtonClickHandler: {
        type: Function,
        required: false,
        default: () => { console.warn('deployButtonClickHandler is not defined'); }
    },
    generateButtonClickHandler: {
        type: Function,
        required: false,
        default: () => { console.warn('generateButtonClickHandler is not defined'); }
    },
    analyzeButtonClickHandler: {
        type: Function,
        required: false,
        default: () => { console.warn('analyzeButtonClickHandler is not defined'); }
    }, 
    cancelButtonClickHandler: {
        type: Function,
        required: false,
        default: () => { console.warn('cancelButtonClickHandler is not defined'); }
    }     
});


const buttonLabels = {
    save: 'Save',
    close: 'Close',
    cancel: 'Cancel',
    delete: 'Confirm Delete',
    deploy: 'Confirm Deployment',
    generate: 'Generate',
    analyze: 'Analyze'
};

const buttonColors = {
    save: 'green',
    close: 'red',
    cancel: 'grey',
    delete: 'red',
    deploy: 'green',
    generate: 'green',
    analyze: 'green'
};

function closeModal() {
    model.value = false;
}

function save() {
    props.saveButtonClickHandler();
}

function remove() {
    props.deleteButtonClickHandler();
}

function deploy() {
    props.deployButtonClickHandler();
}

function generate() {
    props.generateButtonClickHandler();
}

function analyze() {
    props.analyzeButtonClickHandler();
}

function cancelModal() {
    props.cancelButtonClickHandler();
    closeModal();
}

onMounted(() => {
    EventBus.on(EVENT_TYPE.CLOSE_MODAL, closeModal);
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.CLOSE_MODAL);
});

</script>

<style scoped>
.dialog-card {
  position: relative;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;

  border-radius: 50%;
  min-width: 30px;
  width: 30px;
  height: 30px;
  padding: 0;
}

.white-icon {
  color: #ffffff;
  font-size: 14px;
}

</style>


