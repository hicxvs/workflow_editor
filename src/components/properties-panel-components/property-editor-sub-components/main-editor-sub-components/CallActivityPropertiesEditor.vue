<template>
    <div class="call-activity-properties-editor-container" data-testid="call-activity-properties-editor-container">
        <TextInput v-model="calledElement" :label="callActivityPropertiesLabels.calledElement" @input="updateCalledElement" :clearHandler="updateCalledElement"/>

        <ConfigurationTable
            :title="callActivityPropertiesLabels.inputParameters"
            :headers="inputAndOutputParametersHeaders"
            v-model="copyInputParamenters"
            :createNewItemHandler="inputParameterHandler.create"
            :editItemHandler="inputParameterHandler.edit"
            :removeItemHandler="inputParameterHandler.remove"
        >
            <template #row="{ item }">
                <td>{{ item.source }}</td>
                <td>{{ item.sourceExpression }}</td>
                <td>{{ item.target }}</td>
                <td>{{ item.targetExpression }}</td>
            </template>
        </ConfigurationTable>

        <ConfigurationTable
            :title="callActivityPropertiesLabels.outputParameters"
            :headers="inputAndOutputParametersHeaders"
            v-model="copyOutputParamenters"
            :createNewItemHandler="outputParameterHandler.create"
            :editItemHandler="outputParameterHandler.edit"
            :removeItemHandler="outputParameterHandler.remove"
        >
            <template #row="{ item }">
                <td>{{ item.source }}</td>
                <td>{{ item.sourceExpression }}</td>
                <td>{{ item.target }}</td>
                <td>{{ item.targetExpression }}</td>
            </template>
        </ConfigurationTable>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import EventBus from '../../../../eventbus';
import { EVENT_TYPE } from '../../../../bpmn-workflow-editor/modeler/eventTypes';
import { ACTIVITY_TYPES } from '../../../../bpmn-workflow-editor/modeler/modelerTypes/activityTypes';
import { createDeepCopy } from '../../../../bpmn-workflow-editor/utils/create-deep-copy';
import { saveChanges } from '../../../../bpmn-workflow-editor/utils/save-changes';

import TextInput from '../../../generic/TextInput.vue';
import ConfigurationTable from '../../../generic/ConfigurationTable.vue';


const model = defineModel();
const calledElement = ref(null);
const extensionElements = ref(null);

const originalInputParamenters = ref(null);
const copyInputParamenters = ref(null);

const originalOutputParamenters = ref(null);
const copyOutputParamenters = ref(null);

const callActivityPropertiesLabels = {
    calledElement: 'Called Element',
    inputParameters: 'Input Paramenters',
    outputParameters: 'Output Parameters'
};

const fieldKeys = {
    calledElement: 'calledElement',
    extensionElements: 'extensionElements'
};

const inputAndOutputParametersHeaders = [
    'Source',
    'Source Expression',
    'Target',
    'Target Expression'
];

const inputParameterHandler = {
    create: () => {
        EventBus.emit(EVENT_TYPE.CREATE_CALL_ACTIVITY_INPUT_PARAMETER, {
            type: ACTIVITY_TYPES.IN,
            field: null
        });
    },
    edit: (fieldItem) => {        
        EventBus.emit(EVENT_TYPE.EDIT_CALL_ACTIVITY_INPUT_PARAMETER,  {
            type: ACTIVITY_TYPES.IN,
            field: fieldItem.item
        });
    },
    remove: (fieldItem) => {
        const indexToRemove = fieldItem.index;
        copyInputParamenters.value = copyInputParamenters.value.filter((_, index) => index !== indexToRemove);
        save(ACTIVITY_TYPES.IN);
    }
};

const outputParameterHandler = {
    create: () => {
        EventBus.emit(EVENT_TYPE.CREATE_CALL_ACTIVITY_OUTPUT_PARAMETER, {
            type: ACTIVITY_TYPES.OUT,
            field: null
        });
    },
    edit: (fieldItem) => {
        EventBus.emit(EVENT_TYPE.EDIT_CALL_ACTIVITY_OUTPUT_PARAMETER,  {
            type: ACTIVITY_TYPES.OUT,
            field: fieldItem.item
        });
    },
    remove: (fieldItem) => {
        const indexToRemove = fieldItem.index;
        copyOutputParamenters.value = copyOutputParamenters.value.filter((_, index) => index !== indexToRemove);
        save(ACTIVITY_TYPES.OUT);
    }
};  

onMounted(() => {
    EventBus.on(EVENT_TYPE.ADD_CREATED_CALL_ACTIVITY_INPUT_PARAMETER, (newInputParamenter) => {
        if(!newInputParamenter) {
            return;
        }

        copyInputParamenters.value.push(newInputParamenter.field);
        save(ACTIVITY_TYPES.IN);
    });

    EventBus.on(EVENT_TYPE.UPDATE_EDITED_CALL_ACTIVITY_INPUT_PARAMETER, (updatedInputParamenter) => {
        if(!updatedInputParamenter) {
            return;
        }

        save(ACTIVITY_TYPES.IN);
    });

    EventBus.on(EVENT_TYPE.ADD_CREATED_CALL_ACTIVITY_OUTPUT_PARAMETER, (newOutputParamenter) => {
        if(!newOutputParamenter) {
            return;
        }

        copyOutputParamenters.value.push(newOutputParamenter.field);
        save(ACTIVITY_TYPES.OUT);
    });

    EventBus.on(EVENT_TYPE.UPDATE_EDITED_CALL_ACTIVITY_OUTPUT_PARAMETER, (updatedOutputParamenter) => {
        if(!updatedOutputParamenter) {
            return;
        }

        save(ACTIVITY_TYPES.OUT);
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.ADD_CREATED_CALL_ACTIVITY_INPUT_PARAMETER);
    EventBus.off(EVENT_TYPE.UPDATE_EDITED_CALL_ACTIVITY_INPUT_PARAMETER);
    EventBus.off(EVENT_TYPE.ADD_CREATED_CALL_ACTIVITY_OUTPUT_PARAMETER);
    EventBus.off(EVENT_TYPE.UPDATE_EDITED_CALL_ACTIVITY_OUTPUT_PARAMETER);
});

watch(
    () => model,
    () => {
        calledElement.value = model.value.calledElement || '';
        extensionElements.value = model.value?.extensionElements?.values || [];
        originalInputParamenters.value = extensionElements.value.filter(item => item.$type === ACTIVITY_TYPES.IN);       
        originalOutputParamenters.value = extensionElements.value.filter(item => item.$type === ACTIVITY_TYPES.OUT);
        copyInputParamenters.value = createDeepCopy(originalInputParamenters.value);
        copyOutputParamenters.value = createDeepCopy(originalOutputParamenters.value);
    },
    { immediate: true, deep: true }
);

function updateCalledElement() {
    EventBus.emit(EVENT_TYPE.UPDATE_CALL_ACTIVITY_ELEMENT_PROPERTY, 
        {
            elementId: model.value?.id,
            elementProperty: fieldKeys.calledElement,
            elementPropertyValue: calledElement.value
        }
    );
}

function save(collectionTypeToSave) {
    if(collectionTypeToSave === ACTIVITY_TYPES.IN) {
        saveChanges(originalInputParamenters.value, copyInputParamenters.value);

        EventBus.emit(EVENT_TYPE.SAVE_CALL_ACTIVITY_INPUT_PARAMETER, {
            elementId: model.value?.id,
            elementProperty: fieldKeys.extensionElements,
            elementPropertyValue: originalInputParamenters.value
        });
        return;
    }

    saveChanges(originalOutputParamenters.value, copyOutputParamenters.value);

    EventBus.emit(EVENT_TYPE.SAVE_CALL_ACTIVITY_OUTPUT_PARAMETER, {
            elementId: model.value?.id,
            elementProperty: fieldKeys.extensionElements,
            elementPropertyValue: originalOutputParamenters.value
        });
}

</script>

<style scoped>
</style>