<template>
    <v-expansion-panel>
        <v-expansion-panel-title>
            <h3>{{ panelTitle }}</h3> 
        </v-expansion-panel-title>
        <v-expansion-panel-text>
            <div class="messages-editor-content" data-testid="messages-editor-content">
                <ConfigurationTable
                    :title="''"
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
const workflowMessages = ref(null);

const panelTitle = 'Messages';

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