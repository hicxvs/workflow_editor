<template>
    <div class="text-input-container" data-testid="text-input-container">
        <v-text-field 
            :label="label" 
            v-model="model" 
            @input="update" 
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
    }
});

function update() {
    emit('update:modelValue', model.value);
}

</script>

<style scoped> 
</style>
