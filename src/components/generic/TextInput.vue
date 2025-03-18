<template>
    <div class="text-input-container" data-testid="text-input-container">
        <v-text-field
            clearable
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
        required: false
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
