import { createApp } from 'vue';
import { createPinia } from 'pinia';

import './style.css';

import LanguageResources from './language-resources';

// Vuetify
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import App from './App.vue';

const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
  });

createApp(App)
.use(LanguageResources)
.use(createPinia())
.use(vuetify)
.mount('#app');
