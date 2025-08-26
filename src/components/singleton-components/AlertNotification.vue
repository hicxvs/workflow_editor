<template>
    <div class="alert-notification-container" data-testid="alert-notification-container">
        <div ref="alertRef" >
            <v-alert
                v-if="showAlert"         
                :title="alertTitle"
                :text="alertText"
                :type="alertType"
                density="compact"
                elevation="6"
                max-width="600"
                closable
                class="draggable-alert"
                @click:close="alertToggleHandler"
            ></v-alert>
            <v-icon
                v-if="showAlertIcon"
                color="warning" 
                icon="fa-solid fa-triangle-exclamation" 
                size="x-large"
                class="draggable-alert draggable-icon"
                title="Double-click to view alert"
                @dblclick="alertToggleHandler"
                >
            </v-icon>
        </div>
        
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import EventBus from '../../eventbus';
import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';
import { NOTIFICATION_TYPE } from '../../bpmn-workflow-editor/modeler/notificationTypes';

const alertRef = ref(null);
const alertTitle = ref(null);
const alertText = ref(null);
const alertType = ref(NOTIFICATION_TYPE.WARNING);
const showAlert = ref(false);
const showAlertIcon = ref(false);

onMounted(() => {
    if(alertRef.value) {
        enableDraggableCapability(alertRef.value);
    }

    EventBus.on(EVENT_TYPE.SHOW_ALERT_NOTIFICATION, (alertToDisplay) => {
        if(!alertToDisplay) {
            clear();
            return;
        }

        alertTitle.value = alertToDisplay.title;
        alertText.value = alertToDisplay.text;
        alertType.value = alertToDisplay.type;
        showAlert.value = true;
        
    });

    EventBus.on(EVENT_TYPE.HIDE_ALERT_NOTIFICATION, () => {
        clear();
    });
});

onUnmounted(() => {
    EventBus.off(EVENT_TYPE.SHOW_ALERT_NOTIFICATION);
    EventBus.off(EVENT_TYPE.HIDE_ALERT_NOTIFICATION);
});

function clear() {
    alertTitle.value = null;
    alertText.value = null;
    alertType.value = NOTIFICATION_TYPE.WARNING;
    showAlert.value = false;
    showAlertIcon.value = false;
}

function enableDraggableCapability(targetElement) {
    targetElement.style.position = 'absolute';
    targetElement.style.cursor = 'move';

    const mouseEvents = {
        move: 'mousemove',
        up: 'mouseup'
    };

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const elWidth = targetElement.offsetWidth;
    const elHeight = targetElement.offsetHeight;

    targetElement.style.left = `${(viewportWidth - elWidth) / 2}px`;
    targetElement.style.top = `${(viewportHeight - elHeight) / 2}px`;

    targetElement.onmousedown = function (event) {
        const offsetX = event.clientX - targetElement.getBoundingClientRect().left;
        const offsetY = event.clientY - targetElement.getBoundingClientRect().top;

        function mouseMoveHandler(event) {
            targetElement.style.left = `${event.clientX - offsetX}px`;
            targetElement.style.top = `${event.clientY - offsetY}px`;
        }

        function mouseUpHandler() {
            document.removeEventListener(mouseEvents.move, mouseMoveHandler);
            document.removeEventListener(mouseEvents.up, mouseUpHandler);
        }

        document.addEventListener(mouseEvents.move, mouseMoveHandler);
        document.addEventListener(mouseEvents.up, mouseUpHandler);
  };
}

function alertToggleHandler() {
  showAlert.value = !showAlert.value;
  showAlertIcon.value = !showAlertIcon.value;
}

</script>

<style scoped>
.draggable-alert {
  z-index: 9999;
}

.draggable-icon {
    scale:2;
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.2));
}
</style>