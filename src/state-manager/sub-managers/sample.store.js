import {ref} from "vue";

export const SampleStoreIdentifier = 'sample-store';

export function SampleStore() {

    const sampleState = ref({
        sampleValue: 'Hello World'
    });

    async function fetchSampleData() {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
        const data = await response.json();
        sampleState.value.sampleValue = data.title;
    }

    return {
        sampleState,
        fetchSampleData
    };
}
