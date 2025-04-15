<template>
    <div class="call-activity-properties-editor-container" data-testid="call-activity-properties-editor-container">
        <TextInput v-model="calledElement" :label="callActivityPropertiesLabels.calledElement" @input="updateCalledElement" :clearHandler="updateCalledElement"/>

        copyInputParamenters::{{ copyInputParamenters }} <br/><br/>
        copyOutputParamenters::{{ copyOutputParamenters }} <br/><br/>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import EventBus from '../../../../eventbus';
import { EVENT_TYPE } from '../../../../bpmn-workflow-editor/modeler/eventTypes';
import { ACTIVITY_TYPES } from '../../../../bpmn-workflow-editor/modeler/modelerTypes/activityTypes';
import { createDeepCopy } from '../../../../bpmn-workflow-editor/utils/create-deep-copy';
import { saveChanges } from '../../../../bpmn-workflow-editor/utils/save-changes';

import TextInput from '../../../generic/TextInput.vue';
import ConfigurationTable from '../../../generic/ConfigurationTable.vue';


const model = defineModel();
const calledElement = ref(null);
const extensionElements = ref(null);

const originalInputParamenters = ref(null);
const copyInputParamenters = ref(null);

const originalOutputParamenters = ref(null);
const copyOutputParamenters = ref(null);

const callActivityPropertiesLabels = {
    calledElement: 'Called Element',
    inputParameters: 'Input Paramenters',
    outputParameters: 'Output Parameters'
};

const fieldKeys = {
    calledElement: 'calledElement'
};

const inputAndOutputParametersHeaders = [
    'Source',
    'Source Expression',
    'Target',
    'Target Expression'
];


watch(
    () => model,
    () => {
        calledElement.value = model.value.calledElement || '';
        extensionElements.value = model.value?.extensionElements?.values || [];
        originalInputParamenters.value = extensionElements.value.filter(item => item.$type === ACTIVITY_TYPES.IN);       
        originalOutputParamenters.value = extensionElements.value.filter(item => item.$type === ACTIVITY_TYPES.OUT);
        copyInputParamenters.value = createDeepCopy(originalInputParamenters.value);
        copyOutputParamenters.value = createDeepCopy(originalOutputParamenters.value);
    },
    { immediate: true, deep: true }
);

function updateCalledElement() {
    EventBus.emit(EVENT_TYPE.UPDATE_CALL_ACTIVITY_ELEMENT_PROPERTY, 
        {
            elementId: model.value?.id,
            elementProperty: fieldKeys.calledElement,
            elementPropertyValue: calledElement.value
        }
    );
}

</script>

<style scoped>
</style>