<template>
  <div class="checkbox-container" data-testid="checkbox-container">
    <v-checkbox v-model="model" :label="label" />
  </div>
</template>

<script setup>
defineEmits(['update:modelValue']);
const model = defineModel(false);
defineProps({
  label: {
    type: String,
    required: false,
    default: "Default label"
  }
});
</script>

<style scoped>
</style>