<template>
  <div class="checkbox-container" data-testid="checkbox-container">
    <v-checkbox v-model="model" :label="label" @update:modelValue="update" />
  </div>
</template>

<script setup>
const emit = defineEmits(['update:modelValue']);
const model = defineModel();
const props = defineProps({
  label: {
    type: String,
    required: false,
    default: "Default label"
  }
});

function update(value) {
    emit('update:modelValue', value);
}
</script>

<style scoped>
</style>