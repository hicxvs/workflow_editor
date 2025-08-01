<template>
    <div class="text-area-container" data-testid="text-area-container">
        <v-textarea 
            :clearable="clearable"            
            :label="label"
            v-model="model"
            @click:clear="clearHandler"
            density="compact"
            variant="outlined"
        />
    </div>
</template>

<script setup>
const model = defineModel();
defineProps({
    label: {
        type: String,
        required: false,
        default: "Default label"
    },
    clearable: {
        type: Boolean,
        required: false,
        default: true
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