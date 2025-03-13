<template>
  <div class="general-properties-editor" data-testid="general-properties-editor">
    <Card :title="cardProps.title" :subtitle="cardProps.subtitle" :text="cardProps.text">
        <template #content>
            <div class="general-properties-editor-content" data-testid="general-properties-editor-content">
                <TextInput v-if="model" :label="inputLabel.id" v-model="model.id" />
                <TextInput v-if="model" :label="inputLabel.name" v-model="model.name" />
                <Checkbox v-if="model" :label="inputLabel.asynchronous" v-model="model.asynchronous" />
                <Checkbox v-if="model" :label="inputLabel.exclusive" v-model="model.exclusive" />
                <Select v-if="model?.taskType" :label="inputLabel.taskType" :items="model.taskType" />
            </div>
        </template>
    </Card> 
  </div>
</template>

<script setup>
import Card from "../../generic/Card.vue";
import TextInput from "../../generic/TextInput.vue";
import Checkbox from "../../generic/Checkbox.vue";
import Select from "../../generic/Select.vue";

const model = defineModel({
    id: {
        type: String,
        required: false,
        default: "" 
    },
    name: {
        type: String,
        required: false,
        default: ""
    },
    asynchronous: {
        type: Boolean,
        required: false,
        default: false
    },
    exclusive: {
        type: Boolean,
        required: false,
        default: false
    },
    taskType: {
        type: Array,
        required: false,
        default: ['Default task type item 1', 'Default task type item 2', 'Default task type item 3']
    }
});

//TODO: Handle taskType change

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

</script>

<style scoped>
.general-properties-editor-content {
    padding: 0 16px;
}

</style>
