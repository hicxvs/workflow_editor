<template>
    <v-expansion-panel>
        <v-expansion-panel-title>
            <h3>{{ panelTitle }}</h3>            
        </v-expansion-panel-title>
        <v-expansion-panel-text>
            <div v-if="model" class="main-instance-content" data-testid="main-instance-content">
                <Checkbox v-model="multiInstance.isSequential" :label="multiInstanceLabels.isSequential" @update:modelValue="updateMultiInstanceProperty"/>
                <TextInput v-model="multiInstance.loopCardinality" :label="multiInstanceLabels.loopCardinality" @input="updateMultiInstanceProperty" :clearHandler="updateMultiInstanceProperty" :clearable="isClearable" :type="textInputTypeNumber" />
                <TextInput v-model="multiInstance.collection" :label="multiInstanceLabels.collection"  @input="updateMultiInstanceProperty" :clearHandler="updateMultiInstanceProperty" :clearable="isClearable" />
                <TextInput v-model="multiInstance.elementVariable" :label="multiInstanceLabels.elementVariable"  @input="updateMultiInstanceProperty" :clearHandler="updateMultiInstanceProperty" :clearable="isClearable" />
                <TextInput v-model="multiInstance.completionCondition" :label="multiInstanceLabels.completionCondition"  @input="updateMultiInstanceProperty" :clearHandler="updateMultiInstanceProperty" :clearable="isClearable" />
            </div>
        </v-expansion-panel-text>
    </v-expansion-panel>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ACTIVITY_TYPES } from '../../../bpmn-workflow-editor/modeler/modelerTypes/activityTypes';
import { EVENT_TYPE } from '../../../bpmn-workflow-editor/modeler/eventTypes';
import EventBus from '../../../eventbus';

import Checkbox from "../../generic/Checkbox.vue";
import TextInput from "../../generic/TextInput.vue";

const model = defineModel();
const multiInstance = ref(null);
const isClearable = ref(true);
const textInputTypeNumber = ref('number');

const panelTitle = 'Multi Instance';

const multiInstanceLabels = {
    isSequential: 'Sequential',
    loopCardinality: 'Loop cardinality',
    collection: 'collection',
    elementVariable: 'Element Variable',
    completionCondition: 'Completion Condition'
};

const fieldKeys = {
    loopCharacteristics: 'loopCharacteristics'
};

function extractMultiInstanceValues(multiInstance) {
    return {
        isSequential: (multiInstance) ? multiInstance?.isSequential : false,
        completionCondition: (multiInstance) ? multiInstance?.completionCondition?.body : '',
        loopCardinality: (multiInstance) ? multiInstance?.loopCardinality?.body : '',
        collection: (multiInstance) ? multiInstance?.$attrs[ACTIVITY_TYPES.COLLECTION] : '',
        elementVariable: (multiInstance) ? multiInstance?.$attrs[ACTIVITY_TYPES.ELEMENT_VARIABLE] : ''
    };
}

function updateMultiInstanceProperty() {
    EventBus.emit(EVENT_TYPE.UPDATE_MULTI_INSTANCE_ELEMENT_PROPERTY, 
        {
            elementId: model.value?.id,
            elementProperty: fieldKeys.loopCharacteristics,
            elementPropertyValue: multiInstance.value
        }
    );
}

watch(
  () => model, 
  () => {

    if(!model.value?.loopCharacteristics) {
        multiInstance.value = extractMultiInstanceValues();
        return;
    }

    multiInstance.value = extractMultiInstanceValues(model.value.loopCharacteristics);
  },
  { immediate: true, deep: true }
);

</script>

<style scoped>
.main-instance-content {
    padding: 0 16px;
}

</style>