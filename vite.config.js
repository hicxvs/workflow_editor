import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/workflow-editor/',
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  plugins: [vue()],
  build: {
    lib: {
      entry: './src/main.js',
      name: 'WorkflowEditorApp',
      formats: ['umd'],
      fileName: (format) => `x-workflow-editor.${format}.min.js`,
    },
    minify: true,
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'x-workflow-editor.css';
          }
          return assetInfo.name;
        },

      },
    },
  },
});