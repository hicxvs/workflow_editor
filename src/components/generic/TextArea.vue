<template>
    <div class="text-area-container" data-testid="text-area-container">
        <v-textarea 
            :clearable="clearable"            
            :label="label"
            v-model="model" 
        />
    </div>
</template>

<script setup>
const model = defineModel();
const props = defineProps({
    label: {
        type: String,
        required: false,
        default: "Default label"
    },
    clearable: {
        type: Boolean,
        required: false,
        default: true
    }
});
</script>

<style scoped>
</style>