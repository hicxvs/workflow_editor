<template>
    <div class="catch-event-properties-editor-container" data-testid="catch-event-properties-editor-container">
        <Select :label="catchEventPropertiesLabels.messageRefence" v-model="messageReference" :selectOptionItems="workflowMessageOptions" :selectItemClickHandler="updateMessageReference" />
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import EventBus from '../../../../eventbus';
import { EVENT_TYPE } from '../../../../bpmn-workflow-editor/modeler/eventTypes';

import Select from '../../../generic/Select.vue';

const model = defineModel();

const messageReference = ref(null);
const workflowMessageOptions = ref(null);

const catchEventPropertiesLabels = {
    messageRefence: 'Message Ref'
};

const fieldKeys = {
    messageRefence: 'messageRef'
};

onMounted(() => { 
    EventBus.emit(EVENT_TYPE.GET_WORKFLOW_MESSAGES);              
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.WORKFLOW_MESSAGES_READY);
});

watch(
  () => model, 
  () => {
    messageReference.value = model.value.eventDefinitions[0]?.messageRef?.name || null;

    EventBus.on(EVENT_TYPE.WORKFLOW_MESSAGES_READY, (workflowMessagesCollection) => {
        if(!workflowMessagesCollection || !workflowMessagesCollection.length) {
            canDisplayWorkflowMessages.value = false;
            return;
        }

        workflowMessageOptions.value = workflowMessagesCollection.map(message => ({
            value: message.id,
            label: message.name
        }));
        
    });

  },
  { immediate: true, deep: true }
);

function updateMessageReference() {
    if(!messageReference.value) {
        return;
    }

    const workflowMessage = workflowMessageOptions.value.find(message => message.label === messageReference.value).value;
   
    EventBus.emit(EVENT_TYPE.UPDATE_CATCH_EVENT_ELEMENT_REFERENCE_PROPERTY, 
        {
            elementId: model.value?.id,
            elementProperty: fieldKeys.messageRefence,
            elementPropertyValue: workflowMessage
        }
    );
}

</script>

<style scoped>

</style>