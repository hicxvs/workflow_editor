<template>
    <div class="output-panel-container" data-testid="output-panel-container">
        <Card :title="cardProps.title" :subtitle="cardProps.subtitle" :text="cardProps.text">
            <template #content>
                <div class="output-panel-content" data-testid="output-panel-content">
                    <pre v-if="model" class="formatted-pre">
                        {{ xmlDiagramContent }}
                    </pre>                    
                </div>                
            </template>
        </Card>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { EVENT_TYPE } from '../../../bpmn-workflow-editor/modeler/eventTypes';
import EventBus from '../../../eventbus';

import Card from '../../generic/Card.vue';

const model = defineModel();
const xmlDiagramContent = ref(null);

const cardProps = {
    title: "Output",
    subtitle: "",
    text: ""
};

onMounted(() => {
    EventBus.on(EVENT_TYPE.GENERATED_XML_DIAGRAM_READY, (xmlContent) => {
        xmlDiagramContent.value = xmlContent;
    });

    EventBus.on(EVENT_TYPE.CLEAR_GENERATED_XML_DIAGRAM, () => {
        xmlDiagramContent.value = null;
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.GENERATED_XML_DIAGRAM_READY);
    EventBus.off(EVENT_TYPE.CLEAR_GENERATED_XML_DIAGRAM);
});


</script>


<style scoped>
.output-panel-content {
    padding: 0 16px;

}

.formatted-pre {
    font-family: Consolas, Monaco, "Courier New", monospace;
    white-space: pre-wrap;
    word-wrap: break-word; 
    overflow-x: auto; 
    max-height: 400px; 
    overflow-y: auto; 
    background-color: #f9f9f9;
    padding: 16px; 
    margin-bottom: 16px; 
    border: 1px solid #ddd; 
    border-radius: 4px; 
}
</style>