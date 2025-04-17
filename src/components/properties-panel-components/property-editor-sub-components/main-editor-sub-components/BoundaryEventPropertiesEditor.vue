<template>
    <div class="boundary-event-properties-editor-container" data-testid="boundary-event-properties-editor-container">
        <Checkbox v-if="canDisplayMessageEventDefinitionType" v-model="cancelActivity" :label="boundaryEventPropertiesLabels.cancelActivity" @update:modelValue="updateCancelActivity"/>
        
        <TextInput v-if="canDisplayErrorEventDefinitionType" v-model="errorCode" :label="boundaryEventPropertiesLabels.errorCode"  @input="updateErrorCode" :clearHandler="updateErrorCode"/>

        <Select v-if="canDisplayMessageEventDefinitionType && canDisplayWorkflowMessages" :label="boundaryEventPropertiesLabels.messageReference" v-model="messageReference" :selectOptionItems="workflowMessageOptions" :selectItemClickHandler="updateMessageReference" />

        <Select v-if="canDisplayErrorEventDefinitionType" :label="boundaryEventPropertiesLabels.errorReference" v-model="errorCodeReference" :selectOptionItems="workflowErrorMessageOptions" :selectItemClickHandler="updateErrorCodeMessageReference" />
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import EventBus from '../../../../eventbus';
import { EVENT_TYPE } from '../../../../bpmn-workflow-editor/modeler/eventTypes';

import { EVENT_DEFINITION_TYPES } from '../../../../bpmn-workflow-editor/modeler/modelerTypes/eventDefinitionTypes';

import Checkbox from '../../../generic/Checkbox.vue';
import Select from '../../../generic/Select.vue';
import TextInput from '../../../generic/TextInput.vue';

const model = defineModel();
const boundaryEventDefinitions = ref(null);
const boundaryEventDefinitionType = ref(null);

const canDisplayWorkflowMessages = ref(false);
const canDisplayWorkflowErrorMessages = ref(false);
const canDisplayMessageEventDefinitionType = ref(false);
const canDisplayErrorEventDefinitionType = ref(false);

const workflowMessageOptions = ref(null);
const workflowErrorMessageOptions = ref(null);

const cancelActivity = ref(null);
const errorCode = ref(null);
const messageReference = ref(null);
const errorCodeReference = ref(null);

const boundaryEventPropertiesLabels = {
    cancelActivity: 'Cancel Activity',
    errorCode: 'Error Code',
    messageReference: 'Message Reference',
    errorReference: 'Error Code Reference'
};

const fieldKeys = {
    cancelActivity: 'cancelActivity',
    errorCode: 'errorCode',
    messageReference: 'messageRef',
    errorReference: 'errorRef'
};

onMounted(() => { 
    EventBus.emit(EVENT_TYPE.GET_WORKFLOW_MESSAGES);       
    EventBus.emit(EVENT_TYPE.GET_WORKFLOW_ERROR_MESSAGES);       
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.WORKFLOW_MESSAGES_READY);
    EventBus.off(EVENT_TYPE.WORKFLOW_ERROR_MESSAGES_READY);
});

watch(
  () => model, 
  () => {
    boundaryEventDefinitions.value = model.value.eventDefinitions;

    cancelActivity.value = model.value?.cancelActivity || false;
    errorCode.value = model.value?.errorCode || '';
    messageReference.value = model.value.eventDefinitions[0]?.messageRef?.name || null;
    errorCodeReference.value = model.value.eventDefinitions[0]?.errorRef?.name || null;

    boundaryEventDefinitionType.value = ( boundaryEventDefinitions.value[0]?.$type ) ? boundaryEventDefinitions.value[0].$type : null;
    canDisplayMessageEventDefinitionType.value = (boundaryEventDefinitionType.value === EVENT_DEFINITION_TYPES.MESSAGE_EVENT_DEFINITION);
    canDisplayErrorEventDefinitionType.value = (boundaryEventDefinitionType.value === EVENT_DEFINITION_TYPES.ERROR_EVENT_DEFINITION);
    
    EventBus.on(EVENT_TYPE.WORKFLOW_MESSAGES_READY, (workflowMessagesCollection) => {
        if(!workflowMessagesCollection || !workflowMessagesCollection.length) {
            canDisplayWorkflowMessages.value = false;
            return;
        }

        workflowMessageOptions.value = workflowMessagesCollection.map(message => ({
            value: message.id,
            label: message.name
        }));

        canDisplayWorkflowMessages.value = true;        
    });

    EventBus.on(EVENT_TYPE.WORKFLOW_ERROR_MESSAGES_READY, (workflowErrorMessagesCollection) => {
        if(!workflowErrorMessagesCollection || !workflowErrorMessagesCollection.length) {
            canDisplayWorkflowErrorMessages.value = false;
            return;
        }

        workflowErrorMessageOptions.value = workflowErrorMessagesCollection.map(message => ({
            value: message.id,
            label: message.name
        }));

        canDisplayWorkflowErrorMessages.value = true;        
    });

  },
  { immediate: true, deep: true }
);

function updateCancelActivity() {
    EventBus.emit(EVENT_TYPE.UPDATE_BOUNDARY_EVENT_ELEMENT_PROPERTY, 
        {
            elementId: model.value?.id,
            elementProperty: fieldKeys.cancelActivity,
            elementPropertyValue: cancelActivity.value
        }
    );
}

function updateErrorCode() {
    EventBus.emit(EVENT_TYPE.UPDATE_ELEMENT_PROPERTY, 
        {
            elementId: model.value?.id,
            elementProperty: fieldKeys.errorCode,
            elementPropertyValue: errorCode.value
        }
    );
}

function updateErrorCodeMessageReference() {
    updateReference(errorCodeReference, workflowErrorMessageOptions, fieldKeys.errorReference);
}

function updateMessageReference() {
    updateReference(messageReference, workflowMessageOptions, fieldKeys.messageReference);
}

function updateReference(reference, options, fieldKey) {
    if (!reference.value) {
        return;
    }

    const workflowPropertyValue = options.value.find(item => item.label === reference.value).value;

    EventBus.emit(EVENT_TYPE.UPDATE_BOUNDARY_EVENT_ELEMENT_REFERENCE_PROPERTY, {
        elementId: model.value?.id,
        elementProperty: fieldKey,
        elementPropertyValue: workflowPropertyValue
    });
}

</script>

<style scoped>

</style>