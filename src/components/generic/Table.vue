<template>
    <div class="table-container" data-testid="table-container">
        <v-table :hover="enableHover">
            <thead>
                <slot name="head-content">
                    <tr>
                        <th class="text-left">Table default head content</th> 
                    </tr>
                </slot> 
            </thead>
            <tbody>
                <slot name="body-content">
                    <tr>
                        <td class="text-left">Table default body content</td> 
                    </tr>
                </slot>
            </tbody>
        </v-table>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const enableHover = ref(true);


</script>

<style scoped>

</style>