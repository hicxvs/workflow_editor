<template>
    <div class="code-editor-container" data-testid="code-editor-container">
        <Modal
            :showCloseButton = "showButton"
            :showSaveButton = "!showButton"
            :showCancelButton = "!showButton"
            :saveButtonClickHandler = "save"
            :cancelButtonClickHandler = "cancel"
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

function save() {

}

function cancel() {
    showModal.value = false;
}

onMounted(() => {
    EventBus.on(EVENT_TYPE.LOAD_CODE_SCRIPT, codeSettings => {
        editorInstanceCode.value = {
            code: codeSettings.codeScript || '',
            language: codeSettings.codeLanguage || 'java'            
        };

        modalTitle.value = codeSettings?.codeScriptId ? `Script Content - ${codeSettings.codeScriptId}` : 'Script Content';

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
            editorInstance.value = null;
            editorInstanceCode.value = null;
            modalTitle.value = '';
            return;
        }

        editorInstance.value = editorEngine.createCodeEditor(editorCanvas.value, editorInstanceCode.value.language, editorInstanceCode.value.code);        
    },
    { deep:true }
);



</script>

<style scoped>
.code-editor {
    height: 50vh;
}
</style>