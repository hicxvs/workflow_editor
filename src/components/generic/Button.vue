<template>
    <div class="button-container" data-testid="button-container">
        <v-btn :color="buttonColor" variant="flat" :disabled="disabled">
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
    disabled: {
        type: Boolean,
        required: false,
        default: false
    }
});
</script>

<style scoped>
</style>
