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
      entry: './src/main.js', // Adjust this to your entry file path
      name: 'WorkflowEditorApp',       // Global variable for your library
      formats: ['umd'],       // Output format as UMD
      fileName: (format) => `workflowEditorApp.${format}.js`,
    },
    rollupOptions: {
      // Externalize dependencies that shouldn't be bundled
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue', // Ensure Vue is available globally
        },
      },
    },
  },
});