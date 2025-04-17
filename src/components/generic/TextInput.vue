<template>
    <div class="text-input-container" data-testid="text-input-container">
        <v-text-field
            clearable
            :rules="rules"
            :label="label"
            :placeholder="placeholder"
            :hint="hint"
            v-model="model"
            @click:clear="clearHandler"
        />
    </div>
</template>

<script setup>
const model = defineModel();
defineProps({
    label: {
        type: String,
        required: false,
        default: 'Default text input label'
    },
    placeholder: {
        type: String,
        required: false,
        default: ''
    },
    hint: {
        type: String,
        required: false,
        default: ''
    },
    rules: {
        type: Array,
        required: false,
        default: []
    },
    clearHandler: {
        type: Function,
        required: false,
        default: () => {}
    }
});
</script>

<style scoped> 
</style>
