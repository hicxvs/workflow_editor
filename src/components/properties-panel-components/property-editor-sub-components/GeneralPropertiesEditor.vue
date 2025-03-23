<template>
  <div class="general-properties-editor" data-testid="general-properties-editor">
    <Card :title="cardProps.title" :subtitle="cardProps.subtitle" :text="cardProps.text">
        <template #content>
            <div class="general-properties-editor-content" data-testid="general-properties-editor-content">
                <TextInput v-if="model" :label="inputLabel.id" v-model="model.id" />
                <TextInput v-if="model" :label="inputLabel.name" v-model="model.name" />
                <Checkbox v-if="model" :label="inputLabel.asynchronous" v-model="model.async" />
                <Checkbox v-if="model" :label="inputLabel.exclusive" v-model="model.$parent.exclusive" />
                <Select v-if="selectedTaskType" :label="inputLabel.taskType" v-model="selectedTaskType" :selectOptionItems="taskTypes"/>
                <Select v-if="selectedGatewayType" :label="inputLabel.gatewayType" v-model="selectedGatewayType" :selectOptionItems="gatewayTypes"/>
            </div>
        </template>
    </Card> 
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, watch} from "vue";
import Card from "../../generic/Card.vue";
import TextInput from "../../generic/TextInput.vue";
import Checkbox from "../../generic/Checkbox.vue";
import Select from "../../generic/Select.vue";
import Eventbus from "../../../eventbus";
import { EVENT_TYPE } from "../../../bpmn-workflow-editor/modeler/eventTypes";

const model = defineModel();
const taskTypes = ref(null);
const gatewayTypes = ref(null);
const selectedTaskType = ref(null);
const selectedGatewayType = ref(null);

const cardProps = {
    title: "Properties",
    subtitle: "",
    text: ""
};

const inputLabel = {
    id: "ID",
    name: "Name",
    asynchronous: "Asynchronous",
    exclusive: "Exclusive",
    taskType: "Task Type",
    gatewayType: 'Gateway Type'
};

function processTypes(types, targetRef, customLabelTransform) {
    if (Object.keys(types).length === 0) {
        targetRef.value = null;
        return;
    }

    targetRef.value = Object.entries(types).map(([key, value]) => ({
        value: value,
        label: transformLabel(key, customLabelTransform),
    }));
}

function transformLabel(key, customTransform = null) {
    let label = key
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/^\w/, c => c.toUpperCase());
    
    if (customTransform) {
        label = customTransform(label);
    }
    
    return label;
}

function updateSelectedType(modelValue, types, selectedType, typeCheck) {
    if (!modelValue || !modelValue.$type?.toLowerCase()?.includes(typeCheck) || !types.value) {
        selectedType.value = null;
        return;
    }

    const tempSelectedType = types.value.find(type => 
        type.value.toLowerCase() === modelValue.$type.toLowerCase()
    );

    selectedType.value = tempSelectedType ? tempSelectedType.label : null;
}

onMounted(() => {
    Eventbus.on(EVENT_TYPE.TASK_TYPES_READY, (types) => {
        processTypes(types, taskTypes, (label) =>
            label
                .replace("Business rule task", "Business Rule Task")
                .replace("User task", "User Task")
        );

    });
    Eventbus.on(EVENT_TYPE.GATEWAY_TYPES_READY, (types) => {
        processTypes(types, gatewayTypes);
    });
});

onUnmounted(() => {
    Eventbus.off(EVENT_TYPE.TASK_TYPES_READY);
    Eventbus.off(EVENT_TYPE.GATEWAY_TYPES_READY);
});

watch(
  () => model, 
  () => {

    debugger;

    updateSelectedType(model.value, taskTypes, selectedTaskType, 'task');
    updateSelectedType(model.value, gatewayTypes, selectedGatewayType, 'gateway');
  },
  { deep: true }
);


</script>

<style scoped>
.general-properties-editor-content {
    padding: 0 16px;
}

</style>
