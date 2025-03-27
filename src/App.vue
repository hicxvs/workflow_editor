<template>
  <div class="app-container">
    <FormPropertyConfigutator />
    <FieldConfigurator />
    <ListenerConfigurator />
    <SystemDiagrams />
    <Loader />
    <FileInput />
    <Layout />
  </div>
</template>

<script setup>
import FormPropertyConfigutator from './components/modal-components/FormPropertyConfigutator.vue';
import FieldConfigurator from './components/modal-components/FieldConfigurator.vue';
import ListenerConfigurator from './components/modal-components/ListenerConfigurator.vue';
import SystemDiagrams from './components/modal-components/SystemDiagrams.vue';
import Loader from './components/singleton-components/Loader.vue';
import FileInput from './components/singleton-components/FileInput.vue';
import Layout from './layout/Layout.vue';
</script>

<style scoped>

</style>
