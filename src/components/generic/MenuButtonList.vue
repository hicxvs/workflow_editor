<template>
    <div class="menu-button-list-container" data-testid="menu-button-list-container">
        <v-menu offset-y>
            <template v-slot:activator="{ props }">
                <v-btn v-bind="props">{{ label }}</v-btn>
            </template>
            <v-list>
                <v-list-item v-for="item in items" :key="item.label">
                    <v-btn block flat @click="item.handler" class="left-align">{{ item.label }}</v-btn>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script setup>
    defineProps({
        label: {
            type: String,
            required: false,
            default: 'Default Menu Button Label'
        },
        items: {
            type: Array,
            required: false,
            default: () => [
                {
                    label: 'Default Button Label',
                    handler: () => {console.log('Default Button Click Handler');}
                }
            ]
        },
    });


</script>

<style scoped>
.left-align {
  text-align: left;
  justify-content: flex-start;
}
</style>