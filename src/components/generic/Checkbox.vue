<template>
  <div class="checkbox-container" data-testid="checkbox-container">
    <v-checkbox v-model="model" :label="label" />
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
</script>

<style scoped>
</style>