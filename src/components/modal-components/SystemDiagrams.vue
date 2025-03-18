<template>
    <div class="system-diagrams-container" data-testid="system-diagrams-container">
        <Modal
            :showCloseButton = "showButton"
            :showSaveButton = "!showButton"
            :showCancelButton = "!showButton"
        >
            <template #title>
                {{ modalTitle }}
            </template>

            <template #content>
                <TextInput :label="inputLabel" @input="filterDiagrams" :clearHandler="filterDiagrams"/>
                <p class="text-right"> {{ found }} {{ filteredDiagrams?.length || 0 }} {{ matchingFiles }}</p>
                
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-left">{{ tableHeader.processName }}</th>
                            <th class="text-left">{{ tableHeader.processVersion }}</th>
                            <th class="text-left">{{ tableHeader.processAction }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-if="filteredDiagrams && filteredDiagrams.length"
                            v-for="diagram in filteredDiagrams"
                            :key="diagram.name"
                        >
                            <td>{{ diagram.name }}</td>
                            <td>{{ diagram.version }}</td>
                            <td>
                                <Button 
                                    :buttonColor="buttonColor"
                                    :label="buttonLabel"
                                    :clickHandler="() => { EventBus.emit(EVENT_TYPE.LOAD_DIAGRAM_FROM_SYSTEM, diagram); }"
                                />
                            </td>
                        </tr>
                    </tbody>
                </v-table>

                <p class="text-right" > {{ foundedTotalOf }} {{ systemDiagrams.length }} {{ matchingFiles }}</p>
            </template>
            
        </Modal>
        
    </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';
import Modal from '../singleton-components/Modal.vue';
import TextInput from '../generic/TextInput.vue';
import Button from '../generic/Button.vue';

const systemDiagrams = ref(null);
const filteredDiagrams = ref(null);
const showButton = ref(true);

const modalTitle = "Workflow Search";
const inputLabel = "Search process name";
const tableHeader = {
    processName: 'Process Name',
    processVersion: 'Version',
    processAction: ''
};

const foundedTotalOf = 'Found a total of ';
const found = 'Found: ';
const matchingFiles = 'matching files.';

const buttonColor = 'green';
const buttonLabel = 'Load Diagram';

onMounted(() => {
    EventBus.on(EVENT_TYPE.SHOW_DIAGRAMS_FROM_SYSTEM, (diagrams) => {
        systemDiagrams.value = diagrams;
        filteredDiagrams.value = diagrams;
        EventBus.emit(EVENT_TYPE.OPEN_MODAL);
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.SHOW_DIAGRAMS_FROM_SYSTEM);
});

function filterDiagrams(event) { 
    const filterText = event?.target?.value;

    if (!filterText) {
        filteredDiagrams.value = systemDiagrams.value;
        return;
    }

    const result = systemDiagrams.value.filter(item =>
        item.name.toLowerCase().includes(filterText.toLowerCase())
    );

    filteredDiagrams.value = result.length > 0 ? result : null;
}
</script>

<style scoped>

</style>