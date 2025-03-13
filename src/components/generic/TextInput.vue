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
const model = defineModel();
const props = defineProps({
    label: {
        type: String,
        required: false,
        default: "Default label"
    }
});

function update(event) {
    console.log(event);
}

</script>

<style scoped> 
</style>
