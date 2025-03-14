<template>
    <div class="text-input-container" data-testid="text-input-container">

        {{ model }}

        <v-text-field
            :clearable="clearable"
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
    },
    clearable: {
        type: Boolean,
        required: false,
        default: true
    }
});

function update() {
    emit('update:modelValue', model.value);
}

</script>

<style scoped> 
</style>
