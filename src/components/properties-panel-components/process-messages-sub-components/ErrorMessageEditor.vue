<template>
    <v-expansion-panel>
        <v-expansion-panel-title>
            <h3>{{ panelTitle }}</h3> 
        </v-expansion-panel-title>
        <v-expansion-panel-text>
            <div class="error-messages-editor-content" data-testid="error-messages-editor-content">
                <ConfigurationTable
                    :title="''"
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
            </div>
        </v-expansion-panel-text>
    </v-expansion-panel>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { ELEMENT_TYPES } from '../../../bpmn-workflow-editor/modeler/modelerTypes/elementTypes';
import EventBus from '../../../eventbus';
import { EVENT_TYPE } from '../../../bpmn-workflow-editor/modeler/eventTypes';

import ConfigurationTable from '../../generic/ConfigurationTable.vue';

const model = defineModel();
const errorWorkflowMessages = ref(null);

const panelTitle = 'Error Messages';

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