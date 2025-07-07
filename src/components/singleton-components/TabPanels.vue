<template>
    <div class="tab-panels-container" data-testid="tab-panels-container">
        <v-tabs 
            center-active
            show-arrows
            color="green"
            v-model="activeTab"
        >
            <v-tab               
                v-for="(item, index) in items" 
                :key="index" 
                :value="item.managerId"
                @click="(event) => {
                    event.stopPropagation();
                    handleItemSelection(item);
                }"
                >
                {{ item.id }}
                <v-btn 
                    class="ml-2"
                    icon="mdi-close"
                    size="x-small"
                    density="comfortable"
                    color="orange-darken-4"
                    flat
                    @click="(event) => {
                        event.stopPropagation();
                        EventBus.emit(EVENT_TYPE.REMOVE_DIAGRAM_FROM_MANAGER_DIAGRAMS, item.managerId);                                                
                    }"
                >
                </v-btn>
            </v-tab>
        </v-tabs>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';

const items = ref(null);
const activeTab = ref(null);

onMounted(() => {
    EventBus.on(EVENT_TYPE.GET_ALL_MANAGER_DIAGRAMS, (localSessionDiagrams) => {
        if(!localSessionDiagrams || !localSessionDiagrams.length) {
            clear();            
            return;
        }

        items.value = localSessionDiagrams;        
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.GET_ALL_MANAGER_DIAGRAMS);
});

function clear() {
    items.value = null;
    activeTab.value = null;
}

function handleItemSelection(selectedItem) {   
    if(!selectedItem) {
        activeTab.value = items.value[items.value?.length - 1].managerId;
        return;
    }

    activeTab.value = selectedItem.managerId;
    EventBus.emit(EVENT_TYPE.GET_DIAGRAM_FROM_MANAGER_DIAGRAMS, selectedItem.managerId);
    EventBus.emit(EVENT_TYPE.HIDE_SYSTEM_DRAFT_OPTIONS);

    if(selectedItem?.showSystemDraftOperations) {
        EventBus.emit(EVENT_TYPE.SHOW_SYSTEM_DRAFT_OPTIONS);
    }
}

watch(
    () => items,
    () => {
        if(!items.value) {
            clear();
            return;
        }

        const currentlyActiveItem = items.value.find(item => item.active === true);
        handleItemSelection(currentlyActiveItem);
    },
    { immediate:true, deep:true }
);
</script>