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
                            <th class="text-left">{{ tableHeader.processSelectVersion }}</th>
                            <th class="text-left">{{ tableHeader.processAction }}</th>
                            <th class="text-left">{{ tableHeader.processDraft }}</th>
                        </tr>
                    </template>
                    <template #body-content v-if="filteredDiagrams && filteredDiagrams.length">
                        <tr                            
                            v-for="diagram in filteredDiagrams"
                            :key="diagram.id"
                        >
                            <td>{{ diagram.id }}</td>
                            <td>{{ diagram.version }}</td>
                            <td>
                                <NumberInput
                                    v-model="diagram.versionToLoad"
                                    :max="diagram.version" 
                                    :min="1" 
                                    :disabled="(diagram.version === -1)"
                                />
                            </td>
                            <td class="text-right">
                                <Button 
                                    :buttonColor="(diagram.version !== -1) ? buttons.loadDiagramDraft.activeColor : buttons.loadDiagramDraft.inactiveColor"                                
                                    :label="buttons.loadDiagram.label"
                                    :disabled="(diagram.version === -1)"
                                    @click="() => {
                                        if((diagram.version === -1)) {
                                            return;
                                        } 
                                        EventBus.emit(EVENT_TYPE.LOAD_DIAGRAM_FROM_SYSTEM, diagram);
                                    }"
                                />
                            </td>
                            <td class="text-right">
                                <Button 
                                    :buttonColor="(diagram.hasDraft) ? buttons.loadDiagramDraft.activeColor : buttons.loadDiagramDraft.inactiveColor"
                                    :label="buttons.loadDiagramDraft.label"
                                    :disabled="!diagram.hasDraft"
                                    @click="() => { 
                                        if(!diagram.hasDraft) {
                                            return;
                                        }                                       

                                        EventBus.emit(EVENT_TYPE.LOAD_DIAGRAM_DRAFT_FROM_SYSTEM, diagram);
                                    }"
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
import NumberInput from '../generic/NumberInput.vue';
import Button from '../generic/Button.vue';

const systemDiagrams = ref(null);
const filteredDiagrams = ref(null);
const showButton = ref(true);
const showModal = ref(false);  

const modalTitle = "Workflow Search";
const inputLabel = "Search process id";
const tableHeader = {
    processName: 'Process Id',
    processVersion: 'Process Version',
    processSelectVersion: 'Select Version to Load',
    processAction: '',
    processDraft: ''
};

const foundedTotalOf = 'Found a total of ';
const found = 'Found: ';
const matchingFiles = 'matching file(s).';
const searchedMatchingFiles = 'searched matching file(s).';

const buttons = {
    loadDiagram: {
        label: 'Load Diagram',
        color: 'green'
    },
    loadDiagramDraft: {
        label: 'Load Draft',
        activeColor: 'green',
        inactiveColor: 'grey'
    },
};

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
        item.id.toLowerCase().includes(filterText.toLowerCase())
    );

    filteredDiagrams.value = result.length > 0 ? result : null;
}
</script>

<style scoped>

</style>