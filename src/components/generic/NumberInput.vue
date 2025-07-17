<template>
    <div class="number-input-container" data-testid="number-input-container">
        <v-text-field
            type="number"
            :variant="variant"
            :density="density"
            :hide-details="hideDetails"
            clearable
            flat
            :max="max"
            :min="min"
            :disabled="disabled"
            v-model="model"
        ></v-text-field>
    </div>
</template>

<script setup>
import { watch } from 'vue';

const model = defineModel();

const props = defineProps({
    max: {
        type: [String, Number],
        required: false,
        default: 1
    },
    min: {
        type: [String, Number],
        required: false,
        default: 1
    },
    hideDetails: {
        type: Boolean,
        required: false,
        default: true
    },
    variant: {
        type: String,
        required: false,
        default: 'outlined'
    },
    density: {
        type: String,
        required: false,
        default: 'compact'
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false
    }
});

watch(
    () => model.value,
    () => {
        if(!model.value) {
            model.value = props.max;
            return;
        }
        
        if(model.value > props.max) {
            model.value = props.max;
            return;
        }

        if(model.value < props.min) {
            model.value = props.min;
            return;
        }
    }
);

</script>