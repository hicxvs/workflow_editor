<template>
    <div class="configuration-table-container" data-testid="configuration-table-container" @click="handleParentClick">

        <p class="v-card-title">{{ title }}</p>

        <Table>
            <template #head-content>
                <tr v-if="headers && headers.length">
                    <th class="text-left"                        
                        v-for="header in headers"
                        :key="header"
                    >
                        {{ header }}
                    </th>
                </tr>
            </template>
            <template #body-content >
                <template v-if="items?.length">
                    <tr
                        v-for="(item, index) in items"
                        :key="index"
                        :class="{ 'active-row': selectedItem?.index === index }"
                        @click="setSelectedItem(item, index)"
                    >
                        <slot name="row" :item="item"></slot>
                    </tr>
                </template>
                <template v-else>
                    <tr>
                        <td :colspan="headers?.length || 1" class="text-center">No items available</td>
                    </tr>
                </template>
            </template>
        </Table>

        <div class="configuration-table-action-group">
            <Button :label="buttonLabels.new" :buttonColor="buttonColors.grey" @click="buttonClickHandlers.create" :disabled="!model" />
            <Button :label="buttonLabels.edit" :buttonColor="buttonColors.grey" @click="buttonClickHandlers.edit" :disabled="!selectedItem" />
            <Button :label="buttonLabels.remove" :buttonColor="buttonColors.grey" @click="buttonClickHandlers.remove" :disabled="!selectedItem" />
            <Button :label="buttonLabels.up" :buttonColor="buttonColors.grey" @click="buttonClickHandlers.moveUp" :disabled="!selectedItem" />
            <Button :label="buttonLabels.down" :buttonColor="buttonColors.grey" @click="buttonClickHandlers.moveDown" :disabled="!selectedItem" />
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import Table from './Table.vue';
import Button from './Button.vue';

const model = defineModel();

const props = defineProps({
    title: {
        type: String,
        required: false,
        default: 'Default title for configuration table'
    },
    headers: {
        type: Array,
        required: false,
        default: []
    },
    createNewItemHandler: {
        type: Function,
        required: false,
        default: () => {
            console.warn("No create new handler provided for the button. Please provide a handler to handle the create new click event.");
        }
    },
    editItemHandler: {
        type: Function,
        required: false,
        default: (item) => {
            console.warn("No edit handler provided for the button. Please provide a handler to handle the edit click event.", item);
        }
    },
    removeItemHandler: {
        type: Function,
        required: false,
        default: (item) => {
            console.warn("No remove handler provided for the button. Please provide a handler to handle the remove click event.", item);
        }
    },
});

const items = ref(null);
const selectedItem = ref(null);

const buttonLabels = {
    new: 'new',
    edit: 'edit',
    remove: 'remove',
    up: 'up',
    down: 'down'
};

const buttonColors = {
    grey: 'grey'
};

const buttonClickHandlers = {
    create: () => {

        if(!model.value) {
            return;
        }

        clearSelectedItem();
        props.createNewItemHandler();
    },
    edit: () => {
        if(!items.value || !selectedItem.value ) {
            return;
        }

        props.editItemHandler(selectedItem.value);
    },
    remove: () => {
        if(!items.value || !selectedItem.value ) {
            return;
        }

        props.removeItemHandler(selectedItem.value);
        clearSelectedItem();        
    },
    moveUp: () => {
        if(!items.value || !selectedItem.value ) {
            return;
        }

        move('up', 1, selectedItem.value?.index);
    },
    moveDown: () => {
        if(!items.value || !selectedItem.value ) {
            return;
        }
        
        move('down', 1, selectedItem.value?.index);
    },
};

onMounted(() => {
    items.value = model.value;
});

onUnmounted(() => {
    items.value = null;
});

watch(
  () => model, 
  () => {
    items.value = model.value;
  },
  { deep: true }
);

function clearSelectedItem() {
    if(selectedItem.value) {
        selectedItem.value = null;
    }    
}

function setSelectedItem(item, index) {
    selectedItem.value = {
        item,
        index
    };
}

function isIndexValid(index, array) {
    return index >= 0 && index < array.length;
}

function move(direction, positionAmount, itemIndex) {
    if (!isIndexValid(itemIndex, items.value)) {
        return;
    }

    const itemNewIndex = itemIndex +  + (direction === 'up' ? -positionAmount : positionAmount);

    if (!isIndexValid(itemNewIndex, items.value)) {
        return;
    }

    const [item] = items.value.splice(itemIndex, 1);
    items.value.splice(itemNewIndex, 0, item);
    selectedItem.value.index = itemNewIndex;
}

function handleParentClick(event) {
    const isInsideTableRow = event.target.closest('tr');
    const isInsideButton = event.target.closest('button');

    if (!isInsideTableRow && !isInsideButton) {
        clearSelectedItem();
    }
}
</script>

<style scoped>
.configuration-table-action-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center; 
    padding: 16px;
}

.active-row {
    background-color: #f5f5f5;
    color: #000;
}

@media (max-width: 100%) { 
  .configuration-table-action-group {
    flex-direction: column;
    align-items: center; 
  }
}
</style>