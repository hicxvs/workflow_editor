<template>
    <div class="button-container" data-testid="button-container">
        <v-btn :color="buttonColor" @click="clickHandler" variant="flat" :disabled="disabled">
            {{ label }}
        </v-btn>
    </div>    
</template>

<script setup>
const props = defineProps({
    label: {
        type: String,
        required: false,
        default: "Default button label"
    },
    buttonColor: {
        type: String,
        required: false,
        default: ""
    },
    clickHandler: {
        type: Function,
        required: false,
        default: () => {
            console.warn("No click handler provided for the button. Please provide a click handler to handle the button click event.");
        }
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false
    }
});
</script>

<style scoped>
</style>
