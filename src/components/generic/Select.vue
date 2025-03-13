<template>
    <div class="select-container" data-testid="select-container">
        <v-select
            :clearable="props.clearable"
            :chips="props.chips"
            :label="props.label"
            :items="props.items"
            :multiple="props.multiple"
            @update:modelValue="update"
        ></v-select>
    </div>
</template>

<script setup>
import { VSelect } from "vuetify/components";

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
    items: {
        type: Array,
        required: false,
        default: []
    },
    label: {
        type: String,
        required: false,
        default: "Default select label"
    },
    multiple: {
        type: Boolean,
        required: false,
        default: false
    },
    clearable: {
        type: Boolean,
        required: false,
        default: true
    },
    chips: {
        type: Boolean,
        required: false,
        default: false
    }
});

function update(value) {
    emit('update:modelValue', value);
}

</script>

<style scoped>

</style>
