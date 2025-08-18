<template>
    <div class="text-area-container" data-testid="text-area-container">
        <v-textarea 
            :clearable="clearable"            
            :label="label"
            v-model="model"
            @click:clear="clearHandler"
            density="compact"
            variant="outlined"
        />
    </div>
</template>

<script setup>
const model = defineModel();
defineProps({
    label: {
        type: String,
        required: false,
        default: "Default label"
    },
    clearable: {
        type: Boolean,
        required: false,
        default: true
    },
    clearHandler: {
        type: Function,
        required: false,
        default: () => {}
    }
});
</script>

<style scoped>
/* start of fix attempt

Attempt to fix the issue caused SXP style codebase on the workflow UI. 
Once that code is fixed this css style can be removed*/
.text-area-container .v-text-field .v-input__control {
  height: initial !important;
}
/*end of fix attempt */
</style>