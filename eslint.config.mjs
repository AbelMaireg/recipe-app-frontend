import withNuxt from "./.nuxt/eslint.config.mjs"
import eslintPluginPrettier from "eslint-plugin-prettier/recommended"

export default withNuxt(eslintPluginPrettier, {
  files: ["**/*.ts", "**/*.js", "**/*.vue"],
  rules: {
    "prettier/prettier": "error",
    "vue/multi-word-component-names": "off",
    "no-unused-vars": ["error", { varsIgnorePattern: "^_" }],
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
  },
})
