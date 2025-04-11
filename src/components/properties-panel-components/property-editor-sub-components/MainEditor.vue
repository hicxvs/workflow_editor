<template>
    <div class="main-editor-container" data-testid="main-editor-container">
        <Card :title="cardProps.title" :subtitle="cardProps.subtitle" :text="cardProps.text">
            <template #content>
                <div v-if="model" class="main-editor-content" data-testid="main-editor-content">                                        
                    <ScriptTaskPropertiesEditor v-if="model.$type === TASK_TYPES.SCRIPT_TASK" v-model="model" />
                    <UserTaskPropertiesEditor v-if="model.$type === TASK_TYPES.USER_TASK" v-model="model" />
                    <InitiatorPropertyEditor v-if="model.$type === EVENT_TYPES.START_EVENT" v-model="model" />
                    <FormKeyPropertyEditor v-if="model.$type === TASK_TYPES.USER_TASK || model.$type === EVENT_TYPES.START_EVENT" v-model="model" />
                    <ServiceTaskPropertiesEditor v-if="model.$type === TASK_TYPES.SERVICE_TASK" v-model="model" />
                    <SequenceFlowPropertyEditor v-if="model.$type === FLOW_TYPES.SEQUENCE_FLOW" v-model="model" />
                    <BoundaryEventPropertiesEditor v-if="model.$type === EVENT_TYPES.BOUNDARY_EVENT" v-model="model" />
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { EVENT_TYPES } from '../../../bpmn-workflow-editor/modeler/modelerTypes/eventTypes';
import { TASK_TYPES } from '../../../bpmn-workflow-editor/modeler/modelerTypes/taskTypes';
import { FLOW_TYPES } from '../../../bpmn-workflow-editor/modeler/modelerTypes/flowTypes';

import ScriptTaskPropertiesEditor from './main-editor-sub.components/ScriptTaskPropertiesEditor.vue';
import UserTaskPropertiesEditor from './main-editor-sub.components/UserTaskPropertiesEditor.vue';
import FormKeyPropertyEditor from './main-editor-sub.components/FormKeyPropertyEditor.vue';
import InitiatorPropertyEditor from './main-editor-sub.components/InitiatorPropertyEditor.vue';
import ServiceTaskPropertiesEditor from './main-editor-sub.components/ServiceTaskPropertiesEditor.vue';
import SequenceFlowPropertyEditor from './main-editor-sub.components/SequenceFlowPropertyEditor.vue';
import BoundaryEventPropertiesEditor from './main-editor-sub.components/BoundaryEventPropertiesEditor.vue';

import Card from '../../generic/Card.vue';

const model = defineModel();
const mainProperties = ref(null);

const cardProps = {
    title: "Main",
    subtitle: "",
    text: ""
};

watch(
  () => model, 
  () => {
    mainProperties.value = model.value;
  },
  { immediate: true, deep: true }
);

</script>

<style scoped>
.main-editor-content {
    padding: 0 16px;
}
</style>