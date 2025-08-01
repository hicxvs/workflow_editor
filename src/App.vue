<template>
  <div class="app-container">
    <AIPrompter />
    <AlertNotification />
    <Notification />
    <ActionConfirmation />
    <CodeEditor />
    <CallActivityParameterConfigurator />
    <ErrorMessageConfigurator />
    <MessageConfigurator />
    <ServiceTaskFieldConfigurator />
    <FormValueConfigurator />
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
import AIPrompter from './components/modal-components/AIPrompter.vue';
import AlertNotification from './components/singleton-components/AlertNotification.vue';
import Notification from './components/singleton-components/Notification.vue';
import ActionConfirmation from './components/modal-components/ActionConfirmation.vue';
import CodeEditor from './components/modal-components/CodeEditor.vue';
import CallActivityParameterConfigurator from './components/modal-components/CallActivityParameterConfigurator.vue';
import ErrorMessageConfigurator from './components/modal-components/ErrorMessageConfigurator.vue';
import MessageConfigurator from './components/modal-components/MessageConfigurator.vue';
import ServiceTaskFieldConfigurator from './components/modal-components/ServiceTaskFieldConfigurator.vue';
import FormValueConfigurator from './components/modal-components/FormValueConfigurator.vue';
import FormPropertyConfigutator from './components/modal-components/FormPropertyConfigutator.vue';
import ListenerFieldConfigurator from './components/modal-components/ListenerFieldConfigurator.vue';
import ListenerConfigurator from './components/modal-components/ListenerConfigurator.vue';
import SystemDiagrams from './components/modal-components/SystemDiagrams.vue';
import Loader from './components/singleton-components/Loader.vue';
import FileInput from './components/singleton-components/FileInput.vue';
import Layout from './layout/Layout.vue';
</script>

