<template>
    <div class="documentation-editor" data-testid="documentation-editor">
        <Card :title="cardProps.title" :subtitle="cardProps.subtitle" :text="cardProps.text">
            <template #content>
                <div v-if="model"class="documentation-editor-content" data-testid="documentation-editor-content">
                    <TextArea :label="inputLabel.documentation" v-model="documentationProperties.documentation" />
                </div>
            </template>
        </Card>
    </div>
</template> 

<script setup>
import { ref, watch } from 'vue';
import { EVENT_TYPE } from '../../../bpmn-workflow-editor/modeler/eventTypes';
import EventBus from '../../../eventbus';

import Card from "../../generic/Card.vue";
import TextArea from "../../generic/TextArea.vue";

const model = defineModel();
const documentationProperties = ref(null);

const cardProps = {
    title: "Documentation",
    subtitle: "",
    text: ""
};

const inputLabel = {
    documentation: "Documentation"
};

watch(
  () => model, 
  () => {
    documentationProperties.value = model.value?.documentation || '';
  },
  { deep: true }
);
</script>

<style scoped>
.documentation-editor-content {
    padding: 0 16px;
}
</style>