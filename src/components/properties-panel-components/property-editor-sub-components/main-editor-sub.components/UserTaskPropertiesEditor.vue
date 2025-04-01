<template>
    <div class="user-task-properties-editor-container" data-testid="user-task-properties-editor-container">
        <TextInput :label="inputTaskPropertiesLabels.assignee" v-model="assignee" @input="updateAssignee" :clearHandler="updateAssignee"/>
        <TextInput :label="inputTaskPropertiesLabels.candidateUsers" v-model="candidateUsers" @input="updateCandidateUsers" :clearHandler="updateCandidateUsers"/>
        <TextInput :label="inputTaskPropertiesLabels.candidateGroups" v-model="candidateGroups" @input="updateCandidateGroups" :clearHandler="updateCandidateGroups"/>
        <TextInput :label="inputTaskPropertiesLabels.dueDate" v-model="dueDate" @input="updateDueDate" :clearHandler="updateDueDate"/>
        <TextInput :label="inputTaskPropertiesLabels.priority" v-model="priority" @input="updatePriority" :clearHandler="updatePriority"/>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

import EventBus from '../../../../eventbus';
import { EVENT_TYPE } from '../../../../bpmn-workflow-editor/modeler/eventTypes';
import UserTask from '../../../../bpmn-workflow-editor/activiti-model-definitions/activiti-model-types/user-task';

import TextInput from '../../../generic/TextInput.vue';

const model = defineModel();
const assignee = ref(null);
const candidateUsers = ref (null);
const candidateGroups = ref (null);
const dueDate = ref (null);
const priority = ref (null);

const inputTaskPropertiesLabels = {
    assignee: "Assignee",
    candidateUsers: "Candidate Users ( comma separated )",
    candidateGroups: "Candidate Groups ( comma separated )",
    dueDate: "Due Date",
    priority: "Priority"
}

const fieldKeys = {
    assignee: 'assignee',
    candidateUsers: 'candidateUsers',
    candidateGroups: 'candidateGroups',
    dueDate: 'dueDate',
    priority: 'priority',
};

function updateAssignee() {
    updateProperty(fieldKeys.assignee, assignee.value);
}

function updateCandidateUsers() {
    updateProperty(fieldKeys.candidateUsers, candidateUsers.value);
}

function updateCandidateGroups() {
    updateProperty(fieldKeys.candidateGroups, candidateGroups.value);
}

function updateDueDate() {
    updateProperty(fieldKeys.dueDate, dueDate.value);
}

function updatePriority() {
    updateProperty(fieldKeys.priority, priority.value);
}

function updateProperty(propertyKey, propertyValue) {
    const targetProperty = UserTask.properties.find(property => property.ns.localName === propertyKey);

    EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT_PROPERTY, 
        {
            elementId: model.value?.id,
            elementProperty: targetProperty.ns.localName,
            elementPropertyValue: propertyValue
        }
    );
}

watch(
  () => model, 
  () => {
    assignee.value = model.value?.assignee || '';
    candidateUsers.value = model.value?.candidateUsers || '';
    candidateGroups.value = model.value?.candidateGroups || '';
    dueDate.value = model.value?.dueDate || '';
    priority.value = model.value?.priority || '';
  },
  { immediate: true, deep: true }
);

</script>

<style scoped>
</style>