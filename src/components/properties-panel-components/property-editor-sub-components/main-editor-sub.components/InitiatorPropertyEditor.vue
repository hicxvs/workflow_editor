<template>
    <div class="form-key-property-editor-container" data-testid="form-key-property-editor-container">
        <TextInput :label="inputTaskPropertiesLabels.initiator" v-model="initiator" @input="updateInitiator" :clearHandler="updateInitiator"/>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

import EventBus from '../../../../eventbus';
import { EVENT_TYPE } from '../../../../bpmn-workflow-editor/modeler/eventTypes';
import StartEvent from '../../../../bpmn-workflow-editor/activiti-model-definitions/activiti-model-types/start-event';

import TextInput from '../../../generic/TextInput.vue';

const model = defineModel();
const initiator = ref(null);

const inputTaskPropertiesLabels = {
    initiator: "Initiator",
}

const fieldKeys = {
    initiator: 'initiator'
};

function updateInitiator() {
    const targetProperty = StartEvent.properties.find(property => property.ns.localName === fieldKeys.initiator);

    EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT_PROPERTY, 
        {
            elementId: model.value?.id,
            elementProperty: targetProperty.ns.localName,
            elementPropertyValue: initiator.value
        }
    );
}

watch(
  () => model, 
  () => {
    initiator.value = model.value?.initiator || '';
  },
  { immediate: true, deep: true }
);

</script>

<style scoped>
</style>