<template>
    <div class="user-task-properties-editor-container" data-testid="user-task-properties-editor-container">
        <TextInput :label="inputTaskPropertiesLabels.assignee" v-model="assignee" @input="updatesAssignee" :clearHandler="updatesAssignee"/>
        <TextInput :label="inputTaskPropertiesLabels.candidateUsers" v-model="candidateUsers" @input="updatesCandidateUsers" :clearHandler="updatesCandidateUsers"/>
        <TextInput :label="inputTaskPropertiesLabels.candidateGroups" v-model="candidateGroups" @input="updatesCandidateGroups" :clearHandler="updatesCandidateGroups"/>
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

const inputTaskPropertiesLabels = {
    assignee: "Assignee",
    candidateUsers: "Candidate Users ( comma separated )",
    candidateGroups: "Candidate Groups ( comma separated )",
}

const fieldKeys = {
    assignee: 'assignee',
    candidateUsers: 'candidateUsers',
    candidateGroups: 'candidateGroups',
};

function updatesAssignee() {
    const targetProperty = UserTask.properties.find(property => property.ns.localName === fieldKeys.assignee);

    EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT_PROPERTY, 
        {
            elementId: model.value?.id,
            elementProperty: targetProperty.ns.localName,
            elementPropertyValue: assignee.value
        }
    );
}

function updatesCandidateUsers() {
    const targetProperty = UserTask.properties.find(property => property.ns.localName === fieldKeys.candidateUsers);

    EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT_PROPERTY, 
        {
            elementId: model.value?.id,
            elementProperty: targetProperty.ns.localName,
            elementPropertyValue: candidateUsers.value
        }
    );
}

function updatesCandidateGroups() {
    const targetProperty = UserTask.properties.find(property => property.ns.localName === fieldKeys.candidateGroups);

    EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT_PROPERTY, 
        {
            elementId: model.value?.id,
            elementProperty: targetProperty.ns.localName,
            elementPropertyValue: candidateGroups.value
        }
    );
}

watch(
  () => model, 
  () => {
    assignee.value = model.value?.assignee || '';
    candidateUsers.value = model.value?.candidateUsers || '';
    candidateGroups.value = model.value?.candidateGroups || '';
  },
  { immediate: true, deep: true }
);

</script>

<style scoped>
</style>