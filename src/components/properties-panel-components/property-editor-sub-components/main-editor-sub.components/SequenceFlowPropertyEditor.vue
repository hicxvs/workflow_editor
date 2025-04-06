<template>
    <div class="sequence-flow-properties-editor-container">
        <TextInput :label="inputPropertiesLabels.skipExpression" v-model="skipExpression" @input="updateSkipExpression" :clearHandler="updateSkipExpression"/>
        <TextArea :label="inputPropertiesLabels.conditionExpression" v-model="conditionBody" @input="updateCondition" :clearHandler="updateCondition" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import EventBus from '../../../../eventbus';
import { EVENT_TYPE } from '../../../../bpmn-workflow-editor/modeler/eventTypes';

import TextInput from '../../../generic/TextInput.vue';
import TextArea from '../../../generic/TextArea.vue';

const model = defineModel();
const skipExpression = ref(null);
const conditionExpression = ref(null);
const conditionBody = ref(null);

const inputPropertiesLabels = {
    skipExpression: "Skip Expression",
    conditionExpression: "Condition Expression"
};

const fieldKeys = {
    skipExpression: 'skipExpression',
    conditionExpression: 'conditionExpression'
};

function updateSkipExpression() {
    EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT_PROPERTY, 
        {
            elementId: model.value?.id,
            elementProperty: fieldKeys.skipExpression,
            elementPropertyValue: skipExpression.value
        }
    );
}

function updateCondition() {   
    EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT_CONDITION_EXPRESSION, 
        {
            elementId: model.value?.id,
            elementProperty: fieldKeys.conditionExpression,
            elementPropertyValue: conditionBody.value
        }
    );
}

watch(
  () => model, 
  () => {
    skipExpression.value = model.value?.skipExpression || '';
    conditionExpression.value = model.value?.conditionExpression || '';
    conditionBody.value = conditionExpression.value?.body || '';
  },
  { immediate: true, deep: true }
);

</script>

<style scoped>

</style>