<template>
    <div class="radio-input-container" data-testid="radio-input-container">
        <p>{{ label }}</p>
        <v-radio-group :inline="inline" v-model="model" v-if="radioOptionItems && radioOptionItems.length">
            <v-radio 
                    v-for="radioOptionItem in radioOptionItems"
                    :key="radioOptionItem" 
                    :label="radioOptionItem.label"
                    :value="radioOptionItem.value">
            </v-radio>
        </v-radio-group>
    </div>
</template>

<script setup>
const model = defineModel();

defineProps({
    label: {
        type: String,
        required: false,
        default: "Default radio label"
    },
    radioOptionItems: {
        type: Array,
        required: false,
        default: []
    },
    inline: {
        type: Boolean,
        required: false,
        default: false
    }
});
</script>

<style scoped>
.radio-input-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.radio-input-container p {
  flex: 0 0 5%;
  margin: 5px 0 0;
  align-self: flex-start;
}

.radio-input-container v-radio-group {
  flex: 1;
  display: flex;
  align-items: center;
}

@media (max-width: 600px) {
  .radio-input-container {
    flex-direction: column; 
    align-items: flex-start;
  }

  .radio-input-container p,
  .radio-input-container v-radio-group {
    flex: none; 
    width: 100%; 
    display: block;
  }
}
</style>