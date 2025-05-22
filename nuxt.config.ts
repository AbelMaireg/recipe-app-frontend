import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  css: ["@/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/apollo",
    "@vee-validate/nuxt",
    "shadcn-nuxt",
  ],
  apollo: {
    clients: {
      default: {
        httpEndpoint: "http://localhost:8081/v1/graphql",
      },
    },
  },
  veeValidate: {
    autoImports: true,
  },
  shadcn: {
    prefix: "",
    componentDir: "components/ui",
  },
});