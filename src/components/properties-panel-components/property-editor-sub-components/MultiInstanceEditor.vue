<template>
    <div class="multi-instance-panel-container" data-testid="multi-instance-panel-container">
        <Card :title="cardProps.title" :subtitle="cardProps.subtitle" :text="cardProps.text">
            <template #content>
                <div v-if="model" class="main-instance-content" data-testid="main-instance-content">
                    {{ model }}
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

import Card from '../../generic/Card.vue';

const model = defineModel();

const cardProps = {
    title: "Main Instance",
    subtitle: "",
    text: ""
};

</script>

<style scoped>
.main-instance-content {
    padding: 0 16px;
}

</style>