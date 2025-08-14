<template>
    <div class="menu-button-list-container" data-testid="menu-button-list-container">
        <v-menu offset-y>
            <template v-slot:activator="{ props }">
                <v-btn v-bind="props" variant="tonal" class="button-bottom-border">{{ label }}</v-btn>
            </template>
            <v-list>
                <v-list-item v-for="item in items" :key="item.label">
                    <v-btn block flat @click="item.handler" :disabled="item.disabled" class="left-align">{{ item.label }}</v-btn>
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
                    disabled: false,
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

.button-bottom-border {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2); 
  transition: border-bottom-color 0.2s ease;
}

.button-bottom-border:hover {
  border-bottom-color: rgba(0, 0, 0, 0.4);
}


</style>