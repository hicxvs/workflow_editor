import { createApp } from 'vue';
import { createPinia } from 'pinia';

import './style.css';

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
.use(createPinia())
.use(vuetify)
.mount('#app');
