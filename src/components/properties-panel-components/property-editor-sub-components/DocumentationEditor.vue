<template>
    <div class="documentation-editor" data-testid="documentation-editor">
        <Card :title="cardProps.title" :subtitle="cardProps.subtitle" :text="cardProps.text">
            <template #content>
                <div class="documentation-editor-content" data-testid="documentation-editor-content">
                    <TextArea v-if="model" :label="inputLabel.documentation" :model="model.documentation" />
                </div>
            </template>
        </Card>
    </div>
</template> 

<script setup>
import Card from "../../generic/Card.vue";
import TextArea from "../../generic/TextArea.vue";

const model = defineModel();

const cardProps = {
    title: "Documentation",
    subtitle: "",
    text: ""
};

const inputLabel = {
    documentation: "Documentation"
};
</script>

<style scoped>
.documentation-editor-content {
    padding: 0 16px;
}
</style>