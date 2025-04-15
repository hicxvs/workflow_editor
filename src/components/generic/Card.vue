<template>
    <div class="card-container" data-testid="card-container">
        <v-card 
            :title="title" 
            :subtitle="subtitle" 
            :text="text"
            :loading="loading"
        >
            <slot name="content"></slot>
            <slot v-if="$slots.actions" name="actions"></slot>
        </v-card>
    </div>   
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: false,
        default: "Default title"
    },
    subtitle: {
        type: String,
        required: false,
        default: "Default subtitle"
    },
    text: {
        type: String,
        required: false,
        default: "Default text"
    },
    loading: {
        type: Boolean,
        required: false,
        default: false
    }
});
</script>

<style scoped>

</style>
