<template>
  <div class="property-editor-container" data-testid="property-editor-container">
    <Card :title="cardProps.title" :subtitle="cardProps.subtitle" :text="cardProps.text">
        <template #content>
          <div class="property-editor-content" data-testid="property-editor-content">
            <GeneralPropertiesEditor v-model="model"/>
            <MainConfigEditor v-model="model" />
            <DocumentationEditor v-model="model" />
            <FormEditor v-model="model" />
            <ListenersEditor v-model="model" />
          </div>
        </template>
    </Card>
  </div>
</template>

<script setup>
import Card from "../generic/Card.vue";
import GeneralPropertiesEditor from "./property-editor-sub-components/GeneralPropertiesEditor.vue";
import MainConfigEditor from "./property-editor-sub-components/MainConfigEditor.vue";
import DocumentationEditor from "./property-editor-sub-components/DocumentationEditor.vue";
import FormEditor from "./property-editor-sub-components/FormEditor.vue";
import ListenersEditor from "./property-editor-sub-components/ListenersEditor.vue";

const model = defineModel();

const cardProps = {
    title: "Property Editor",
    subtitle: "",
    text: "The Properties Panel provides detailed configuration options for BPMN elements. The panel updates automatically when you select an element in the diagram"
};

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

