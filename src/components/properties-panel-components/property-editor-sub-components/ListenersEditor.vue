<template>
    <div class="listeners-editor-container" data-testid="listeners-editor-container">
        <p class="v-card-title">{{ title }}</p>

        <ConfigurationTable
            :title="taskListenersTitle"
            :headers="listnersHeaders"
            v-model="taskListeners"
            :createNewItemHandler="taskListenersHandlers.create"
            :editItemHandler="taskListenersHandlers.edit"
            :removeItemHandler="taskListenersHandlers.remove"
        >
            <template #row="{ item }">
                <td>{{ item?.listener?.class }}</td>
                <td>{{ item?.listener?.$type }}</td>
                <td>{{ item?.listener?.event }}</td>
                <td>{{ item?.listener?.fields?.length || 0 }}</td>
            </template>
        </ConfigurationTable>

        <ConfigurationTable
            :title="executionListenersTitle"
            :headers="listnersHeaders"
            v-model="executionListeners"
            :createNewItemHandler="executionListenersHandlers.create"
            :editItemHandler="executionListenersHandlers.edit"
            :removeItemHandler="executionListenersHandlers.remove"
        >
            <template #row="{ item }">
                <td>{{ item?.listener?.class }}</td>
                <td>{{ item?.listener?.$type }}</td>
                <td>{{ item?.listener?.event }}</td>
                <td>{{ item?.listener?.fields?.length || 0 }}</td>
            </template>
        </ConfigurationTable>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
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
        EventBus.emit(EVENT_TYPE.CREATE_LISTENER, {
            type: TaskListenerType,
            listener: null
        });
    },
    edit: (taskListener) => {
        EventBus.emit(EVENT_TYPE.EDIT_LISTENER, taskListener.item);
    },
    remove: (taskListenerItem) => {
        const indexToRemove = taskListenerItem.index;
        taskListeners.value = taskListeners.value.filter((_, index) => index !== indexToRemove);
    }
};

const executionListenersHandlers = {
    create: () => {
        EventBus.emit(EVENT_TYPE.CREATE_LISTENER, {
            type: ExecutionListenerType,
            listener: null
        });
    },
    edit: (executionListener) => {
        EventBus.emit(EVENT_TYPE.EDIT_LISTENER, executionListener.item);
    },
    remove: (executionListener) => {
        const indexToRemove = executionListener.index;
        executionListeners.value = executionListeners.value.filter((_, index) => index !== indexToRemove);
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

    const listeners = values.filter(element => element?.$type === `activiti:${listenerType}`);
    return listeners.map(listener => ({
        type: listenerType,
        listener
    }));
}

watch(
  () => model, 
  () => {
    taskListeners.value = getListeners(TaskListenerType);
    executionListeners.value = getListeners(ExecutionListenerType);
  },
  { deep: true }
);

onMounted(() => {
    EventBus.on(EVENT_TYPE.ADD_CREATED_LISTENER, (newListener) => {
        if(!newListener) {
            return;
        }

        if(newListener.type === TaskListenerType) {
            taskListeners.value.push(newListener);
            EventBus.emit(EVENT_TYPE.SAVE_LISTENER, taskListeners.value);
            return;
        }

        executionListeners.value.push(newListener);
        EventBus.emit(EVENT_TYPE.SAVE_LISTENER, executionListeners.value);
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.ADD_CREATED_LISTENER);
});

</script>

<style scoped>

</style>