<template>
    <div v-if="loaderVisible" class="loader-container" data-testid="loader-container" >
        <v-progress-circular
            color="cyan"
            indeterminate
        ></v-progress-circular>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import EventBus from "../../eventbus";
import { ApiEngineEventTypes } from "../../api-engine/api-engine-event-types";
const loaderVisible = ref(false);

onMounted(() => {
    EventBus.on(ApiEngineEventTypes.SERVICE_REQUEST_STARTED, () => {
        loaderVisible.value = true;
    });

    EventBus.on(ApiEngineEventTypes.SERVICE_REQUEST_ENDED, () => {
        loaderVisible.value = false;
    });
});

onUnmounted(() => {
    EventBus.off(ApiEngineEventTypes.SERVICE_REQUEST_STARTED);
    EventBus.off(ApiEngineEventTypes.SERVICE_REQUEST_ENDED);
});
</script>

<style scoped>
.loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.6);
}
</style>    


