<script setup lang="ts">
const route = useRoute()
const isSignin = route.path.includes("signin")
</script>

<template>
  <div class="h-screen flex items-center justify-center bg-muted px-4">
    <div
      class="w-full max-w-md bg-background p-8 rounded-2xl shadow-lg border space-y-6"
    >
      <!-- Logo -->
      <div class="flex justify-center">
        <NuxtLink to="/">
          <img
            src="/logo.png"
            alt="Logo"
            class="h-12 hover:opacity-80 transition-opacity"
          />
        </NuxtLink>
      </div>

      <!-- Slot for auth form -->
      <slot />

      <!-- Switch and Home Links -->
      <div class="text-center text-sm text-muted-foreground space-y-2">
        <p>
          <NuxtLink
            v-if="isSignin"
            to="/auth/signup"
            class="text-primary hover:underline"
          >
            Don't have an account? Sign up
          </NuxtLink>
          <NuxtLink
            v-else
            to="/auth/signin"
            class="text-primary hover:underline"
          >
            Already have an account? Sign in
          </NuxtLink>
        </p>
        <NuxtLink to="/" class="hover:underline text-xs text-muted-foreground">
          Back to homepage
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
