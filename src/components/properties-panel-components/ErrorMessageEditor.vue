<template>
    <div class="error-message-editor-container" data-testid="error-message-editor-container">
        <Card :title="cardProps.title" :subtitle="cardProps.subtitle" :text="cardProps.text">
            <template #content>
                <ConfigurationTable
                    :title="errorMessageLabels.title"
                    :headers="errorMessageHeaders"
                    v-model="errorWorkflowMessages"
                    :createNewItemHandler="errorMessageHandlers.create"
                    :editItemHandler="errorMessageHandlers.edit"
                    :removeItemHandler="errorMessageHandlers.remove"
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

const model = defineModel();
const errorWorkflowMessages = ref(null);

const cardProps = {
    title: "Process Error Messages Editor",
    subtitle: "",
    text: "The Process Error Messages Editor provides an intuitive interface for managing and configuring BPMN error message elements within your diagram. Unlike typical process elements, error message elements are standalone components that facilitate communication between events and tasks."
};

const errorMessageLabels = {
    title: 'Error Messages'
};

const errorMessageHeaders = [
    'Id',
    'Name'
];

const errorMessageHandlers = {
    create: () => {
        EventBus.emit(EVENT_TYPE.CREATE_WORKFLOW_ERROR_MESSAGE, {
            type: ELEMENT_TYPES.ERROR,
            field: null
        });
    },
    edit: (messageItem) => {
        EventBus.emit(EVENT_TYPE.EDIT_WORKFLOW_ERROR_MESSAGE, {
            type: ELEMENT_TYPES.ERROR,
            field: messageItem.item
        });
    },
    remove: (messageItem) => {
        const indexToRemove = messageItem.index;
        errorWorkflowMessages.value = errorWorkflowMessages.value.filter((_, index) => index !== indexToRemove);
        EventBus.emit(EVENT_TYPE.SAVE_WORKFLOW_ERROR_MESSAGE, errorWorkflowMessages.value);
    }
};

onMounted(() => {
    EventBus.on(EVENT_TYPE.ADD_CREATED_WORKFLOW_ERROR_MESSAGE, (newWorkflowMessage) => {
        if(!newWorkflowMessage) {
            return;
        }

        errorWorkflowMessages.value.push(newWorkflowMessage);
        EventBus.emit(EVENT_TYPE.SAVE_WORKFLOW_ERROR_MESSAGE, errorWorkflowMessages.value);
    });

    EventBus.on(EVENT_TYPE.UPDATE_EDITED_WORKFLOW_ERROR_MESSAGE, (editedWorkflowMessage) => {
        if(!editedWorkflowMessage) {
            return;
        }

        EventBus.emit(EVENT_TYPE.SAVE_WORKFLOW_ERROR_MESSAGE, errorWorkflowMessages.value);
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.ADD_CREATED_WORKFLOW_ERROR_MESSAGE);
    EventBus.off(EVENT_TYPE.UPDATE_EDITED_WORKFLOW_ERROR_MESSAGE);
});

watch(
  () => model, 
  () => {
    errorWorkflowMessages.value = model.value;
  },
  { immediate: true ,deep: true }
);

</script>

<style scoped>
</style>