<template>
    <div class="boundary-event-properties-editor-container" data-testid="boundary-event-properties-editor-container">
        <Checkbox v-if="canDisplayCancelActivity" v-model="cancelActivity" :label="boundaryEventPropertiesLabels.cancelActivity" @update:modelValue="updateCancelActivity"/>
        <TextInput v-if="canDisplayErrorCode" v-model="errorCode" :label="boundaryEventPropertiesLabels.errorCode"  @input="updateErrorCode" :clearHandler="updateErrorCode"/>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import EventBus from '../../../../eventbus';
import { EVENT_TYPE } from '../../../../bpmn-workflow-editor/modeler/eventTypes';

import { EVENT_DEFINITION_TYPES } from '../../../../bpmn-workflow-editor/modeler/modelerTypes/eventDefinitionTypes';
import { hasMatchingTypes } from '../../../../bpmn-workflow-editor/utils/has-matching-types';

import Checkbox from '../../../generic/Checkbox.vue';
import Select from '../../../generic/Select.vue';
import TextInput from '../../../generic/TextInput.vue';

const model = defineModel();
const boundaryEvent = ref(null);
const eventDefinitions = ref(null);
const cancelActivity = ref(null);
const errorCode = ref(null);
const messageReference = ref(null);
const canDisplayCancelActivity = ref(false);
const canDisplayErrorCode = ref(false);

const boundaryEventPropertiesLabels = {
    cancelActivity: 'Cancel Activity',
    errorCode: 'Error Code',
    messageRefence: 'Message Ref'
};

const fieldKeys = {
    cancelActivity: 'cancelActivity',
    errorCode: 'errorCode',
    messageRefence: 'messageRefence'
};

function canDisplay(eventDefinitions, requestedTypes) {
    return hasMatchingTypes(eventDefinitions, requestedTypes);
}

onMounted(() => {
    EventBus.emit(EVENT_TYPE.GET_BOUNDARY_EVENT_ELEMENTS);
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.BOUNDARY_EVENT_ELEMENTS_READY);
});

watch(
  () => model, 
  () => {
    EventBus.on(EVENT_TYPE.BOUNDARY_EVENT_ELEMENTS_READY, (boundaryEventElementsCollection) => {
        if(!boundaryEventElementsCollection || !boundaryEventElementsCollection.length) {
            return;
        }

        boundaryEvent.value = boundaryEventElementsCollection.find(boundaryEvent => boundaryEvent.id === model.value.id);
        eventDefinitions.value = boundaryEvent.value.eventDefinitions;
        canDisplayCancelActivity.value = canDisplay(eventDefinitions.value, [EVENT_DEFINITION_TYPES.MESSAGE_EVENT_DEFINITION]);
        canDisplayErrorCode.value = canDisplay(eventDefinitions.value, [EVENT_DEFINITION_TYPES.ERROR_EVENT_DEFINITION]);

        cancelActivity.value = boundaryEvent.value?.cancelActivity || false;
        errorCode.value = '';
    });


  },
  { immediate: true, deep: true }
);

function updateCancelActivity() {
    EventBus.emit(EVENT_TYPE.UPDATE_BOUNDARY_EVENT_ELEMENT_PROPERTY, 
        {
            elementId: boundaryEvent.value?.id,
            elementProperty: fieldKeys.cancelActivity,
            elementPropertyValue: cancelActivity.value
        }
    );
}

function updateErrorCode() {
    EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT_PROPERTY, 
        {
            elementId: model.value?.id,
            elementProperty: fieldKeys.errorCode,
            elementPropertyValue: errorCode.value
        }
    );
}

</script>

<style scoped>

</style>