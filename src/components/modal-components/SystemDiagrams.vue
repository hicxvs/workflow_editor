<template>
    <div class="system-diagrams-container" data-testid="system-diagrams-container">
        <Modal
            :showCloseButton = "showButton"
            :showSaveButton = "!showButton"
            :showCancelButton = "!showButton"
            v-model="showModal"
        >
            <template #title>
                {{ modalTitle }}
            </template>

            <template #content>
                <TextInput :label="inputLabel" @input="filterDiagrams" :clearHandler="filterDiagrams"/>
                <p class="text-right"> {{ found }} {{ filteredDiagrams?.length || 0 }} {{ searchedMatchingFiles }}</p>
 
                <Table>
                    <template #head-content>
                        <tr>
                            <th class="text-left">{{ tableHeader.processName }}</th>
                            <th class="text-left">{{ tableHeader.processVersion }}</th>
                            <th class="text-left">{{ tableHeader.processAction }}</th>
                        </tr>
                    </template>
                    <template #body-content>
                        <tr
                            v-if="filteredDiagrams && filteredDiagrams.length"
                            v-for="diagram in filteredDiagrams"
                            :key="diagram.name"
                        >
                            <td>{{ diagram.name }}</td>
                            <td>{{ diagram.version }}</td>
                            <td class="text-right">
                                <Button 
                                    :buttonColor="buttonColor"
                                    :label="buttonLabel"
                                    @click="() => { EventBus.emit(EVENT_TYPE.LOAD_DIAGRAM_FROM_SYSTEM, diagram); }"
                                />
                            </td>
                        </tr>
                    </template>
                </Table>

                <p class="text-right" > {{ foundedTotalOf }} {{ systemDiagrams?.length }} {{ matchingFiles }}</p>
            </template>            
        </Modal>        
    </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';
import Modal from '../generic/Modal.vue';
import Table from '../generic/Table.vue';
import TextInput from '../generic/TextInput.vue';
import Button from '../generic/Button.vue';

const systemDiagrams = ref(null);
const filteredDiagrams = ref(null);
const showButton = ref(true);
const showModal = ref(false);  

const modalTitle = "Workflow Search";
const inputLabel = "Search process name";
const tableHeader = {
    processName: 'Process Name',
    processVersion: 'Version',
    processAction: ''
};

const foundedTotalOf = 'Found a total of ';
const found = 'Found: ';
const matchingFiles = 'matching file(s).';
const searchedMatchingFiles = 'searched matching file(s).';

const buttonColor = 'green';
const buttonLabel = 'Load Diagram';

onMounted(() => {
    EventBus.on(EVENT_TYPE.SHOW_DIAGRAMS_FROM_SYSTEM, (diagrams) => {
        systemDiagrams.value = diagrams;
        filteredDiagrams.value = diagrams;
        showModal.value = true;
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