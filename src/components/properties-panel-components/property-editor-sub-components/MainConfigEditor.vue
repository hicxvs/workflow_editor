<template>
    <div class="main-config-editor">
        <Card :title="cardProps.title" :subtitle="cardProps.subtitle" :text="cardProps.text">            
            <template #content>
                <div class="main-config-editor-content">
                    <TextInput v-if="model" :label="inputLabel.formKey" :model="model.formKey" />
                    <TextInput v-if="model":label="inputLabel.initiator" :model="model.initiator" />
                </div>
                
            </template>
        </Card>
    </div>
</template>

<script setup>
import Card from "../../generic/Card.vue";
import TextInput from "../../generic/TextInput.vue";

const model = defineModel({
    formKey: {
        type: String,
        required: false,
        default: ""
    },
    initiator: {
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
    formKey: "Form Key",
    initiator: "Initiator"
};
</script>

<style scoped>
.main-config-editor-content {
    padding: 0 16px;
}
</style>