<template>
    <div class="action-button-group" data-testid="action-button-group">
        <Button :label="buttonLabels.generateXML" :buttonColor="buttonColors.primary" :clickHandler="buttonClickHandlers.generateXML" />
        <Button :label="buttonLabels.clearXML" :buttonColor="buttonColors.grey" :clickHandler="buttonClickHandlers.clearXML" />
        <Button v-if="!isExpanded" :label="buttonLabels.expandPanel" :buttonColor="buttonColors.cyan" :clickHandler="buttonClickHandlers.expandPanel" />
        <Button v-else :label="buttonLabels.collapsePanel" :buttonColor="buttonColors.cyan" :clickHandler="buttonClickHandlers.collapsePanel" />
    </div>
</template>

<script setup>
import { ref } from "vue";
import Button from "../generic/Button.vue";
import { EVENT_TYPE } from "../../bpmn-workflow-editor/modeler/eventTypes";
import EventBus from "../../eventbus";

const isExpanded = ref(false);

const buttonColors = {
    primary: "primary",
    grey: "grey",
    cyan: "cyan"
};

const buttonLabels = {
    generateXML: "Generate XML",
    clearXML: "Clear XML",
    expandPanel: "Expand Panel",
    collapsePanel: "Collapse Panel"
};

const buttonClickHandlers = {
    generateXML: () => EventBus.emit(EVENT_TYPE.GENERATE_DIAGRAM),
    clearXML: () => EventBus.emit(EVENT_TYPE.CLEAR_DIAGRAM),
    expandPanel: () => {
        console.log("Expand Panel");
        isExpanded.value = true;    
    },
    collapsePanel: () => {
        console.log("Collapse Panel");
        isExpanded.value = false;
    }
};      
</script>

<style scoped>
.action-button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; 
  justify-content: flex-start; 
}

.action-button-group > * {
  flex: 0 1 auto; 
  min-width: 100px;
}

@media (max-width: 600px) { 
  .action-button-group {
    flex-direction: column; 
    align-items: stretch;
  }
}
</style>

