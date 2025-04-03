<template>
  <div class="app-container">
    <ServiceTaskFieldConfigurator />
    <FormPropertyConfigutator />
    <ListenerFieldConfigurator />
    <ListenerConfigurator />
    <SystemDiagrams />
    <Loader />
    <FileInput />
    <Layout />
  </div>
</template>

<script setup>
import ServiceTaskFieldConfigurator from './components/modal-components/ServiceTaskFieldConfigurator.vue';
import FormPropertyConfigutator from './components/modal-components/FormPropertyConfigutator.vue';
import ListenerFieldConfigurator from './components/modal-components/ListenerFieldConfigurator.vue';
import ListenerConfigurator from './components/modal-components/ListenerConfigurator.vue';
import SystemDiagrams from './components/modal-components/SystemDiagrams.vue';
import Loader from './components/singleton-components/Loader.vue';
import FileInput from './components/singleton-components/FileInput.vue';
import Layout from './layout/Layout.vue';
</script>

<style scoped>

</style>
