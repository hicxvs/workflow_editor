<template>
    <div class="script-task-properties-editor-container" data-testid="script-task-properties-editor-container">
        <Select v-model="scriptTaskFormat" :label="scriptTaskPropertiesLabels.scriptFormat" :selectOptionItems="scriptFormatSelectOptions" :selectItemClickHandler="updatesScriptFormat"/>
        <Checkbox v-model="scriptTaskAutoStoreVariables" :label="scriptTaskPropertiesLabels.autoStoreVariables" @update:modelValue="updateAutoStoreVariables"/>
        <TextInput :label="scriptTaskPropertiesLabels.script" v-model="scriptTaskScript" @input="updateScript" :clearHandler="updateScript"/>
        <Button :label="scriptTaskPropertiesLabels.retrieveScript" :buttonColor="buttonColors.green" @click="retrieveScript" class="retrive-script-button"/>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

import EventBus from '../../../../eventbus';
import { EVENT_TYPE } from '../../../../bpmn-workflow-editor/modeler/eventTypes';
import { isValidScriptId } from '../../../../bpmn-workflow-editor/utils/is-valid-script-id';
import ScriptTask from '../../../../bpmn-workflow-editor/activiti-model-definitions/activiti-model-types/script-task';

import Select from '../../../generic/Select.vue';
import Checkbox from '../../../generic/Checkbox.vue';
import TextInput from '../../../generic/TextInput.vue';
import Button from '../../../generic/Button.vue';
import { extractScriptId } from '../../../../bpmn-workflow-editor/utils/extract-script-id';

const model = defineModel();
const scriptTaskFormat = ref(null);
const scriptTaskAutoStoreVariables = ref (null);
const scriptTaskScript = ref (null);

const scriptTaskPropertiesLabels = {
    scriptFormat: 'Script Format',
    autoStoreVariables: 'Auto Store Variables',
    script: 'Script',
    retrieveScript: 'Retrieve Script'
};

const buttonColors = {
    grey: 'grey',
    green: 'green'
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

const scriptHandler = {
    groovy: {
        handler: () => {
            const targetProperty = ScriptTask.properties.find(property => property.ns.localName === fieldKeys.script).ns.localName;

            EventBus.emit(EVENT_TYPE.LOAD_CODE_SCRIPT, {
                codeLanguage: scriptTaskFormat.value || scriptFormatSelectOptions.value[0].value,
                codeScript: scriptTaskScript.value,
                codeScriptId: extractScriptId(scriptTaskScript.value),
                readOnly: false,
                elementId: model.value?.id,
                elementProperty: targetProperty 
            });            
        }
    },
    java: {
        handler: () => {
            const targetStartString = 'scripts.execute';
            const scriptId = extractScriptId(scriptTaskScript.value);

            if(!isValidScriptId(scriptId)) {
                return;
            }

            if(!scriptTaskScript.value.startsWith(targetStartString)) {
                EventBus.emit(EVENT_TYPE.LOAD_CODE_SCRIPT, {
                    codeLanguage: scriptTaskFormat.value || scriptFormatSelectOptions.value[0].value,
                    codeScript: scriptTaskScript.value,
                    codeScriptId: scriptId,
                    readOnly: true
                });

                return;
            }

            EventBus.emit(EVENT_TYPE.GET_SCRIPT_CODE, scriptId);
        }
    }
};

onMounted(() => {
    EventBus.on(EVENT_TYPE.UPDATE_SCRIPT_VALUE, editorScriptValue => {
        scriptTaskScript.value = editorScriptValue || '';
    });
}); 

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.UPDATE_SCRIPT_VALUE);
});

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

    const targetProperty = ScriptTask.properties.find(property => property.ns.localName === fieldKeys.script).ns.localName;

    EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT_PROPERTY, 
        {
            elementId: model.value?.id,
            elementProperty: targetProperty,
            elementPropertyValue: scriptTaskScript.value
        }
    );
}

function retrieveScript() {
    const codeLanguage = scriptTaskFormat.value || scriptFormatSelectOptions.value[0].value;
    scriptHandler[codeLanguage]?.handler();
}
</script>

<style scoped>
.retrive-script-button {
    margin-bottom: 16px;
}
</style>