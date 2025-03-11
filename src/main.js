import { createApp } from 'vue';
import { createPinia } from 'pinia';

import './style.css';

import LanguageResources from './language-resources';

import App from './App.vue';

createApp(App)
.use(LanguageResources)
.use(createPinia())
.mount('#app');
