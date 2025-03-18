<template>
    <div class="modal-container" data-testid="modal-container">
        <v-dialog v-model="showModal" min-width="30%" max-width="80%">
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
                    <Button v-if="showSaveButton" :label="buttonLabels.save" :buttonColor="buttonColors.save" @click="saveButtonClickHandler"></Button>
                    <Button v-if="showCancelButton" :label="buttonLabels.cancel" :buttonColor="buttonColors.cancel" @click="cancelButtonClickHandler"></Button>                    
                    <Button v-if="showCloseButton" :label="buttonLabels.close" :buttonColor="buttonColors.close" @click="closeModal"></Button>
                </v-card-actions>          
            </v-card>       
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Button from '../generic/Button.vue';
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes'; 

const showModal = ref(false);   

const props = defineProps({
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
    saveButtonClickHandler: {
        type: Function,
        required: false,
        default: () => { console.warn('saveButtonClickHandler is not defined'); }
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
    cancel: 'Cancel'
};

const buttonColors = {
    save: 'green',
    close: 'red',
    cancel: 'grey'
};

function closeModal() {
    showModal.value = false;
    EventBus.emit(EVENT_TYPE.MODAL_CLOSED); 
}

onMounted(() => {
    EventBus.on(EVENT_TYPE.OPEN_MODAL, () => {
        showModal.value = true;
    });

    EventBus.on(EVENT_TYPE.CLOSE_MODAL, () => {
        showModal.value = false;
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.OPEN_MODAL);
    EventBus.off(EVENT_TYPE.CLOSE_MODAL);
});

</script>

<style scoped>

</style>

