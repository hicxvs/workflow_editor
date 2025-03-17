<template>
    <div class="toolbar-container" data-testid="toolbar-container">
        <v-toolbar :elevation="1">
            <div class="toolbar-content">
                <v-toolbar-items>
                    <v-btn flat @click="buttonClickHandlers.loadDiagramFromFile">{{ buttonLabels.loadDiagramFromFile }}</v-btn>
                    <v-btn flat @click="buttonClickHandlers.loadDiagramFromSystem">{{ buttonLabels.loadDiagramFromSystem }}</v-btn>
                    <v-btn flat @click="buttonClickHandlers.saveDiagram">{{ buttonLabels.saveDiagram }}</v-btn>
                    <v-btn flat @click="buttonClickHandlers.logElements">{{ buttonLabels.logElements }}</v-btn>
                    <v-btn flat @click="buttonClickHandlers.gapAnalysis">{{ buttonLabels.gapAnalysis }}</v-btn>
                </v-toolbar-items>
                <div class="api-key-input-container" data-testid="api-key-input-container">
                    <v-text-field 
                        :label="apiKeyLabel"
                        density="compact"
                        variant="solo"
                        clearable
                        flat
                        hide-details
                        single-line
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

const buttonLabels = {
    loadDiagramFromFile: "Load Diagram from File",
    loadDiagramFromSystem: "Load Diagram from System",
    saveDiagram: "Save Diagram",
    logElements: "Log Elements",
    gapAnalysis: "Gap Analysis",
};

const apiKey = ref('');
const apiKeyLabel = "API KEY";

const buttonClickHandlers = {
    loadDiagramFromFile: () => {
        const fileTypes = ".bpmn,.xml";
        EventBus.emit(EVENT_TYPE.LOAD_FILE, fileTypes);
    },
    loadDiagramFromSystem: () => {
        EventBus.emit(EVENT_TYPE.LOAD_DIAGRAM_FROM_SYSTEM);
    },
    saveDiagram: () => {
        EventBus.emit(EVENT_TYPE.SAVE_DIAGRAM);
    },
    logElements: () => {
        console.log("Log Elements");
    },
    gapAnalysis: () => {
        console.log("Gap Analysis");
    }
};

function update() {    
    EventBus.emit(EVENT_TYPE.SET_API_KEY, apiKey.value);
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
    width: 100%;
}
</style>




