<template>
    <div class="file-input-container" data-testid="file-input-container">
        <input type="file" 
            class="file-input"
            ref="fileInput" 
            @change="loadFile" 
            :accept="acceptedFiles" 
        />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import EventBus from "../../../eventbus";
import { FILE_INPUT_EVENT_TYPE } from "./file-input-event-type";
const fileInput = ref(null);

const props = defineProps({
    acceptedFiles: {
        type: String,
        required: false,
        default: ".bpmn,.xml"
    }
});

onMounted(() => {
    EventBus.on(FILE_INPUT_EVENT_TYPE.LOAD_FILE, () => {
        fileInput.value.click();
    });
});

onUnmounted(() => {
    EventBus.off(FILE_INPUT_EVENT_TYPE.LOAD_FILE);
});


async function loadFile(event) {
    try {
        if (!props.acceptedFiles.includes(file.type)) {
            throw new Error("File type not supported");
        }

        const file = event.target.files[0];

        if (!file) {
            throw new Error("No file selected");
        }

        const content = await file.text();

        EventBus.emit(FILE_INPUT_EVENT_TYPE.LOAD_FILE_SUCCESS, {
            file,
            content
        });

        clearFile();
    } catch (error) {

        EventBus.emit(FILE_INPUT_EVENT_TYPE.LOAD_FILE_ERROR, error);
        clearFile();
        throw new Error("Error loading file", error);
    }
}

function clearFile() {
    fileInput.value.value = null;
}

</script>

<style scoped>
.file-input {
    display: none;
}
</style>

