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
                {{ item.id }}<span v-if="item.loadedVersion">&nbsp;- V{{ item.loadedVersion }}</span>
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
import { NOTIFICATION_TYPE } from '../../bpmn-workflow-editor/modeler/notificationTypes';

const items = ref(null);
const activeTab = ref(null);

onMounted(() => {
    EventBus.on(EVENT_TYPE.GET_ALL_MANAGER_DIAGRAMS, (localSessionDiagrams) => {
        if(!localSessionDiagrams || !localSessionDiagrams.length) {
            clear();
            EventBus.emit(EVENT_TYPE.HIDE_SYSTEM_DRAFT_OPTIONS);            
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
        activeTab.value = null;
        return;
    }

    activeTab.value = selectedItem.managerId;
    EventBus.emit(EVENT_TYPE.GET_DIAGRAM_FROM_MANAGER_DIAGRAMS, selectedItem.managerId);
    EventBus.emit(EVENT_TYPE.HIDE_ALERT_NOTIFICATION);

    if(!selectedItem?.isLatestVersion) {
        EventBus.emit(EVENT_TYPE.SHOW_ALERT_NOTIFICATION, {
            title: 'Outdated Workflow Version',
            text: `You're currently working on an older version of the workflow. Consider switching to the latest version for up-to-date changes.`,
            type: NOTIFICATION_TYPE.WARNING
        });
    }
}

watch(
    () => items,
    () => {

        if(!items.value) {
            clear();
            EventBus.emit(EVENT_TYPE.HIDE_SYSTEM_DRAFT_OPTIONS);
            return;
        }

        const selectedItem = items.value.find(item => item.active === true) || items.value[items.value?.length - 1];
        handleItemSelection(selectedItem);
        EventBus.emit(EVENT_TYPE.SHOW_SYSTEM_DRAFT_OPTIONS);
    },
    { immediate:true, deep:true }
);
</script>