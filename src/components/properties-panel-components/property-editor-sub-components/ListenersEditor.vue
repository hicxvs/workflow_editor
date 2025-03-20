<template>
    <div class="listeners-editor" data-testid="listeners-editor">
        <p class="v-card-title">{{ title }}</p>

        {{ model }}

        <ConfigurationTable
            :title="taskListenersTitle"
            :headers="listnersHeaders"
            :listeners="emptyListners"
        />

        <ConfigurationTable
            :title="executionListenersTitle"
            :headers="listnersHeaders"
            :listeners="emptyListners"
        />
    </div>
</template>

<script setup>
import ConfigurationTable from '../../generic/ConfigurationTable.vue';

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
const fakeTaskListeners = [
    { implementation: 'fake task implemetation 1' },
    { implementation: 'fake task implemetation 2' },
    { implementation: 'fake task implemetation 3' },
    { implementation: 'fake task implemetation 4' },
    { implementation: 'fake task implemetation 5' },
];

const executionListenersTitle = 'Execution Listeners';
const fakeExecutionListeners = [
    { implementation: 'fake execution implemetation 1' },
    { implementation: 'fake execution implemetation 2' },
    { implementation: 'fake execution implemetation 3' },
    { implementation: 'fake execution implemetation 4' },
    { implementation: 'fake execution implemetation 5' },
];






</script>

<style scoped>

</style>