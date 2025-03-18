<template>
  <div class="app-container">
    <Loader />
    <FileInput />
    <Layout />
  </div>
</template>

<script setup>
import Loader from './components/singleton-components/Loader.vue';
import FileInput from './components/singleton-components/FileInput.vue';
import Layout from './layout/Layout.vue';
</script>

<style scoped>

</style>
