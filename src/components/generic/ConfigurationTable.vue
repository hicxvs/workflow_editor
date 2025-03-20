<template>
    <div class="configuration-table-container" data-testid="configuration-table-container" @click="handleParentClick">

        <p class="v-card-title">{{ title }}</p>

        <Table>
            <template #head-content>
                <tr>
                    <th class="text-left" 
                        v-if="headers && headers.length"
                        v-for="header in headers"
                        :key="header"
                    >
                        {{ header }}
                    </th>
                </tr>
            </template>
            <template #body-content>
                <tr
                    v-if="items && items.length"
                    v-for="(item, index) in items"
                    :key="item"
                    :class="{'active-row': selectedItem?.index === index}"
                    @click="setSelectedItem(item, index)"
                >
                    <td>{{ item }}</td>
                    <td>{{ item }}</td>
                    <td>{{ item }}</td>
                    <td>{{ item }}</td>
                </tr>
                <tr v-else>
                    <td colspan="4" class="text-center">No items available</td>
                </tr>
            </template>
        </Table>

        <div class="configuration-table-action-group">
            <Button :label="buttonLabels.new" :buttonColor="buttonColors.primary" :clickHandler="buttonClickHandlers.create" />
            <Button :label="buttonLabels.edit" :buttonColor="buttonColors.primary" :clickHandler="buttonClickHandlers.edit" :disabled="!selectedItem" />
            <Button :label="buttonLabels.remove" :buttonColor="buttonColors.primary" :clickHandler="buttonClickHandlers.remove" :disabled="!selectedItem" />
            <Button :label="buttonLabels.up" :buttonColor="buttonColors.primary" :clickHandler="buttonClickHandlers.moveUp" :disabled="!selectedItem" />
            <Button :label="buttonLabels.down" :buttonColor="buttonColors.primary" :clickHandler="buttonClickHandlers.moveDown" :disabled="!selectedItem" />
        </div>      
        
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Table from './Table.vue';
import Button from './Button.vue';

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
    listeners: {
        type: Array,
        required: false,
        default: []
    },
    createNewListenerHandler: {
        type: Function,
        required: false,
        default: () => {
            console.warn("No create new handler provided for the button. Please provide a handler to handle the create new click event.");
        }
    },
    editListenerHandler: {
        type: Function,
        required: false,
        default: (item) => {
            console.warn("No edit handler provided for the button. Please provide a handler to handle the edit click event.", item);
        }
    }
});

const items = ref(props.listeners || []);
const selectedItem = ref(null);

const buttonLabels = {
    new: 'new',
    edit: 'edit',
    remove: 'remove',
    up: 'up',
    down: 'down'
};

const buttonColors = {
    primary: 'cyan'
};

const buttonClickHandlers = {
    create: () => {
        clearSelectedItem();
        props.createNewListenerHandler();
    },
    edit: () => {
        if(!items.value || !selectedItem.value ) {
            return;
        }

        props.editListenerHandler(selectedItem.value);
    },
    remove: () => {
        if(!items.value || !selectedItem.value ) {
            return;
        }

        items.value = items.value.filter(item => item.implementation !== selectedItem.value.item.implementation);
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
    justify-content: flex-start;
    padding: 16px;
}

.active-row {
    background-color: #f5f5f5;
    color: #000; 
}

@media (max-width: 100%) { 
  .configuration-table-action-group {
    flex-direction: column; 
    align-items: stretch;
  }
}

</style>