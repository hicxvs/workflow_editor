<template>
    <div class="boundary-event-properties-editor-container" data-testid="boundary-event-properties-editor-container">
        {{ model }}
        <Checkbox v-if="shouldDisplayCancelActivity" v-model="cancelActivity" :label="boundaryEventPropertiesLabels.cancelActivity" @update:modelValue="updateCancelActivity"/>
        <TextInput v-if="shouldDisplayErrorCode" v-model="errorCode" :label="boundaryEventPropertiesLabels.errorCode"  @input="updateErrorCode" :clearHandler="updateErrorCode"/>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import EventBus from '../../../../eventbus';
import { EVENT_TYPE } from '../../../../bpmn-workflow-editor/modeler/eventTypes';

import { EVENT_DEFINITION_TYPES } from '../../../../bpmn-workflow-editor/modeler/modelerTypes/eventDefinitionTypes';
import { hasMatchingTypes } from '../../../../bpmn-workflow-editor/utils/has-matching-types';

import Checkbox from '../../../generic/Checkbox.vue';
import Select from '../../../generic/Select.vue';
import TextInput from '../../../generic/TextInput.vue';

const model = defineModel();
const eventDefinitions = ref(null);
const cancelActivity = ref(null);
const errorCode = ref(null);
const messageReference = ref(null);

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

const shouldDisplayCancelActivity = computed(() => {
  const requestedTypes = [EVENT_DEFINITION_TYPES.MESSAGE_EVENT_DEFINITION];
  return hasMatchingTypes(eventDefinitions.value, requestedTypes);
});

const shouldDisplayErrorCode = computed(() => {
  const requestedTypes = [EVENT_DEFINITION_TYPES.ERROR_EVENT_DEFINITION];
  return hasMatchingTypes(eventDefinitions.value, requestedTypes);
});

watch(
  () => model, 
  () => {
    eventDefinitions.value = model.value.eventDefinitions || [];
    cancelActivity.value = model.value.cancelActivity || false;
  },
  { immediate: true, deep: true }
);

function updateCancelActivity() {
    EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT_ATTRIBUTE, 
        {
            elementId: model.value?.id,
            elementProperty: fieldKeys.cancelActivity,
            elementPropertyValue: cancelActivity.value
        }
    );
}

function updateErrorCode() {
    EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT_ATTRIBUTE, 
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