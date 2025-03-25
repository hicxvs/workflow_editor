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
                <Select v-if="listenerCopy" :label="listenerEventLabel" v-model="listenerSelectedEvent" :selectOptionItems="listenerEventsOptions" :clearable="isClearable" />
                <RadioInput v-if="listenerCopy" :label="listenerTypeLabel" v-model="listenerSelectedType" :radioOptionItems="listenerTypeOptions" :inline="inline"/>
                <TextInput v-if="listenerSelectedType === JAVA_CLASS_LISTENER_TYPE.value" :label="listenerInputLabel.class" v-model="listnerClass" :rules="listnerClassRequiredRule"/>
                <TextInput v-if="listenerSelectedType === EXPRESSION_LISTENER_TYPE.value" :label="listenerInputLabel.expression" v-model="listnerExpression" :rules="listnerExpressionRequiredRule" />
                <TextInput v-if="listenerSelectedType === DELEGATE_EXPRESSION_LISTENER_TYPE.value" :label="listenerInputLabel.delegateExpression" v-model="listnerDelegateExpression" :rules="listnerDelegateExpressionRequiredRule" />
                <ConfigurationTable
                    v-if="listenerFields"
                    :title="listnerFieldTitle"
                    :headers="listnersFieldHeaders"
                    v-model="listenerFields"
                    :createNewListenerHandler="listenersFieldHandler.create"
                    :editListenerHandler="listenersFieldHandler.edit"
                >
                    <template #row="{ item }">
                        <td>{{ item?.name }}</td>
                        <td>{{ item?.string }}</td>
                        <td>{{ item?.expression }}</td>
                    </template>
                </ConfigurationTable>
            </template>
        </Modal>
    </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted } from 'vue';
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';
import { createDeepCopy } from '../../bpmn-workflow-editor/utils/create-deep-copy';
import { ACTIVITI_LISTENER_EVENT_OPTIONS } from '../../bpmn-workflow-editor/activiti-listeners/listener-events';
import { JAVA_CLASS_LISTENER_TYPE } from '../../bpmn-workflow-editor/activiti-listeners/javaClass-listener-type';
import { EXPRESSION_LISTENER_TYPE } from '../../bpmn-workflow-editor/activiti-listeners/expression-listener-type';
import { DELEGATE_EXPRESSION_LISTENER_TYPE } from '../../bpmn-workflow-editor/activiti-listeners/delegateExpression-listener-type';

import Modal from '../generic/Modal.vue';
import Select from '../generic/Select.vue';
import RadioInput from '../generic/RadioInput.vue';
import TextInput from '../generic/TextInput.vue';
import ConfigurationTable from '../generic/ConfigurationTable.vue';

const showButton = ref(true);
const isClearable = ref(false);
const inline = ref(true);
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

const listnerClass = ref(null);
const listnerExpression = ref(null);
const listnerDelegateExpression = ref(null);

const listenerInputLabel = {
    class: 'Class',
    expression: 'Expression',
    delegateExpression: 'Delegate Expression'
};

const listnerClassRequiredRule = [
  value => !!value || 'This field is required. Please enter a class'
];
const listnerExpressionRequiredRule = [
  value => !!value || 'This field is required. Please enter a expression'
];
const listnerDelegateExpressionRequiredRule = [
  value => !!value || 'This field is required. Please enter a delegate expression'
];

const listnerFieldTitle = 'Fields';
const listnersFieldHeaders = [
    'Field name',
    'String value',
    'Expression'
];
const listenerFields = ref([]);

const listenersFieldHandler = {
    create: () => {
        EventBus.emit(EVENT_TYPE.CREATE_LISTENER_FIELD);
    },
    edit: (fieldItem) => {
        EventBus.emit(EVENT_TYPE.EDIT_LISTENER_FIELD, fieldItem);
    }
};

onMounted(() => {
    EventBus.on(EVENT_TYPE.CREATE_LISTENER, (listener) => {
        clearListensers();
        initializeListeners(listener);       
        showModal.value = true;
    });

    EventBus.on(EVENT_TYPE.EDIT_LISTENER, (listener) => {
        clearListensers();
        initializeListeners(listener);
        showModal.value = true;
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.CREATE_LISTENER);
    EventBus.off(EVENT_TYPE.EDIT_LISTENER);
});

function initializeListeners(listener) {

    originalListener.value = listener;
    listenerEventsOptions.value = ACTIVITI_LISTENER_EVENT_OPTIONS[`activiti:${listener.type}`];
    listenerTypeOptions.value = [JAVA_CLASS_LISTENER_TYPE, EXPRESSION_LISTENER_TYPE, DELEGATE_EXPRESSION_LISTENER_TYPE];

    if(!listener.item) {
        initializeForCreate();
        return;
    }

    initializeForEdit(listener);
}

function clearListensers() {
    listenerEventsOptions.value = null;
    listenerTypeOptions.value = null;
    listnerClass.value = null;
    listenerSelectedType.value = null;
    listenerFields.value = null;
    listenerCopy.value = null;
    originalListener.value = null;
}

function initializeForCreate() {
    listnerClass.value = '';
    listnerClass.value = '';
    listenerSelectedEvent.value = listenerEventsOptions.value[0].label;
    listenerSelectedType.value = listenerTypeOptions.value[0].value;
    listenerFields.value = [];
}

function initializeForEdit(listener) {
    listenerCopy.value = createDeepCopy(listener.item);
    const listenerItem = listenerCopy.value.item;
    listnerClass.value = listenerItem.class;
    listenerSelectedEvent.value = listenerEventsOptions.value.find(option => option.value.toLowerCase() === listenerItem.event.toLowerCase())?.label;
    listenerSelectedType.value = listenerTypeOptions.value.find(option => option.value === JAVA_CLASS_LISTENER_TYPE.value)?.value;
    listenerFields.value = listenerItem.fields;
}


function save() {
    console.log('ready to save listener');
    //run validation
    //operation
    //close if everything goes ok -> showModal.value = false;
}

function cancel() {
    console.log('cancel everything');
}

</script>

<style scoped>
</style>