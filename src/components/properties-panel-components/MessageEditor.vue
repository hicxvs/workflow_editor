<template>
    <div class="message-editor-container" data-testid="message-editor-container">
        <Card :title="cardProps.title" :subtitle="cardProps.subtitle" :text="cardProps.text">
            <template #content>
                <ConfigurationTable
                    :title="messageLabels.title"
                    :headers="messageHeaders"
                    v-model="workflowMessages"
                    :createNewItemHandler="messageHandlers.create"
                    :editItemHandler="messageHandlers.edit"
                    :removeItemHandler="messageHandlers.remove"
                >
                    <template #row="{ item }">
                        <td>{{ item.id }}</td>
                        <td>{{ item.name }}</td>
                    </template>
                </ConfigurationTable>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { ELEMENT_TYPES } from '../../bpmn-workflow-editor/modeler/modelerTypes/elementTypes';
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';

import Card from '../generic/Card.vue';
import ConfigurationTable from '../generic/ConfigurationTable.vue';
import field from '../../bpmn-workflow-editor/activiti-model-definitions/activiti-model-types/field';

const model = defineModel();
const workflowMessages = ref(null);

const cardProps = {
    title: "Process Messages Editor",
    subtitle: "",
    text: "The Process Messages Editor provides an intuitive interface for managing and configuring BPMN message elements within your diagram. Unlike typical process elements, message elements are standalone components that facilitate communication between events and tasks."
};

const messageLabels = {
    title: 'Messages'
};

const messageHeaders = [
    'Id',
    'Name'
];

const messageHandlers = {
    create: () => {
        EventBus.emit(EVENT_TYPE.CREATE_WORKFLOW_MESSAGE, {
            type: ELEMENT_TYPES.MESSAGE,
            field: null
        });
    },
    edit: (messageItem) => {
        EventBus.emit(EVENT_TYPE.EDIT_WORKFLOW_MESSAGE, {
            type: ELEMENT_TYPES.MESSAGE,
            field: messageItem.item
        });
    },
    remove: (messageItem) => {
        const indexToRemove = messageItem.index;
        workflowMessages.value = workflowMessages.value.filter((_, index) => index !== indexToRemove);
        EventBus.emit(EVENT_TYPE.SAVE_WORKFLOW_MESSAGE, workflowMessages.value);
    }
};

onMounted(() => {
    EventBus.on(EVENT_TYPE.ADD_CREATED_WORKFLOW_MESSAGE, (newWorkflowMessage) => {
        if(!newWorkflowMessage) {
            return;
        }

        workflowMessages.value.push(newWorkflowMessage);
        EventBus.emit(EVENT_TYPE.SAVE_WORKFLOW_MESSAGE, workflowMessages.value);
    });

    EventBus.on(EVENT_TYPE.UPDATE_EDITED_WORKFLOW_MESSAGE, (editedWorkflowMessage) => {
        if(!editedWorkflowMessage) {
            return;
        }

        EventBus.emit(EVENT_TYPE.SAVE_WORKFLOW_MESSAGE, workflowMessages.value);
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.ADD_CREATED_WORKFLOW_MESSAGE);
    EventBus.off(EVENT_TYPE.UPDATE_EDITED_WORKFLOW_MESSAGE);
});

watch(
  () => model, 
  () => {
    workflowMessages.value = model.value;
  },
  { immediate: true ,deep: true }
);

</script>

<style scoped>
</style>