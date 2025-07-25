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
                <TextInput v-if="listenerSelectedType === JAVA_CLASS_LISTENER_TYPE.value" :label="listenerInputLabel.class" v-model="listenerCopy.listener.class" :rules="listnerClassRequiredRule" @input="filterJavaClasses" :clearHandler="filterJavaClasses"/>
                <TextInput v-if="listenerSelectedType === EXPRESSION_LISTENER_TYPE.value" :label="listenerInputLabel.expression" v-model="listenerCopy.listener.expression" :rules="listnerExpressionRequiredRule" />
                <TextInput v-if="listenerSelectedType === DELEGATE_EXPRESSION_LISTENER_TYPE.value" :label="listenerInputLabel.delegateExpression" v-model="listenerCopy.listener.delegateExpression" :rules="listnerDelegateExpressionRequiredRule" />
                <Select v-if="showFilterClassSelect" :label="classSelectorLabel" v-model="selectedClass" :selectOptionItems="filteredClasses" :clearable="isClearable" :openMenu="showFilterClassSelectAlreadyOpen" :selectItemClickHandler="javaClassFilterSelectItemClickHandler" />

                <ConfigurationTable
                    :title="listnerFieldTitle"
                    :headers="listnersFieldHeaders"
                    v-model="listenerCopy.listener.fields"
                    :createNewItemHandler="listenersFieldHandler.create"
                    :editItemHandler="listenersFieldHandler.edit"
                    :removeItemHandler="listenersFieldHandler.remove"
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
import { OPERATION_TYPE } from '../../bpmn-workflow-editor/modeler/operationTypes';
import { FieldType } from '../../bpmn-workflow-editor/activiti-model-definitions/activiti-model-types/field';
import { saveChanges } from '../../bpmn-workflow-editor/utils/save-changes';
import { ClassFilterer } from '../../bpmn-workflow-editor/utils/class-filterer';

import Modal from '../generic/Modal.vue';
import Select from '../generic/Select.vue';
import RadioInput from '../generic/RadioInput.vue';
import TextInput from '../generic/TextInput.vue';
import ConfigurationTable from '../generic/ConfigurationTable.vue';

const showButton = ref(true);
const isClearable = ref(false);
const inline = ref(true);
const showModal = ref(false);
const requestedOperation = ref(null);
const modalTitle = "Listener Configuration";

const originalListener = ref(null);
const listenerCopy = ref(null);

const listenerEventLabel = 'Event';
const listenerEventsOptions = ref(null);
const listenerSelectedEvent = ref(null);

const listenerTypeLabel = 'Type';
const listenerTypeOptions = ref(null);
const listenerSelectedType = ref(null);

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

const listenersFieldHandler = {
    create: () => {
        EventBus.emit(EVENT_TYPE.CREATE_LISTENER_FIELD, {
            type: FieldType,
            field: null
        });
    },
    edit: (fieldItem) => {
        EventBus.emit(EVENT_TYPE.EDIT_LISTENER_FIELD,  {
            type: FieldType,
            field: fieldItem.item
        });
    },
    remove: (fieldItem) => {
        const indexToRemove = fieldItem.index;
        listenerCopy.value.listener.fields = listenerCopy.value.listener.fields.filter((_, index) => index !== indexToRemove);
    }
};

const classFilterer = ref(null);
const filteredClasses = ref(null);
const selectedClass = ref(null);
const showFilterClassSelect = ref(false);
const showFilterClassSelectAlreadyOpen = ref(true);
const classSelectorLabel = 'Select a class';

onMounted(() => {
    EventBus.on(EVENT_TYPE.CREATE_LISTENER, (listener) => {
        requestedOperation.value = OPERATION_TYPE.CREATE;
        clearListensers();
        initializeListeners(listener);       
        showModal.value = true;
    });

    EventBus.on(EVENT_TYPE.EDIT_LISTENER, (listener) => {
        requestedOperation.value = OPERATION_TYPE.EDIT;
        clearListensers();
        initializeListeners(listener);
        showModal.value = true;
    });

    EventBus.on(EVENT_TYPE.ADD_CREATED_LISTENER_FIELD, (newFieldItem) => {
        if(!newFieldItem) {
            return;
        }

        listenerCopy.value.listener.fields.push(newFieldItem.field);
    });

    EventBus.on(EVENT_TYPE.WORKFLOW_JAVA_CLASSES_READY, (classes) => {
        if(!classes || !Array.isArray(classes)) {
            return;
        }
        
        selectedClass.value = null;
        classFilterer.value = null;
        classFilterer.value = ClassFilterer(classes);
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.CREATE_LISTENER);
    EventBus.off(EVENT_TYPE.EDIT_LISTENER);
    EventBus.off(EVENT_TYPE.ADD_CREATED_LISTENER_FIELD);
    EventBus.off(EVENT_TYPE.WORKFLOW_JAVA_CLASSES_READY);
});

function clearListensers() {
    listenerEventsOptions.value = null;
    listenerTypeOptions.value = null;
    listenerSelectedType.value = null;
    listenerCopy.value = null;
    originalListener.value = null;
}

function initializeListeners(listener) {
    listenerEventsOptions.value = ACTIVITI_LISTENER_EVENT_OPTIONS[`activiti:${listener.type}`];
    listenerTypeOptions.value = [JAVA_CLASS_LISTENER_TYPE, EXPRESSION_LISTENER_TYPE, DELEGATE_EXPRESSION_LISTENER_TYPE];

    if(!listener.listener) {
        listener.listener = generateNewListener(listener);
    }

    originalListener.value = listener;
    listenerCopy.value = createDeepCopy(listener);    
    const listenerItem = listenerCopy.value.listener;
    listenerItem.event = listenerItem.event || listenerEventsOptions.value[0].value;

    listenerSelectedEvent.value = listenerEventsOptions.value.find(option => option.value.toLowerCase() === listenerItem.event.toLowerCase())?.label;
    listenerSelectedType.value = listenerTypeOptions.value.find(option => option.value === JAVA_CLASS_LISTENER_TYPE.value)?.value;
}

function generateNewListener(listener) {
    return {
        $type: `activiti:${listener.type}`,
        class: '',
        expression: '',
        delegateExpression: '',
        event: '',
        fields: []
    };
}

function filterJavaClasses() {
    const searchedClass = listenerCopy.value.listener.class;
    filteredClasses.value = classFilterer.value?.fitlerClasses(searchedClass);

    if(!filteredClasses.value?.length) {
        showFilterClassSelect.value = false;
        return;
    }

    showFilterClassSelect.value = true;
}

function javaClassFilterSelectItemClickHandler() {
    listenerCopy.value.listener.class = selectedClass.value;
    showFilterClassSelect.value = false;
}

function save() {
    if (!requestedOperation.value) {
        return;
    }

    listenerCopy.value.listener.event = listenerEventsOptions.value.find(option => option.label === listenerSelectedEvent.value).value;
    saveChanges(originalListener.value.listener, listenerCopy.value.listener);

    if(requestedOperation.value === OPERATION_TYPE.CREATE) {
        EventBus.emit(EVENT_TYPE.ADD_CREATED_LISTENER, originalListener.value);
        showModal.value = false;
        return;
    }
    
    EventBus.emit(EVENT_TYPE.UPDATE_EDITED_LISTENER, originalListener.value);
    showModal.value = false;
}

function cancel() {
    requestedOperation.value = null;
}
</script>

<style scoped>
</style>