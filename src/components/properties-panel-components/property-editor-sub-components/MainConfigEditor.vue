<template>
    <div class="main-config-editor">
        <Card :title="cardProps.title" :subtitle="cardProps.subtitle" :text="cardProps.text">            
            <template #content>
                <div class="main-config-editor-content">
                    <TextInput v-if="model" :label="inputLabel.assignee" :model="model.assignee" />
                    <TextInput v-if="model":label="inputLabel.candidateUsers" :model="model.candidateUsers" />
                    <TextInput v-if="model":label="inputLabel.candidateGroups" :model="model.candidateGroups" />
                    <TextInput v-if="model":label="inputLabel.formKey" :model="model.formKey" />
                    <TextInput v-if="model":label="inputLabel.dueDate" :model="model.dueDate" />
                    <TextInput v-if="model":label="inputLabel.priority" :model="model.priority" />
                    <TextInput v-if="model":label="inputLabel.category" :model="model.category" />         
                    <TextInput v-if="model":label="inputLabel.skipExpression" :model="model.skipExpression" />
                </div>
                
            </template>
        </Card>
    </div>
</template>

<script setup>
import Card from "../../generic/Card.vue";
import TextInput from "../../generic/TextInput.vue";

const model = defineModel({
    assignee: {
        type: String,
        required: false,
        default: ""
    },
    candidateUsers: {
        type: String,
        required: false,
        default: ""
    },
    candidateGroups: {
        type: String,
        required: false,
        default: ""
    },
    formKey: {
        type: String,
        required: false,
        default: ""
    },
    dueDate: {
        type: String,
        required: false,
        default: ""
    },
    category: {
        type: String,
        required: false,
        default: ""
    },
    skipExpression: {   
        type: String,
        required: false,
        default: ""
    }
});

const cardProps = {
    title: "Main Config",
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
</script>

<style scoped>
.main-config-editor-content {
    padding: 0 16px;
}
</style>