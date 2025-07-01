<template>
    <div class="number-input-container" data-testid="number-input-container">
        <input type="number" v-model="currentValue" @input="handleInput" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const model = defineModel();
const currentValue = ref('');

const props = defineProps({
    label: {
        type: String,
        required: false,
        default: ""
    },
    variant: {
        type: String,
        required: false,
        default: "plain"
    },
    max: {
        type: [String, Number],
        required: false,
        default: "1",
        validator: value => {
            if (typeof value === 'number') return true;
            if (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value))) return true;
            return false;
        }
    },
    min: {
        type: [String, Number],
        required: false,
        default: "1",
        validator: value => {
            if (typeof value === 'number') return true;
            if (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value))) return true;
            return false;
        }
    },
    density: {
        type: String,
        required: false,
        default: "compact"
    }
});

function handleInput() {
   if(currentValue.value > props.max){
        currentValue.value = props.max;
        return;
   }

   if(currentValue.value < props.min){
        currentValue.value = props.min;
        return;
   }
}

watch(
  () => model, 
  () => {
    if(!model.value) {
        currentValue.value = '0';
        return;
    }

    currentValue.value = model.value;
  },
  { immediate: true ,deep: true }
);

</script>

<style scoped>
.number-input-container {
    background-color: rgb(230, 230, 230);
    padding: .6em;
    border: 1px solid lightgrey;
    border-radius: 4px;

    input[type="number"] {
        width: 100%;
        border: none; 
        outline: none; 
        box-shadow: none; 
        -webkit-appearance: none; 
        -moz-appearance: none;    
        appearance: none;        
    }
}
</style>