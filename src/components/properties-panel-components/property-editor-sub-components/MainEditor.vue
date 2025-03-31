<template>
    <div class="main-editor-container" data-testid="main-editor-container">
        <Card :title="cardProps.title" :subtitle="cardProps.subtitle" :text="cardProps.text">
            <template #content>
                <div v-if="model" class="main-editor-content" data-testid="main-editor-content">
                    <TextInput :label="inputLabel.assignee" v-model="mainProperties.assignee"/>
                    <TextInput :label="inputLabel.candidateUsers" v-model="mainProperties.candidateUsers"/>
                    <TextInput :label="inputLabel.candidateGroups" v-model="mainProperties.candidateGroups"/>
                    <TextInput :label="inputLabel.formKey" v-model="mainProperties.formKey"/>
                    <TextInput :label="inputLabel.dueDate" v-model="mainProperties.dueDate"/>
                    <TextInput :label="inputLabel.priority" v-model="mainProperties.priority"/>
                    <TextInput :label="inputLabel.category" v-model="mainProperties.category"/>
                    <TextInput :label="inputLabel.skipExpression" v-model="mainProperties.skipExpression"/>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';


import Card from '../../generic/Card.vue';
import TextInput from "../../generic/TextInput.vue";

const model = defineModel();
const mainProperties = ref(null);

const cardProps = {
    title: "Main",
    subtitle: "",
    text: ""
};

const inputLabel = {
    assignee: "Assignee",
    candidateUsers: "Candidate Users ( comma separated )",
    candidateGroups: "Candidate Groups ( comma separated )",
    formKey: "Form Key",
    dueDate: "Due Date ( variable )",
    priority: "Priority",
    category: "Category",
    skipExpression: "Skip Expression"
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