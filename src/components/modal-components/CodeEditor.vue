<template>
    <div class="code-editor-container" data-testid="code-editor-container">
        <Modal
            :showCloseButton = "showButton"
            :showSaveButton = "canEditScript"
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

const canEditScript = ref(false);

onMounted(() => {
    EventBus.on(EVENT_TYPE.LOAD_CODE_SCRIPT, codeSettings => {
        editorInstanceCode.value = {
            code: codeSettings.codeScript || '',
            language: codeSettings.codeLanguage || 'java',
            readOnly: codeSettings.readOnly,
            elementId: codeSettings.elementId || null,
            elementProperty: codeSettings.elementProperty || null            
        };

        modalTitle.value = codeSettings?.codeScriptId ? `Script Content - ${codeSettings.codeScriptId}` : 'Script Content';
        canEditScript.value = !codeSettings.readOnly;
        showModal.value = true;
    });    
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.LOAD_CODE_SCRIPT);  
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
    canEditScript.value = false;
    modalTitle.value = '';
}

function save() {
    const editorValue = editorEngine.getValue();


    
    EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT_PROPERTY, 
        {
            elementId: editorInstanceCode.value.elementId,
            elementProperty: editorInstanceCode.value.elementProperty,
            elementPropertyValue: editorValue
        }
    );

    EventBus.emit(EVENT_TYPE.UPDATE_SCRIPT_VALUE, editorValue);
    showModal.value = false;
}


</script>

<style scoped>
.code-editor {
    height: 50vh;
}
</style>