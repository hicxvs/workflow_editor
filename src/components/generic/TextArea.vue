<template>
    <div class="text-area-container" data-testid="text-area-container">
        <v-textarea 
            :clearable="clearable"
            v-model="model" 
            :label="label" 
            @update:modelValue="update" 
        />
    </div>
</template>

<script setup>
const emit = defineEmits(['update:modelValue']);
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

function update(value) {
    emit('update:modelValue', value);
}
</script>

<style scoped>
</style>