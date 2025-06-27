<template>
    <div class="modal-container" data-testid="modal-container">
        <v-dialog v-model="model" min-width="20%" :width="width" max-width="80%">
            <v-card>
                <v-card-title>
                    <slot name="title">This is modal's default title</slot>                    
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text>
                    <slot name="content">This is modal's default content</slot>
                </v-card-text>  

                <v-divider></v-divider>

                <v-card-actions>
                    <Button v-if="showSaveButton" :label="buttonLabels.save" :buttonColor="buttonColors.save" @click="save"></Button>                    
                    <Button v-if="showDeployButton" :label="buttonLabels.deploy" :buttonColor="buttonColors.deploy" @click="deploy"></Button>                    
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

const model = defineModel();

const props = defineProps({
    width: {
        tyoe: String,
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
    deploy: 'Confirm Deployment'
};

const buttonColors = {
    save: 'green',
    close: 'red',
    cancel: 'grey',
    delete: 'red',
    deploy: 'green'
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

</style>

