import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,vue}"]},
  { languageOptions: { globals: { ...globals.browser, Hicx: "readonly" } } },
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    plugins: {
      "vue": pluginVue
    },
    rules: {
        "no-unused-vars": "warn",
        "no-undef": "warn",
        "semi": ["error", "always"],
        "vue/multi-word-component-names": "off",
        "vue/require-valid-default-prop": "warn",
        "no-prototype-builtins": "off"
    }
  }
];
