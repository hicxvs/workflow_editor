<template>
    <div class="tab-panels-container" data-testid="tab-panels-container">
        <v-tabs 
            center-active
            show-arrows
        >
            <v-tab
                v-if="items" 
                v-for="(item, index) in items" 
                :key="index" 
                :value="item.managerId"
                @click="() => { EventBus.emit(EVENT_TYPE.GET_DIAGRAM_FROM_MANAGER_DIAGRAMS, item); }"
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
                        EventBus.emit(EVENT_TYPE.REMOVE_DIAGRAM_FROM_MANAGER_DIAGRAMS, item);                                                
                    }"
                >
                </v-btn>
            </v-tab>
        </v-tabs>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';

const items = ref(null);

onMounted(() => {
    EventBus.on(EVENT_TYPE.GET_ALL_MANAGER_DIAGRAMS, (localSessionDiagrams) => {
        if(!localSessionDiagrams || !localSessionDiagrams.length) {
            items.value = null;
            return;
        }

        items.value = localSessionDiagrams;
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.GET_ALL_MANAGER_DIAGRAMS);
});

</script>