<template>
    <div class="select-container" data-testid="select-container">
        <v-select
            :clearable="props.clearable"
            :chips="props.chips"
            :label="props.label"
            :items="itemsLabels"
            :multiple="props.multiple"
            v-model="model"
            @update:modelValue="handleSelectItemClick"
        ></v-select>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { VSelect } from "vuetify/components";

const model = defineModel();
const itemsLabels = ref(null);

const props = defineProps({
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
    },
    selectOptionItems: {
        type: Array,
        required: false,
        default: []
    },
    selectItemClickHandler: {
        type: Function,
        required: false,
        default: () => {}
    }
});

watch(
    () => props.selectOptionItems,
    (newSelectOptionItems) => {
        itemsLabels.value = newSelectOptionItems?.map(item => item.label);
    },
    { immediate: true, deep: true }
);

function handleSelectItemClick() {
    props.selectItemClickHandler();
}

</script>

<style scoped>

</style>
