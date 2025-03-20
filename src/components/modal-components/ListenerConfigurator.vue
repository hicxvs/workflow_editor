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
                SOON...

            </template>
        </Modal>
    </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';
import Modal from '../generic/Modal.vue';

const showButton = ref(true);
const showModal = ref(false);
const modalTitle = "Listener Configuration";

onMounted(() => {
    EventBus.on(EVENT_TYPE.CREATE_LISTENER, (listener) => {
        console.log(listener);
        showModal.value = true;
    });

    EventBus.on(EVENT_TYPE.EDIT_LISTENER, (listener) => {
        console.log(listener);
        showModal.value = true;
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.CREATE_LISTENER);
    EventBus.off(EVENT_TYPE.EDIT_LISTENER);
});

function save() {
    console.log('ready to save listener');
}

function cancel() {
    console.log('cancel everything');
}

</script>

<style scoped>
</style>