<template>
    <v-expansion-panel>
        <v-expansion-panel-title>
            <h3>{{ panelTitle }}</h3>            
        </v-expansion-panel-title>
        <v-expansion-panel-text>
            <div v-if="model" class="documentation-editor-content" data-testid="documentation-editor-content">
                <TextArea :label="inputLabel.documentation" v-model="documentationText" @input="updateDocumentation" :clearHandler="updateDocumentation"/>
            </div>
        </v-expansion-panel-text>
    </v-expansion-panel>
</template> 

<script setup>
import { ref, watch } from 'vue';
import { createParagraphs } from '../../../bpmn-workflow-editor/utils/create-paragraphs';
import { EVENT_TYPE } from '../../../bpmn-workflow-editor/modeler/eventTypes';
import EventBus from '../../../eventbus';
import TextArea from "../../generic/TextArea.vue";

const model = defineModel();
const documentationText = ref(null);

const panelTitle = 'Documentation';

const inputLabel = {
    documentation: "Documentation"
};

const fieldKeys = {
    documentation: 'documentation'
};

watch(
  () => model, 
  () => {

    if(!model.value?.documentation) {
        documentationText.value = '';
        return;
    }

    documentationText.value = createParagraphs(model.value?.documentation);
  },
  { immediate: true, deep: true }
);

function updateDocumentation() { 
    EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT_DOCUMENTATION, 
        {
            elementId: model.value?.id,
            elementProperty: fieldKeys.documentation,
            elementPropertyValue: documentationText.value
        }
    );
}
</script>

<style scoped>
.documentation-editor-content {
    padding: 0 16px;
}
</style>