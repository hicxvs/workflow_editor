<template>
    <div class="form-editor-container">
        <Card :title="cardProps.title" :subtitle="cardProps.subtitle" :text="cardProps.text">
            <template #content>
                <div class="form-editor-content" data-testid="form-editor-content">
                    <ConfigurationTable
                        :title="formPropertiesTableSettings.title"
                        :headers="formPropertiesTableSettings.headers"
                        v-model="formProperties"
                        :createNewItemHandler="formPropertiesHandlers.create"
                        :editItemHandler="formPropertiesHandlers.edit"
                        :removeItemHandler="formPropertiesHandlers.remove"
                    >
                        <template #row="{ item }">
                            <td>{{ item.formProperty.id }}</td>
                            <td>{{ item.formProperty.name }}</td>
                            <td>{{ item.formProperty.type }}</td>
                            <td>{{ item.formProperty.expression }}</td>
                            <td>{{ item.formProperty.variable }}</td>
                            <td>{{ item.formProperty.default }}</td>
                            <td>{{ item.formProperty.pattern }}</td>
                            <td>{{ item.formProperty.required }}</td>
                            <td>{{ item.formProperty.readable }}</td>
                            <td>{{ item.formProperty.writable }}</td>
                            <td>{{ item.formProperty.formValue }}</td>
                        </template>
                    </ConfigurationTable>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { FormPropertyType } from '../../../bpmn-workflow-editor/activiti-model-definitions/activiti-model-types/form-property';
import { EVENT_TYPE } from '../../../bpmn-workflow-editor/modeler/eventTypes';
import EventBus from '../../../eventbus';

import Card from '../../generic/Card.vue';
import ConfigurationTable from '../../generic/ConfigurationTable.vue';

const model = defineModel();
const formProperties = ref(null);

const cardProps = {
    title: "Form",
    subtitle: "",
    text: ""
};

const formPropertiesTableSettings = {
    title: '',
    headers: [
        'Id',
        'Name',
        'Type',
        'Expression',
        'Variable',
        'Default',
        'Pattern',
        'Required',
        'Readable',
        'Writable',
        'Form value'
    ]
};

const formPropertiesHandlers = {
    create: () => {
        EventBus.emit(EVENT_TYPE.CREATE_FORM_PROPERTY, {
            type: FormPropertyType,
            formProperty: null
        });      
    },
    edit: (formProperty) => {
        console.log('lets edit!', formProperty);

    },
    remove: (formProperty) => {
        console.log('lets remove!', formProperty);
    }
};

function getFormProperties(formPropertyType) {
    if(!model.value || !formPropertyType) {
        return;
    }

    const extensionElements = model.value.get('extensionElements');
    if(!extensionElements) {
        return [];
    }

    const values = extensionElements.get('values');
    if(!values || !Array.isArray(values) || !values.length) {
        return [];
    }

    const formProperties = values.filter(element => element?.$type === `activiti:${formPropertyType}`);
    return formProperties.map(formProperty => ({
        type: formPropertyType,
        formProperty
    }));
}

watch(
  () => model, 
  () => {
    formProperties.value = getFormProperties(FormPropertyType);  
  },
  { deep: true }
);

onMounted(() => {
    EventBus.on(EVENT_TYPE.ADD_CREATED_FORM_PROPERTY, (newFormProperty) => {
        if(!newFormProperty) {
            return;
        }

        formProperties.value.push(newFormProperty);
        EventBus.emit(EVENT_TYPE.SAVE_FORM_PROPERTY, formProperties.value);
    });
});

onUnmounted(() => {
    
});

</script>

<style>

</style>