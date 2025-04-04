<template>
    <div class="main-editor-container" data-testid="main-editor-container">
        <Card :title="cardProps.title" :subtitle="cardProps.subtitle" :text="cardProps.text">
            <template #content>
                <div v-if="model" class="main-editor-content" data-testid="main-editor-content">                                        
                    <ScriptTaskPropertiesEditor v-if="model.$type === elementType.scriptTask" v-model="model" />
                    <UserTaskPropertiesEditor v-if="model.$type === elementType.userTask" v-model="model" />
                    <InitiatorPropertyEditor v-if="model.$type === elementType.startEvent" v-model="model" />
                    <FormKeyPropertyEditor v-if="model.$type === elementType.userTask || model.$type === elementType.startEvent" v-model="model" />
                    <ServiceTaskPropertiesEditor v-if="model.$type === elementType.serviceTask" v-model="model" />
                    <SequenceFlowPropertyEditor v-if="model.$type === elementType.sequenceFlow" v-model="model" />
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

import ScriptTaskPropertiesEditor from './main-editor-sub.components/ScriptTaskPropertiesEditor.vue';
import UserTaskPropertiesEditor from './main-editor-sub.components/UserTaskPropertiesEditor.vue';
import FormKeyPropertyEditor from './main-editor-sub.components/FormKeyPropertyEditor.vue';
import InitiatorPropertyEditor from './main-editor-sub.components/InitiatorPropertyEditor.vue';
import ServiceTaskPropertiesEditor from './main-editor-sub.components/ServiceTaskPropertiesEditor.vue';
import SequenceFlowPropertyEditor from './main-editor-sub.components/SequenceFlowPropertyEditor.vue';

import Card from '../../generic/Card.vue';

const model = defineModel();
const mainProperties = ref(null);

const cardProps = {
    title: "Main",
    subtitle: "",
    text: ""
};

const elementType = {
    scriptTask:'bpmn:ScriptTask',
    userTask: 'bpmn:UserTask',
    serviceTask: 'bpmn:ServiceTask',
    startEvent: 'bpmn:StartEvent',
    sequenceFlow: 'bpmn:SequenceFlow',
};

watch(
  () => model, 
  () => {
    mainProperties.value = model.value;
  },
  { deep: true }
);

</script>

<style scoped>
.main-editor-content {
    padding: 0 16px;
}
</style>