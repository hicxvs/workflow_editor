<template>
    <div class="sequence-flow-properties-editor-container">
        {{ model }}

        <TextInput :label="inputPropertiesLabels.labelWith" v-model="labelWith" @input="updateLabelWith" :clearHandler="updateLabelWith"/>
        <TextInput :label="inputPropertiesLabels.skipExpression" v-model="skipExpression" @input="updateSkipExpression" :clearHandler="updateSkipExpression"/>
        <TextInput :label="inputPropertiesLabels.condition" v-model="condition" @input="updateCondition" :clearHandler="updateCondition"/>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

import TextInput from '../../../generic/TextInput.vue';

const model = defineModel();
const isClearable = ref(false);
const labelWith = ref(null);
const skipExpression = ref(null);
const condition = ref(null);

const inputPropertiesLabels = {
    labelWith: "Label with (50 - 500)",
    skipExpression: "Skip Expression",
    condition: "Condition"
};

const fieldKeys = {
    labelWith: 'labelWith',
    skipExpression: 'skipExpression',
    condition: 'condition'
};

function updateLabelWith() {
    updateProperty(fieldKeys.labelWith, labelWith.value);
}

function updateSkipExpression() {
    updateProperty(fieldKeys.skipExpression, skipExpression.value);
}

function updateCondition() {
    updateProperty(fieldKeys.condition, condition.value);

}

function updateProperty(propertyKey, propertyValue) {
    /*const targetProperty = UserTask.properties.find(property => property.ns.localName === propertyKey);

    EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT_PROPERTY, 
        {
            elementId: model.value?.id,
            elementProperty: targetProperty.ns.localName,
            elementPropertyValue: propertyValue
        }
    ); */
}



watch(
  () => model, 
  () => {
    labelWith.value = model.value?.labelWith || '';
    skipExpression.value = model.value?.skipExpression || '';
    condition.value = model.value?.condition || '';
  },
  { immediate: true, deep: true }
);

</script>

<style scoped>

</style>