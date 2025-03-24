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
                Listeners Copy
                {{ listenerCopy }}
                <br />
                <br />
                <Select v-if="listenerCopy" :label="listenerEventLabel" v-model="listenerSelectedEvent" :selectOptionItems="listenerEventsOptions" :clearable="isClearable"/>
                <br />
                <br />
                Listeners Type: {{ listenerCopy?.item?.$type }}
                <br />
                <br />
                Listeners Class: {{ listenerCopy?.item?.class }}
                <br />
                <br />
                Listeners Fields: {{ listenerCopy?.item?.fields }}
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
import { ACTIVITI_LISTENER_EVENT_OPTIONS } from '../../bpmn-workflow-editor/activiti-listeners/listener-events';
import { ACTIVITI_LISTENER_TYPES } from '../../bpmn-workflow-editor/activiti-listeners/listener-types';

import Select from '../generic/Select.vue';

const showButton = ref(true);
const isClearable = ref(false);
const showModal = ref(false);
const modalTitle = "Listener Configuration";

const originalListener = ref(null);
const listenerCopy = ref(null);

const listenerEventLabel = 'Event';
const listenerEventsOptions = ref(null);
const listenerSelectedEvent = ref(null);

const listenerTypeLabel = 'Type';
const listenerTypeOptions = ref(null);
const listenerSelectedType = ref(null);


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
    listenerCopy.value = createDeepCopy(listener?.item);
    setListenerEventOptions(listenerCopy.value.item);
    setListenerTypeOptions(ACTIVITI_LISTENER_TYPES);
}

function setListenerEventOptions(listener) {
    if(!listener?.$type) {
        listenerEventsOptions.value = null;
        return;
    }

    listenerEventsOptions.value = ACTIVITI_LISTENER_EVENT_OPTIONS[listener.$type];
    setSelectedListenerEvent(listener.event, listenerEventsOptions.value);
}

function setSelectedListenerEvent(listenerEvent, listenerEvents) {
    if(!listenerEvent || (!listenerEvents || !Array.isArray(listenerEvents) || !listenerEvents.length)) {
        listenerSelectedEvent.value = null;
        return;
    }

    listenerSelectedEvent.value = listenerEvents.find(option => option.value.toLowerCase() === listenerEvent.toLowerCase()).label;
}

function setListenerTypeOptions(listenerTypes) {
    if(!listenerTypes || !Array.isArray(listenerTypes) || !listenerTypes.length) {
        listenerTypeOptions.value = null;
        return;
    }

    listenerTypeOptions.value = listenerTypes;
}

function clearListensers() {
    listenerCopy.value = null;
    originalListener.value = null;
    listenerEventsOptions.value = null;
    listenerSelectedEvent.value = null;
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