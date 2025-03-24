<template>
    <div class="text-input-container" data-testid="text-input-container">
        <v-text-field
            clearable
            :rules="rules"
            :label="label" 
            v-model="model"
            @click:clear="clearHandler"
        />
    </div>
</template>

<script setup>
import { defineModel } from 'vue';

const model = defineModel();
const props = defineProps({
    label: {
        type: String,
        required: false,
        default: 'Default text input label'
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
