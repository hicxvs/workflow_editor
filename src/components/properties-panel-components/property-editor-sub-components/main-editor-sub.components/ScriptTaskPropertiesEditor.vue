<template>
    <div class="script-task-properties-editor-container" data-testid="script-task-properties-editor-container">
        <Select v-model="scriptTaskFormat" :label="scriptTaskPropertiesLabels.scriptFormat" :selectOptionItems="scriptFormatSelectOptions" :selectItemClickHandler="updatesScriptFormat"/>

        <Checkbox v-model="scriptTaskAutoStoreVariables" :label="scriptTaskPropertiesLabels.autoStoreVariables" @update:modelValue="updateAutoStoreVariables"/>

        <TextInput :label="scriptTaskPropertiesLabels.script" v-model="scriptTaskScript" @input="updateScript" :clearHandler="updateScript"/>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

import EventBus from '../../../../eventbus';
import { EVENT_TYPE } from '../../../../bpmn-workflow-editor/modeler/eventTypes';
import ScriptTask from '../../../../bpmn-workflow-editor/activiti-model-definitions/activiti-model-types/script-task';

import Select from '../../../generic/Select.vue';
import Checkbox from '../../../generic/Checkbox.vue';
import TextInput from '../../../generic/TextInput.vue';

const model = defineModel();
const scriptTaskFormat = ref(null);
const scriptTaskAutoStoreVariables = ref (null);
const scriptTaskScript = ref (null);

const scriptTaskPropertiesLabels = {
    scriptFormat: 'Script Format',
    autoStoreVariables: 'Auto Store Variables',
    script: 'Script'
};

const scriptFormatSelectOptions = ref([
    {
        value: 'java',
        label: 'Java'
    },
    {
        value: 'groovy',
        label: 'Groovy'
    }
]);

const fieldKeys = {
    scriptFormat: 'scriptFormat',
    scriptTaskAutoStoreVariables: 'autoStoreVariables',
    script: 'script',
};

watch(
  () => model, 
  () => {
    scriptTaskFormat.value = model.value?.scriptFormat || scriptFormatSelectOptions.value[0].label;
    
    const isScriptTaskAutoStoreVariablesChecked = model.value?.$attrs[`activiti:${fieldKeys.scriptTaskAutoStoreVariables}`];
    scriptTaskAutoStoreVariables.value = ( isScriptTaskAutoStoreVariablesChecked === 'true' ) ? true : false;

    scriptTaskScript.value = model.value?.script || '';
  },
  { immediate: true, deep: true }
);


function updatesScriptFormat() {

    const targetProperty = ScriptTask.properties.find(property => property.ns.localName === fieldKeys.scriptFormat);
    const selectedScript = scriptFormatSelectOptions.value.find(option => option.label === scriptTaskFormat.value);

    EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT_PROPERTY, 
        {
            elementId: model.value?.id,
            elementProperty: targetProperty.ns.localName,
            elementPropertyValue: selectedScript.value
        }
    );    
}

function updateAutoStoreVariables() {

    const targetProperty = ScriptTask.properties.find(property => property.ns.localName === fieldKeys.scriptTaskAutoStoreVariables).name;

    EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT_ATTRIBUTE, 
        {
            elementId: model.value?.id,
            elementProperty: targetProperty,
            elementPropertyValue: scriptTaskAutoStoreVariables.value?.toString()
        }
    );
}

function updateScript() {
    EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT_PROPERTY, 
        {
            elementId: model.value?.id,
            elementProperty: fieldKeys.script,
            elementPropertyValue: scriptTaskScript.value
        }
    );
}

</script>

<style scoped>

</style>