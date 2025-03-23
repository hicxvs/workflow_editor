<template>
  <div class="general-properties-editor" data-testid="general-properties-editor">
    <Card :title="cardProps.title" :subtitle="cardProps.subtitle" :text="cardProps.text">
        <template #content>

            {{ model }}

            <div class="general-properties-editor-content" data-testid="general-properties-editor-content">
                <TextInput v-if="model" :label="inputLabel.id" v-model="model.id" />
                <TextInput v-if="model" :label="inputLabel.name" v-model="model.name" />
                <Checkbox v-if="model" :label="inputLabel.asynchronous" v-model="model.asynchronous" />
                <Checkbox v-if="model" :label="inputLabel.exclusive" v-model="model.exclusive" />
                <Select v-if="model" :label="inputLabel.taskType" v-model="selectedTaskType" :selectOptionItems="taskTypes"/>
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
const selectedTaskType = ref(null);

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
    taskType: "Task Type"
};


onMounted(() => {
    Eventbus.on(EVENT_TYPE.TASK_TYPES_READY, processTaskTypes);
});

onUnmounted(() => {
    Eventbus.off(EVENT_TYPE.TASK_TYPES_READY);
});

function processTaskTypes(types) {
    if(Object.keys(types).length === 0) {
        taskTypes.value = null;
        return;
    }

    taskTypes.value = Object.entries(types).map(([key, value]) => ({
        value: value,
        label: key
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/^\w/, c => c.toUpperCase())
            .replace("Business rule task", "Business Rule Task")
            .replace("User task", "User Task") 
    }));
}

watch(
  () => model, 
  () => {
    
    debugger;
  },
  { deep: true }
);


</script>

<style scoped>
.general-properties-editor-content {
    padding: 0 16px;
}

</style>
