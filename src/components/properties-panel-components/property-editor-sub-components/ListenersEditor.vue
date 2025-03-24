<template>
    <div class="listeners-editor-container" data-testid="listeners-editor-container">
        <p class="v-card-title">{{ title }}</p>

        <ConfigurationTable
            :title="taskListenersTitle"
            :headers="listnersHeaders"
            v-model="taskListeners"
            :createNewListenerHandler="taskListenersHandlers.create"
            :editListenerHandler="taskListenersHandlers.edit"
        >
            <template #row="{ item }">
                <td>{{ item?.class }}</td>
                <td>{{ item?.$type }}</td>
                <td>{{ item?.event }}</td>
                <td>{{ item?.fields?.length || 0 }}</td>
            </template>
        </ConfigurationTable>

        <ConfigurationTable
            :title="executionListenersTitle"
            :headers="listnersHeaders"
            v-model="executionListeners"
            :createNewListenerHandler="executionListenersHandlers.create"
            :editListenerHandler="executionListenersHandlers.edit"
        >
            <template #row="{ item }">
                <td>{{ item?.class }}</td>
                <td>{{ item?.$type }}</td>
                <td>{{ item?.event }}</td>
                <td>{{ item?.fields?.length || 0 }}</td>
            </template>
        </ConfigurationTable>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import ConfigurationTable from '../../generic/ConfigurationTable.vue';
import { TaskListenerType } from '../../../bpmn-workflow-editor/activiti-model-definitions/activiti-model-types/task-listener';
import { ExecutionListenerType } from '../../../bpmn-workflow-editor/activiti-model-definitions/activiti-model-types/execution-listener';
import { EVENT_TYPE } from '../../../bpmn-workflow-editor/modeler/eventTypes';
import EventBus from '../../../eventbus';

const model = defineModel();

const title = 'Listeners';
const taskListeners = ref(null);
const executionListeners = ref(null);

const listnersHeaders = [
    'Listener implementation',
    'Type',
    'Event',
    'Fields'
];

const taskListenersTitle = 'Task Listeners';
const executionListenersTitle = 'Execution Listeners';

const taskListenersHandlers = {
    create: () => {
        EventBus.emit(EVENT_TYPE.CREATE_LISTENER, {type: TaskListenerType});
    },
    edit: (taksListenerItem) => {
        EventBus.emit(EVENT_TYPE.EDIT_LISTENER, { type: TaskListenerType, item: taksListenerItem});
    }
};

const executionListenersHandlers = {
    create: () => {
        EventBus.emit(EVENT_TYPE.CREATE_LISTENER, {type: ExecutionListenerType});
    },
    edit: (executionListenerItem) => {
        EventBus.emit(EVENT_TYPE.EDIT_LISTENER, { type: ExecutionListenerType, item: executionListenerItem});
    }
};

function getListeners(listenerType) {
    if(!model.value || !listenerType) {
        return;
    }

    const extensionElements = model.value.get('extensionElements');
    if(!extensionElements) {
        return [];
    }

    const values = extensionElements.get('values');
    if(!values || !Array.isArray(values) || !values.length) {
        return [];
    }

    return values.filter(element => element?.$type === `activiti:${listenerType}`);
}

watch(
  () => model, 
  () => {
    taskListeners.value = getListeners(TaskListenerType);
    executionListeners.value = getListeners(ExecutionListenerType);
  },
  { deep: true }
);

</script>

<style scoped>

</style>