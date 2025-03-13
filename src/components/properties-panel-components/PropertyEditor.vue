<template>
  <div class="property-editor-container" data-testid="property-editor-container">
    <Card :title="cardProps.title" :subtitle="cardProps.subtitle" :text="cardProps.text">
        <template #content>
            {{ model }}
        </template>
    </Card>
  </div>
</template>

<script setup>
import Card from "../generic/Card.vue";

const model = defineModel();

const cardProps = {
    title: "Property Editor",
    subtitle: "",
    text: "The Properties Panel provides detailed configuration options for BPMN elements. The panel updates automatically when you select an element in the diagram"
};

</script>

<style scoped>

</style>

