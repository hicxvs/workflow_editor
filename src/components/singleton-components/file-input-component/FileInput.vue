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
import EventBus from "../../../eventbus";
import { FILE_INPUT_EVENT_TYPE } from "./file-input-event-type";
const fileInput = ref(null);

const props = defineProps({
    acceptedFiles: {
        type: String,
        required: false,
        default: ".bpmn,.xml"
    },
    callbackHandler: {
        type: Function,
        required: false,
        default: () => { console.warn("No callback handler provided"); }
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

        props.callbackHandler({
            file,
            content
        });
        clearFile();
    } catch (error) {
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

