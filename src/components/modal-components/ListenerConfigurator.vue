<template>
    <div class="listener-configurator-container" data-testid="listener-configurator-container">
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
                {{ listenerCopy }}
            </template>
        </Modal>
    </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';
import Modal from '../generic/Modal.vue';
import { createDeepCopy } from '../../bpmn-workflow-editor/utils/create-deep-copy';

const showButton = ref(true);
const showModal = ref(false);
const modalTitle = "Listener Configuration";
const originalListener = ref(null);
const listenerCopy = ref(null);

onMounted(() => {
    EventBus.on(EVENT_TYPE.CREATE_LISTENER, (listener) => {
        clearListensers();
        setListeners(listener);        
        showModal.value = true;
    });

    EventBus.on(EVENT_TYPE.EDIT_LISTENER, (listener) => {
        clearListensers();
        setListeners(listener);        
        showModal.value = true;
    });
});

function setListeners(listener){
    originalListener.value = listener;
    listenerCopy.value = createDeepCopy(listener);
}

function clearListensers() {
    listenerCopy.value = null;
    originalListener.value = null;
}

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.CREATE_LISTENER);
    EventBus.off(EVENT_TYPE.EDIT_LISTENER);
});

function save() {
    console.log('ready to save listener');
    clearListensers();
}

function cancel() {
    console.log('cancel everything');
    clearListensers();
}

</script>

<style scoped>
</style>