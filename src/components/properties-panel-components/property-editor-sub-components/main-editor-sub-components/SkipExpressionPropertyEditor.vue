<template>
    <div class="skip-expression-property-editor-container" data-testid="skip-expression-property-editor-container">
        <TextInput :label="skipExpressionPropertyLabel" v-model="skipExpression" @input="updateSkipExpression" :clearHandler="updateSkipExpression"/>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

import EventBus from '../../../../eventbus';
import { EVENT_TYPE } from '../../../../bpmn-workflow-editor/modeler/eventTypes';

import TextInput from '../../../generic/TextInput.vue';

const model = defineModel();
const skipExpression = ref(null);

const skipExpressionPropertyLabel = "Skip Expression";

const fieldKeys = {
    skipExpression: 'skipExpression'
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

watch(
  () => model, 
  () => {
    skipExpression.value = model.value?.skipExpression || '';
  },
  { immediate: true, deep: true }
);
</script>

<style scoped>
</style>