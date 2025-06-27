<template>
    <div class="toolbar-container" data-testid="toolbar-container">
        <v-toolbar :elevation="1">
            <div class="toolbar-content">
                <MenuButtonList :label="bpmnMenuGroup.label" :items="bpmnMenuGroup.items"/>
                <MenuButtonList v-if="showDraftMenuGroup" :label="draftMenuGroup.label" :items="draftMenuGroup.items"/>
                <MenuButtonList v-if="showAnalisisAndLogginMenuGroup" :label="analisesAndLoginMenuGroup.label" :items="analisesAndLoginMenuGroup.items"/>
                <div v-if="IS_APP_IN_MODE_DEV" class="api-key-input-container" data-testid="api-key-input-container">
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
import { ref, onMounted, onUnmounted } from 'vue';
import EventBus from "../../eventbus";
import { EVENT_TYPE } from "../../bpmn-workflow-editor/modeler/eventTypes";
import { IS_APP_IN_MODE_DEV } from '../../config';
import MenuButtonList from '../generic/MenuButtonList.vue';
import { CONFIRMATION_TYPE } from '../../bpmn-workflow-editor/modeler/confirmationTypes';

const apiKey = ref('');
const apiKeyLabel = "API KEY";
const showDraftMenuGroup = ref(false);
const showAnalisisAndLogginMenuGroup = ref(false);

const bpmnMenuGroup = ref({
    label: 'WORKFLOW MANAGEMENT',
    items: [
        {
            label: 'Create New',
            handler: () => {
                EventBus.emit(EVENT_TYPE.CREATE_NEW_DIAGRAM);
                EventBus.emit(EVENT_TYPE.HIDE_SYSTEM_DRAFT_OPTIONS);
                EventBus.emit(EVENT_TYPE.CANVAS_DESELECTED);
            }
        },
        {
            label: 'Load From System',
            handler: () => {
                EventBus.emit(EVENT_TYPE.LOAD_DIAGRAMS_FROM_SYSTEM);
                EventBus.emit(EVENT_TYPE.CANVAS_DESELECTED);           
            }
        },
        {
            label: 'Load From Local',
            handler: () => {
                const fileTypes = ".bpmn,.xml";
                EventBus.emit(EVENT_TYPE.LOAD_FILE, fileTypes);
                EventBus.emit(EVENT_TYPE.HIDE_SYSTEM_DRAFT_OPTIONS);
                EventBus.emit(EVENT_TYPE.CANVAS_DESELECTED);
            }
        },        
        {
            label: 'Deploy to system',
            disabled: true,
            handler: () => {
                EventBus.emit(EVENT_TYPE.SHOW_ACTION_CONFIRMATION, {
                    type: CONFIRMATION_TYPE.ADD,
                    title: 'Confirm Workflow Deployment',
                    message: 'Are you sure you want to deploy this workflow to the system?',
                    actionHandler: () => {
                        EventBus.emit(EVENT_TYPE.SAVE_DIAGRAM);
                        EventBus.emit(EVENT_TYPE.CANVAS_DESELECTED);
                    }
                });
            }
        },
        {
            label: 'Delete From System',
            disabled: true,
            handler: () => {
                EventBus.emit(EVENT_TYPE.SHOW_ACTION_CONFIRMATION, {
                    type: CONFIRMATION_TYPE.REMOVE,
                    title: 'Confirm Workflow Deletion',
                    message: 'Are you sure you want to permanently delete this workflow from the system?',
                    actionHandler: () => {
                        EventBus.emit(EVENT_TYPE.REMOVE_DIAGRAM);
                        EventBus.emit(EVENT_TYPE.CANVAS_DESELECTED);
                    }
                });
            }
        },
        {
            label: 'Download to Local',
            disabled: true,
            handler: () => {
                EventBus.emit(EVENT_TYPE.DOWNLOAD_DIAGRAM);
                EventBus.emit(EVENT_TYPE.CANVAS_DESELECTED);
            }
        }        
    ]
});

const draftMenuGroup = {
    label: 'DRAFT OPERATIONS',
    items: [
        {
            label: 'Save Draft to system',
            handler: () => {
                EventBus.emit(EVENT_TYPE.SAVE_DIAGRAM_DRAFT);
                EventBus.emit(EVENT_TYPE.CANVAS_DESELECTED);
            }
        },
        {
            label: 'Delete Draft from system',
            handler: () => {
                EventBus.emit(EVENT_TYPE.SHOW_ACTION_CONFIRMATION, {
                    type: CONFIRMATION_TYPE.REMOVE,
                    title: 'Confirm Draft Deletion',
                    message: 'Are you sure you want to delete this workflow draft from the system?',
                    actionHandler: () => {
                        EventBus.emit(EVENT_TYPE.DELETE_DIAGRAM_DRAFT);
                        EventBus.emit(EVENT_TYPE.HIDE_SYSTEM_DRAFT_OPTIONS);
                        EventBus.emit(EVENT_TYPE.CANVAS_DESELECTED);
                    }
                });
            }
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

onMounted(() => {
    EventBus.on(EVENT_TYPE.SHOW_SYSTEM_DRAFT_OPTIONS, () => {
        showDraftMenuGroup.value = true;
    });

    EventBus.on(EVENT_TYPE.HIDE_SYSTEM_DRAFT_OPTIONS, () => {
        showDraftMenuGroup.value = false;
    });

    addSaveAsIfSupported(bpmnMenuGroup.value.items, 'Save to Local as');

    EventBus.on(EVENT_TYPE.IMPORTED_DIAGRAM_READY, () => {
        bpmnMenuGroup.value.items.forEach(bpmnMenuGroupMenuItem => {
            if(bpmnMenuGroupMenuItem.disabled) {
                bpmnMenuGroupMenuItem.disabled = false;
            }
        });
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.SHOW_SYSTEM_DRAFT_OPTIONS);
    EventBus.off(EVENT_TYPE.HIDE_SYSTEM_DRAFT_OPTIONS);
    EventBus.off(EVENT_TYPE.IMPORTED_DIAGRAM_READY);
});

function addSaveAsIfSupported(itemsCollection, buttonLabel) {
    if ('showOpenFilePicker' in window) {
        itemsCollection.push({
        label: buttonLabel || 'Save as',
        disabled: true,
        handler: () => {

            EventBus.emit(EVENT_TYPE.GET_DIAGRAM_DATA);
            EventBus.on(EVENT_TYPE.DIAGRAM_DATA_READY, async (diagramData) => {

                const fileName = diagramData?.id || 'workflow_bpmn';
                const {xml} = diagramData?.xmlContent || '<xml></xml>';

                try {
                const options = {
                    suggestedName: `${fileName}.bpmn`,
                    types: [{
                        description: "XML Files",
                        accept: { "text/xml": [".xml", ".bpmn"] }
                    }]
                };

                const fileHandle = await window.showSaveFilePicker(options);
                const writable = await fileHandle.createWritable();

                await writable.write(xml);
                await writable.close();
                EventBus.off(EVENT_TYPE.DIAGRAM_DATA_READY);

                } catch (error) {
                    EventBus.off(EVENT_TYPE.DIAGRAM_DATA_READY);
                    throw error;
                }

            });
        }
    });
}
}

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




