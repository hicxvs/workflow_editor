<template>
    <div  class="expansion-panel-container" data-testid="expansion-panel-container">
        <v-expansion-panel>
            <v-expansion-panel-title>
                <div class="expansion-panel-title-container" data-testid="expansion-panel-title-container">
                    <slot name="title"></slot>
                </div>               
            </v-expansion-panel-title>
            <v-expansion-panel-text>
                <div class="expansion-panel-content-container" data-testid="expansion-panel-content-container">
                    <slot name="content"></slot>
                </div>             
            </v-expansion-panel-text>
        </v-expansion-panel>
    </div>
</template>

<script setup>
</script>

<style scoped>
</style>