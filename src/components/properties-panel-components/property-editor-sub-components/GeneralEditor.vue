<template>
    <v-expansion-panel>
        <v-expansion-panel-title>
            <h3>{{ panelTitle }}</h3>            
        </v-expansion-panel-title>
        <v-expansion-panel-text>
            <div v-if="generalProperties" class="general-editor-content" data-testid="general-editor-content">
                <h4 class="properties-label">{{ propertiesLabel }} {{ generalType }}</h4>
                <TextInput :label="inputLabel.id" v-model="generalProperties.id" />
                <TextInput :label="inputLabel.name" v-model="generalProperties.name" @input="updateElementName" :clearHandler="updateElementName"/>
                <Checkbox :label="inputLabel.asynchronous" v-model="generalProperties.async" />
                <Checkbox :label="inputLabel.exclusive" v-model="generalProperties.$parent.exclusive" />
                <Select v-if="generalType === TASK_TYPES.SERVICE_TASK" :label="inputLabel.taskType" v-model="selectedTaskType" :selectOptionItems="taskTypes" :selectItemClickHandler="updateTaskType" />
                <Select v-if="isGatewayType(generalType)" :label="inputLabel.gatewayType" v-model="selectedGatewayType" :selectOptionItems="gatewayTypes" :selectItemClickHandler="updateGatewayType"/>
            </div>          
        </v-expansion-panel-text>
    </v-expansion-panel>    
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { TASK_TYPES } from '../../../bpmn-workflow-editor/modeler/modelerTypes/taskTypes';
import { GATEWAY_TYPES } from '../../../bpmn-workflow-editor/modeler/modelerTypes/gatewayTypes';
import EventBus from "../../../eventbus";
import { EVENT_TYPE } from "../../../bpmn-workflow-editor/modeler/eventTypes";

import TextInput from "../../generic/TextInput.vue";
import Checkbox from "../../generic/Checkbox.vue";
import Select from "../../generic/Select.vue";

const model = defineModel();
const generalType = ref(null);
const generalProperties = ref(null);
const taskTypes = ref(null);
const gatewayTypes = ref(null);
const selectedTaskType = ref(null);
const selectedGatewayType = ref(null);

const panelTitle = 'General';

const propertiesLabel = 'Properties: ';

const inputLabel = {
    id: "ID",
    name: "Name",
    asynchronous: "Asynchronous",
    exclusive: "Exclusive",
    taskType: "Task Type",
    gatewayType: 'Gateway Type'
};

const fieldKeys = {
    name: 'name',
    type: 'type'
};

function updateElementName() {
    EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT_PROPERTY, 
        {
            elementId: model.value?.id,
            elementProperty: fieldKeys.name,
            elementPropertyValue: generalProperties.value.name
        }
    );
}

function setSelectedType(modelValue, types, selectedType, typeCheck) {
    if (!modelValue || !modelValue.$type?.toLowerCase()?.includes(typeCheck) || !types.value) {
        selectedType.value = null;
        return;
    }

    const tempSelectedType = types.value.find(type => 
        type.value.toLowerCase() === modelValue.$type.toLowerCase()
    );

    selectedType.value = tempSelectedType ? tempSelectedType.label : null;
}

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

function updateTaskType() {
    if(!selectedTaskType.value) {
        return;
    }

    const taskType = taskTypes.value.find(task => task.label === selectedTaskType.value).value;

    EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT_TYPE, {
        elementId: generalProperties.value.id,
        elementType: taskType,
        elementField: fieldKeys.type
    });
}

function updateGatewayType() {
    if(!selectedGatewayType.value) {
        return;
    }

    const gatewayType = gatewayTypes.value.find(gateway => gateway.label === selectedGatewayType.value).value;

    EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT_TYPE, {
        elementId: generalProperties.value.id,
        elementType: gatewayType,
        elementField: fieldKeys.type
    });
}

function isGatewayType(generalType) {
    return Object.values(GATEWAY_TYPES).includes(generalType);
}

onMounted(() => {
    EventBus.on(EVENT_TYPE.TASK_TYPES_READY, (types) => {
        processTypes(types, taskTypes, (label) =>
            label
                .replace("Business rule task", "Business Rule Task")
                .replace("User task", "User Task")
        );

    });
    EventBus.on(EVENT_TYPE.GATEWAY_TYPES_READY, (types) => {
        processTypes(types, gatewayTypes);
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.TASK_TYPES_READY);
    EventBus.off(EVENT_TYPE.GATEWAY_TYPES_READY);
});

watch(
  () => model, 
  () => {
    generalProperties.value = model.value;
    generalType.value = model.value?.$type || '';
    setSelectedType(generalProperties.value, taskTypes, selectedTaskType, 'task');
    setSelectedType(generalProperties.value, gatewayTypes, selectedGatewayType, 'gateway');
  },
  { immediate:true, deep: true }
);

</script>

<style scoped>
.general-editor-content {
    padding: 0 16px;
}

.properties-label {
    font-weight: 500;
    padding-bottom: 16px;
}
</style>