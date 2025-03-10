import { createI18n } from 'vue-i18n';
import messages from './messages';

const engine = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    globalInjection: true,
    messages
});

export default engine;