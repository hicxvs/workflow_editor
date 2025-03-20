<template>
    <div class="listeners-editor-container" data-testid="listeners-editor-container">
        <p class="v-card-title">{{ title }}</p>

        {{ model }}

        <ConfigurationTable
            :title="taskListenersTitle"
            :headers="listnersHeaders"
            :listeners="fakeTaskListeners"
            :createNewListenerHandler="taskListenersHandlers.create"
            :editListenerHandler="taskListenersHandlers.edit"
        />

        <ConfigurationTable
            :title="executionListenersTitle"
            :headers="listnersHeaders"
            :listeners="emptyListners"
            :createNewListenerHandler="executionListenersHandlers.create"
            :editListenerHandler="executionListenersHandlers.edit"
        />
    </div>
</template>

<script setup>
import ConfigurationTable from '../../generic/ConfigurationTable.vue';
import { TaskListenerType } from '../../../bpmn-workflow-editor/activiti-model-definitions/activiti-model-types/task-listener';
import { ExecutionListenerType } from '../../../bpmn-workflow-editor/activiti-model-definitions/activiti-model-types/execution-listener';
import { EVENT_TYPE } from '../../../bpmn-workflow-editor/modeler/eventTypes';
import EventBus from '../../../eventbus';

const model = defineModel();
const title = 'Listeners';

const listnersHeaders = [
    'Listener implementation',
    'Type',
    'Event',
    'Fields'
];

const emptyListners = [];

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


const fakeTaskListeners = [
    { implementation: 'fake task implemetation 1' },
    { implementation: 'fake task implemetation 2' },
    { implementation: 'fake task implemetation 3' },
    { implementation: 'fake task implemetation 4' },
    { implementation: 'fake task implemetation 5' },
];





</script>

<style scoped>

</style>