<template>
    <div class="multi-instance-panel-container" data-testid="multi-instance-panel-container">
        <Card :title="cardProps.title" :subtitle="cardProps.subtitle" :text="cardProps.text">
            <template #content>
                <div v-if="model" class="main-instance-content" data-testid="main-instance-content">
                    {{ model }}
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ACTIVITY_TYPES } from '../../../bpmn-workflow-editor/modeler/modelerTypes/activityTypes';

import Card from '../../generic/Card.vue';
import Select from '../../generic/Select.vue';
import TextArea from "../../generic/TextArea.vue";

const model = defineModel();
const multiInstance = ref(null);
const isSequencial = ref(false);
const collection = ref(null);
const loopCardinality = ref(null);
const completionCondition = ref(null);
const elementVariable = ref(null);

const cardProps = {
    title: "Multi Instance",
    subtitle: "",
    text: ""
};

const multiInstanceLabels = {
    sequencial: 'Sequencial',
    loopCardinality: 'Loop cardinality',
    collection: 'collection',
    elementVariable: 'Element Variable',
    completionCondition: 'Completion Condition'
};

const fieldKeys = {
    sequencial: 'sequencial',
    loopCardinality: 'loopCardinality',
    collection: 'collection',
    elementVariable: 'elementVariable',
    completionCondition: 'completionCondition'
};

watch(
  () => model, 
  () => {

    multiInstance.value = model.value?.loopCharacteristics || {};

    isSequencial.value = multiInstance.value?.isSequencial || false;
    completionCondition.value = multiInstance.value?.completionCondition?.body || '';
    loopCardinality.value = multiInstance.value?.loopCardinality.body || '';
    collection.value = multiInstance.value.$attrs[ACTIVITY_TYPES.COLLECTION] || '';
    elementVariable.value = multiInstance.value.$attrs[ACTIVITY_TYPES.ELEMENT_VARIABLE] || '';

    console.log( multiInstance.value);
    
  },
  { immediate: true, deep: true }
);

</script>

<style scoped>
.main-instance-content {
    padding: 0 16px;
}

</style>