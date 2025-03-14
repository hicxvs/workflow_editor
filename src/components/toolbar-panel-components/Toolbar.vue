<template>
    <div class="toolbar-container" data-testid="toolbar-container">
        <v-toolbar :elevation="1">
            <v-toolbar-items>
                <v-btn flat @click="buttonClickHandlers.loadDiagramFromFile">{{ buttonLabels.loadDiagramFromFile }}</v-btn>
                <v-btn flat @click="buttonClickHandlers.loadDiagramFromSystem">{{ buttonLabels.loadDiagramFromSystem }}</v-btn>
                <v-btn flat @click="buttonClickHandlers.saveDiagram">{{ buttonLabels.saveDiagram }}</v-btn>
                <v-btn flat @click="buttonClickHandlers.logElements">{{ buttonLabels.logElements }}</v-btn>
                <v-btn flat @click="buttonClickHandlers.gapAnalysis">{{ buttonLabels.gapAnalysis }}</v-btn>
            </v-toolbar-items>
        </v-toolbar>
    </div>
</template>

<script setup>
import EventBus from "../../eventbus";
import { FILE_INPUT_EVENT_TYPE } from "../singleton-components/file-input-component/file-input-event-type";

const buttonLabels = {
    loadDiagramFromFile: "Load Diagram from File",
    loadDiagramFromSystem: "Load Diagram from System",
    saveDiagram: "Save Diagram",
    logElements: "Log Elements",
    gapAnalysis: "Gap Analysis",
};

const buttonClickHandlers = {
    loadDiagramFromFile: () => {
        const fileTypes = ".bpmn,.xml";
        EventBus.emit(FILE_INPUT_EVENT_TYPE.LOAD_FILE, fileTypes);
    },
    loadDiagramFromSystem: () => {
        console.log("Load Diagram from System");
    },
    saveDiagram: () => {
        console.log("Save Diagram");
    },
    logElements: () => {
        console.log("Log Elements");
    },
    gapAnalysis: () => {
        console.log("Gap Analysis");
    }
};

</script>

<style scoped>
</style>




