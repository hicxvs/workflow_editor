<template>
    <div class="code-editor-container" data-testid="code-editor-container">
        <Modal
            :showCloseButton = "showButton"
            :showSaveButton = "showSaveButton"
            :showCancelButton = "!showButton"
            :saveButtonClickHandler = "save"
            v-model="showModal"
        >
            <template #title>
                {{ modalTitle }}
            </template>

            <template #content>
                <div id="editor" ref="editorCanvas" class="code-editor"></div>                             
            </template>
        </Modal>
    </div>
</template>

<script setup>
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';
import { EditorEngine } from '../../editor-engine';
import {ref, onMounted, onUnmounted, watch} from 'vue';

import Modal from '../generic/Modal.vue';

const showButton = ref(true);
const showModal = ref(false);
const modalTitle = ref('');

const editorEngine = EditorEngine();
const editorCanvas = ref(null);
const editorInstance = ref(null);
const editorInstanceCode = ref(null);
const editorCodeScriptId = ref(null);

const showSaveButton = ref(false);

onMounted(() => {
    EventBus.on(EVENT_TYPE.LOAD_CODE_SCRIPT, codeSettings => {
        editorInstanceCode.value = {
            code: codeSettings.codeScript || '',
            language: codeSettings.codeLanguage || 'java',
            readOnly: (codeSettings?.readOnly) ? true : false,
            elementId: codeSettings.elementId || null,
            elementProperty: codeSettings.elementProperty || null            
        };

        editorCodeScriptId.value = codeSettings.codeScriptId;
        modalTitle.value = codeSettings?.codeScriptId ? `Script Content - ${codeSettings.codeScriptId}` : 'Script Content';
        showSaveButton.value = !codeSettings.readOnly;
        showModal.value = true;
    });
    
    EventBus.on(EVENT_TYPE.SERVICE_TASK_SCRIPT_UPDATED, () => {
        showModal.value = false;
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.LOAD_CODE_SCRIPT);
    EventBus.off(EVENT_TYPE.SERVICE_TASK_SCRIPT_UPDATED); 
}); 

watch(
    () => editorCanvas.value,
    () => {
        if(!editorCanvas.value) {
            clear();
            return;
        }

        editorInstance.value = editorEngine.createCodeEditor(editorCanvas.value, editorInstanceCode.value.language, editorInstanceCode.value.code, editorInstanceCode.value.readOnly);  
    },
    { deep:true }
);

function clear() {
    editorInstance.value = null;
    editorInstanceCode.value = null;
    showSaveButton.value = false;
    modalTitle.value = '';
}

function save() {
    const editorValue = editorEngine.getValue();

    if(!editorInstanceCode.value?.elementId) {
        /*
            STATUS: PAUSED
            DESCRIPTION: This use case has been asked, by the CTO, to not be handled for now. 
            The code it's in place. once the functionality as asked to be resumed
            uncomment the line.

            updateServiceTaskScript(editorValue);
        */
        return;
    }

    updateElementProperty(editorValue);
    updateScriptValue(editorValue);  
    showModal.value = false;
}

/*
function updateServiceTaskScript(editorValue) {
    EventBus.emit(EVENT_TYPE.UPDATE_SERVICE_TASK_SCRIPT, {
        codeScriptId: editorCodeScriptId.value,
        codeScriptValue: editorValue
    });
} */

function updateElementProperty(editorValue) {
    EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT_PROPERTY, 
        {
            elementId: editorInstanceCode.value.elementId,
            elementProperty: editorInstanceCode.value.elementProperty,
            elementPropertyValue: editorValue
        }
    );
}

function updateScriptValue(editorValue) {
    EventBus.emit(EVENT_TYPE.UPDATE_SCRIPT_VALUE, editorValue);
}

</script>

<style scoped>
.code-editor {
    height: 50vh;
}
</style>