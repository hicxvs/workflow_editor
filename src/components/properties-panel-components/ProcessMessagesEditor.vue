<template>
    <div  class="process-messages-editor-container" data-testid="process-messages-editor-container">
        <Card :title="cardProps.title" :subtitle="cardProps.subtitle" :text="cardProps.text">
            <template #content>
                <div class="process-messages-editor-content" data-testid="process-messages-editor-content">
                    <v-expansion-panels>
                        <MessageEditor v-model="model.diagramMessages" />
                        <ErrorMessageEditor v-model="model.diagramErrorMessages" />
                    </v-expansion-panels>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
import Card from "../generic/Card.vue";
import MessageEditor from './process-messages-sub-components/MessageEditor.vue';
import ErrorMessageEditor from './process-messages-sub-components/ErrorMessageEditor.vue';

const model = defineModel();

const cardProps = {
    title: "Process Messages Editor",
    subtitle: "",
    text: "The Process Messages Editor provides an intuitive interface for managing and configuring BPMN message elements within your diagram. Message elements are standalone components that facilitate communication between events and tasks."
};
</script>

<style scoped>
.process-messages-editor-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 70vh;
  overflow-y: auto;
}
</style>