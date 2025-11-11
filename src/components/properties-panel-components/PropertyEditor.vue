<template>
  <div class="property-editor-container" data-testid="property-editor-container">
    <Card :title="cardProps.title" :subtitle="cardProps.subtitle" :text="cardProps.text">
        <template #content>
          <div class="property-editor-content" data-testid="property-editor-content">
            <v-expansion-panels v-model="panel">
              <GeneralEditor v-model="model"/>
              <MainEditor v-if="showMainConfig" v-model="model" />
              <DocumentationEditor v-model="model" />
              <FormEditor v-if="showFormPanel" v-model="model" />
              <ListenersEditor v-model="model" />
              <MultiInstanceEditor v-if="showMultiInstancePanel" v-model="model" />
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
import { EVENT_TYPES } from '../../bpmn-workflow-editor/modeler/modelerTypes/eventTypes';
import { GATEWAY_TYPES } from '../../bpmn-workflow-editor/modeler/modelerTypes/gatewayTypes';
import { ACTIVITY_TYPES } from '../../bpmn-workflow-editor/modeler/modelerTypes/activityTypes';
import { FLOW_TYPES } from '../../bpmn-workflow-editor/modeler/modelerTypes/flowTypes';
import { PROCESS_TYPES } from '../../bpmn-workflow-editor/modeler/modelerTypes/processTypes';
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
const showMultiInstancePanel = ref(false);
const showMainConfig = ref(false);

const cardProps = {
    title: "Property Editor",
    subtitle: "",
    text: "The Properties Panel provides detailed configuration options for BPMN elements. The panel updates automatically when you select an element in the diagram."
};

function expandSelectedElementDefaultPanel(elementType) {

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

function togglePanelsVisibility(selectedType) {
  const formPanelIncludedTypes = [TASK_TYPES.USER_TASK, EVENT_TYPES.START_EVENT];

  const sharedExcludedTypes = [
    EVENT_TYPES.START_EVENT,
    EVENT_TYPES.END_EVENT,
    GATEWAY_TYPES.EXCLUSIVE_GATEWAY,
    GATEWAY_TYPES.INCLUSIVE_GATEWAY,
    GATEWAY_TYPES.PARALLEL_GATEWAY,
  ];

  const multiInstanceExcludedTypes = [...sharedExcludedTypes, FLOW_TYPES.SEQUENCE_FLOW];
  const mainConfigExcludedTypes = [...sharedExcludedTypes, PROCESS_TYPES.SUB_PROCESS];

  showFormPanel.value = formPanelIncludedTypes.includes(selectedType);
  showMultiInstancePanel.value = !multiInstanceExcludedTypes.includes(selectedType);
  showMainConfig.value = !mainConfigExcludedTypes.includes(selectedType);
}

watch(
  () => model, 
  () => {
    if(!model.value) {
      return;
    }

    togglePanelsVisibility(model.value?.$type);
    
    if(model.value?.$type && ( activePanel.value !== model.value?.$type)) {
      expandSelectedElementDefaultPanel(model.value?.$type);
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