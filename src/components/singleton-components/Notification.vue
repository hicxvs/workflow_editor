<template>
    <div class="notification-container" data-testid="notification-container">
        <v-snackbar v-model="canShowNotification" 
        :timeout="notificationTimeOut" 
        :timer="true" 
        :color="notificationTypeColor[notificationType].color"
        :attach="OVERLAY_CONTAINER_ID"
        >
            {{ notificationText }}
            <template v-slot:actions>
                <v-btn 
                    color="white"
                    variant="text"
                    @click="closeNotification">Close</v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    import EventBus from '../../eventbus';
    import { EVENT_TYPE } from '../../bpmn-workflow-editor/modeler/eventTypes';
    import { NOTIFICATION_TYPE } from '../../bpmn-workflow-editor/modeler/notificationTypes';
    import { OVERLAY_CONTAINER_ID } from '../../config';

    const defaultTimeOut = '4000';
    const canShowNotification = ref(false);
    const notificationTimeOut = ref(defaultTimeOut);
    const notificationText = ref('Default Notification Text');
    const notificationType = ref(NOTIFICATION_TYPE.INFO);

    const notificationTypeColor = {
        success : {
            color: 'success'
        },
        error : {
            color: 'error'
        },
        warning : {
            color: 'warning'
        },
        info : {
            color: 'info'
        }
    };

    function closeNotification() {
        canShowNotification.value = false;
        notificationTimeOut.value = defaultTimeOut;
        notificationText.value = '';
        notificationType.value = NOTIFICATION_TYPE.INFO;
    }

    onMounted(() => {
        EventBus.on(EVENT_TYPE.SHOW_NOTIFICATION, (notification) => {
            closeNotification();

            if(!notification) {
                return;
            }

            canShowNotification.value = true;
            notificationType.value = notification.type || NOTIFICATION_TYPE.INFO;
            notificationText.value = notification.text || '';
            notificationTimeOut.value = notification.timeout || defaultTimeOut;           
        });
    });

    onUnmounted(() => {
        EventBus.off(EVENT_TYPE.SHOW_NOTIFICATION);
    });
</script>