<template>
    <div class="toolbar-container" data-testid="toolbar-container">
        <v-toolbar :elevation="1">
            <div class="toolbar-content">
                <MenuButtonList :label="bpmnMenuGroup.label" :items="bpmnMenuGroup.items"/>
                <MenuButtonList v-if="showDraftMenuGroup" :label="draftMenuGroup.label" :items="draftMenuGroup.items"/>
                <MenuButtonList v-if="showAnalisisAndLogginMenuGroup" :label="analisesAndLoginMenuGroup.label" :items="analisesAndLoginMenuGroup.items"/>
                
                <div class="api-key-input-container" data-testid="api-key-input-container">
                    <v-text-field 
                        :label="apiKeyLabel"
                        density="compact"
                        variant="solo"
                        clearable
                        flat
                        hide-details
                        single-line
                        type="password"
                        v-model="apiKey" 
                        @update:modelValue="update"
                        class="api-key-input"
                    ></v-text-field>
                </div>
            </div>
        </v-toolbar>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import EventBus from "../../eventbus";
import { EVENT_TYPE } from "../../bpmn-workflow-editor/modeler/eventTypes";
import MenuButtonList from '../generic/MenuButtonList.vue';

const apiKey = ref('');
const apiKeyLabel = "API KEY";
const showDraftMenuGroup = ref(false);
const showAnalisisAndLogginMenuGroup = ref(false);

const bpmnMenuGroup = {
    label: 'BPMN MANAGEMENT',
    items: [
        {
            label: 'Create New BPMN',
            handler: () => EventBus.emit(EVENT_TYPE.CREATE_NEW_DIAGRAM)
        },
        {
            label: 'Load BPMN From System',
            handler: () => EventBus.emit(EVENT_TYPE.LOAD_DIAGRAMS_FROM_SYSTEM)
        },
        {
            label: 'Load BPMN From File',
            handler: () => {
                const fileTypes = ".bpmn,.xml";
                EventBus.emit(EVENT_TYPE.LOAD_FILE, fileTypes);
            }
        },
        {
            label: 'Deploy workflow/BPMN',
            handler: () => EventBus.emit(EVENT_TYPE.SAVE_DIAGRAM) 
        },
        {
            label: 'Download workflow/BPMN',
            handler: () => EventBus.emit(EVENT_TYPE.DOWNLOAD_DIAGRAM)
        }
    ]
};

const draftMenuGroup = {
    label: 'DRAFT OPERATIONS',
    items: [
        {
            label: 'Save draft workflow/BPMN',
            handler: () => EventBus.emit(EVENT_TYPE.SAVE_DIAGRAM_DRAFT)
        },
        {
            label: 'Delete draft workflow/BPMN',
            handler: () => EventBus.emit(EVENT_TYPE.DELETE_DIAGRAM_DRAFT)
        },
    ]
};

const analisesAndLoginMenuGroup = {
    label: 'ANALYSIS & LOGGING',
    items: [
        {
            label: 'Log elements',
            handler: () => {} 
        },
        {
            label: 'Gap analysis',
            handler: () => {}
        }    
    ]
};

function update() {    
    EventBus.emit(EVENT_TYPE.SET_API_KEY, apiKey.value);
}

EventBus.on(EVENT_TYPE.API_KEY_LOADED, (loadedApiKey) => {
    apiKey.value = loadedApiKey;
});

</script>

<style scoped>
.toolbar-content {
    display: flex;
    align-items: center;
    justify-content: flex-start; 
    width: 100%;
}

.api-key-input-container {
    margin-left: 16px;
    width: 20%;
}
</style>




