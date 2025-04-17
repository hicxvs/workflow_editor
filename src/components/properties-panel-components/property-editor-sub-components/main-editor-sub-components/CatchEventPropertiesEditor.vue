<template>
    <div class="catch-event-properties-editor-container" data-testid="catch-event-properties-editor-container">
        <Select v-if="canDisplayMessageEventDefinitionType" :label="catchEventPropertiesLabels.messageRefence" v-model="messageReference" :selectOptionItems="workflowMessageOptions" :selectItemClickHandler="updateMessageReference" />
        
        <TextInput v-if="canDisplayTimerEventDefinitionType" v-model="timeDuration" :label="catchEventPropertiesLabels.timeDuration" :placeholder="timerCatchEventPropertiesPlaceholder.timeDuration" :hint="timerCatchEventPropertiesHint.timeDuration" @input="updateTimeDuration" :clearHandler="updateTimeDuration"/>

        <TextInput v-if="canDisplayTimerEventDefinitionType" v-model="timeDate" :label="catchEventPropertiesLabels.timeDate" :placeholder="timerCatchEventPropertiesPlaceholder.timeDate" :hint="timerCatchEventPropertiesHint.timeDate" @input="updateTimeDate" :clearHandler="updateTimeDate"/>

        <TextInput v-if="canDisplayTimerEventDefinitionType" v-model="timeCycle" :label="catchEventPropertiesLabels.timeCycle" :placeholder="timerCatchEventPropertiesPlaceholder.timeCycle" :hint="timerCatchEventPropertiesHint.timeCycle" @input="updateTimeCycle" :clearHandler="updateTimeCycle"/>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import EventBus from '../../../../eventbus';
import { EVENT_TYPE } from '../../../../bpmn-workflow-editor/modeler/eventTypes';

import { EVENT_DEFINITION_TYPES } from '../../../../bpmn-workflow-editor/modeler/modelerTypes/eventDefinitionTypes';

import Select from '../../../generic/Select.vue';
import TextInput from '../../../generic/TextInput.vue';

const model = defineModel();
const catchEventDefinitions = ref(null);
const catchEventDefinitionType = ref(null);

const messageReference = ref(null);
const workflowMessageOptions = ref(null);
const canDisplayMessageEventDefinitionType = ref(false);

const timeDuration = ref(null);
const timeDate = ref(null);
const timeCycle = ref(null);
const canDisplayTimerEventDefinitionType = ref(false);

const catchEventPropertiesLabels = {
    messageRefence: 'Message Ref',
    timeDuration: 'Time Duration',
    timeDate: 'Time Date',
    timeCycle: 'Time Cycle'
};

const timerCatchEventPropertiesPlaceholder = {
    timeDuration: 'ISO Duration (e.g., PT1H for 1 hour)',
    timeDate: 'ISO Date or Expression',
    timeCycle: 'ISO Recurring Time (e.g., R/PT1H for every hour)'
};

const timerCatchEventPropertiesHint = {
    timeDuration: 'Specify a duration using ISO 8601 format',
    timeDate: 'Specify a fixed date/time or use an expression',
    timeCycle: 'Specify a recurring time pattern'
};

const fieldKeys = {
    messageRefence: 'messageRef',
    timeDuration: 'timeDuration',
    timeDate: 'timeDate',
    timeCycle: 'timeCycle'
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
    catchEventDefinitions.value = model.value.eventDefinitions;
    catchEventDefinitionType.value = ( catchEventDefinitions.value[0]?.$type ) ? catchEventDefinitions.value[0].$type : null;
    canDisplayMessageEventDefinitionType.value = (catchEventDefinitionType.value === EVENT_DEFINITION_TYPES.MESSAGE_EVENT_DEFINITION);
    canDisplayTimerEventDefinitionType.value = (catchEventDefinitionType.value === EVENT_DEFINITION_TYPES.TIMER_EVENT_DEFINITION);

    messageReference.value = model.value.eventDefinitions[0]?.messageRef?.name || null;
    timeDuration.value = model.value.eventDefinitions[0]?.timeDuration?.body || '';
    timeDate.value = model.value.eventDefinitions[0]?.timeDate?.body || '';
    timeCycle.value = model.value.eventDefinitions[0]?.timeCycle?.body || '';

    EventBus.on(EVENT_TYPE.WORKFLOW_MESSAGES_READY, (workflowMessagesCollection) => {
        if(!workflowMessagesCollection || !workflowMessagesCollection.length) {
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

function updateTimeDuration() {
    updateTime(timeDuration.value, fieldKeys.timeDuration);
}

function updateTimeDate() {
    updateTime(timeDate.value, fieldKeys.timeDate);

}

function updateTimeCycle() {
    updateTime(timeCycle.value, fieldKeys.timeCycle);

}

function updateTime(propertyValue, fieldKey) {
    EventBus.emit(EVENT_TYPE.UPDATE_CATCH_EVENT_ELEMENT_PROPERTY, 
        {
            elementId: model.value?.id,
            elementProperty: fieldKey,
            elementPropertyValue: propertyValue
        }
    );
}

</script>

<style scoped>

</style>