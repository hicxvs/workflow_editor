<template>
    <div class="listeners-editor" data-testid="listeners-editor">
        Listeners editor here!!

        {{ model }}

        <ConfigurationTable
            :title="taskListenersTitle"
            :headers="listnersHeaders"
            :listeners="fakeTaskListeners"
        />
    </div>
</template>

<script setup>
import ConfigurationTable from '../../generic/ConfigurationTable.vue';

const model = defineModel();

const listnersHeaders = [
    'Listener implementation',
    'Type',
    'Event',
    'Fields'
];

const taskListenersTitle = 'Task Listeners';
const fakeTaskListeners = [
    { implementation: 'fake implemetation 1' },
    { implementation: 'fake implemetation 2' },
    { implementation: 'fake implemetation 3' },
    { implementation: 'fake implemetation 4' },
    { implementation: 'fake implemetation 5' },
];

</script>

<style scoped>

</style>