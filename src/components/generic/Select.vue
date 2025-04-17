<template>
    <div class="select-container" data-testid="select-container">
        <v-select
            :clearable="props.clearable"
            :chips="props.chips"
            :label="props.label"
            :items="itemsLabels"
            :multiple="props.multiple"
            v-model="model"
            :menu="menuOpen"
            @update:modelValue="handleSelectItemClick"
            @update:menu="handleMenuClick"
            @update:focused="handleMenuFocusChange"
        ></v-select>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { VSelect } from "vuetify/components";

const model = defineModel();
const itemsLabels = ref(null);
const menuOpen = ref(false);

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
    openMenu: {
        type: Boolean,
        required: false,
        default: false
    },
    chips: {
        type: Boolean,
        required: false,
        default: false
    },
    selectOptionItems: {
        type: Array,
        required: false,
        default: () => []
    },
    selectItemClickHandler: {
        type: Function,
        required: false,
        default: () => {}
    },
    selectMenuClickHandler: {
        type: Function,
        required: false,
        default: () => {}
    },
    selectMenuFocusChangeHandler: {
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

watch(
    () => props.openMenu,
    (newValue) => {
        menuOpen.value = newValue;
    },
    { immediate: true }
);


function handleSelectItemClick() {
    props.selectItemClickHandler();
}

function handleMenuClick() {
    menuOpen.value = !menuOpen.value;
    props.selectMenuClickHandler();
}

function handleMenuFocusChange() {
    props.selectMenuFocusChangeHandler();
}

</script>

<style scoped>

</style>
