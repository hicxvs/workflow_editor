<template>
  <div class="property-editor-container" data-testid="property-editor-container">
    <Card :title="cardProps.title" :subtitle="cardProps.subtitle" :text="cardProps.text">
        <template #content>
          <div class="property-editor-content" data-testid="property-editor-content">
            <v-expansion-panels v-model="panel">
              <GeneralEditor v-model="model"/>
              <MainEditor v-model="model" />
              <DocumentationEditor v-model="model" />
              <FormEditor v-if="showFormPanel" v-model="model" />
              <ListenersEditor v-model="model" />
              <MultiInstanceEditor v-model="model" />
              <OutputPanel v-model="model" />              
            </v-expansion-panels>
          </div>
        </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { TASK_TYPES } from '../../bpmn-workflow-editor/modeler/modelerTypes/taskTypes';
import { ACTIVITY_TYPES } from '../../bpmn-workflow-editor/modeler/modelerTypes/activityTypes';
import Card from "../generic/Card.vue";
import GeneralEditor from "./property-editor-sub-components/GeneralEditor.vue";
import MainEditor from "./property-editor-sub-components/MainEditor.vue";
import DocumentationEditor from "./property-editor-sub-components/DocumentationEditor.vue";
import FormEditor from "./property-editor-sub-components/FormEditor.vue";
import ListenersEditor from "./property-editor-sub-components/ListenersEditor.vue";
import MultiInstanceEditor from "./property-editor-sub-components/MultiInstanceEditor.vue";
import OutputPanel from "./property-editor-sub-components/OutputPanel.vue";

const model = defineModel();
const panel = ref(null);
const activePanel = ref(null);
const showFormPanel = ref(false);

const cardProps = {
    title: "Property Editor",
    subtitle: "",
    text: "The Properties Panel provides detailed configuration options for BPMN elements. The panel updates automatically when you select an element in the diagram."
};

function toggleRequestedPanel(elementType) {

  const elementAndPanelIndexMapping = {
    [TASK_TYPES.SERVICE_TASK]: {
      panelIndex: 1
    },
    [TASK_TYPES.SCRIPT_TASK]: {
      panelIndex: 1
    },
    [TASK_TYPES.USER_TASK]: {
      panelIndex: 4
    },
    [ACTIVITY_TYPES.CALL_ACTIVITY]: {
      panelIndex: 1
    },
  };

  const selected = elementAndPanelIndexMapping[elementType] || null;

  if(!selected) {
    return;
  }

  activePanel.value = elementType;
  panel.value = selected.panelIndex;
}

watch(
  () => model, 
  () => {
    if(!model.value) {
      return;
    }

    showFormPanel.value = (model.value?.$type === TASK_TYPES.USER_TASK);

    if(model.value?.$type && ( activePanel.value !== model.value?.$type)) {
      toggleRequestedPanel(model.value?.$type);
    }
  },
  { immediate: true, deep: true }
);
</script>

<style scoped>
.property-editor-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 70vh;
  overflow-y: auto;
}
</style>