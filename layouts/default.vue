<template>
  <div class="min-h-screen flex flex-col bg-background text-foreground">
    <header class="flex items-center justify-between px-4 py-3 shadow-md">
      <Button variant="ghost" size="icon" @click="toggleSidebar">
        <Icon name="mdi:menu" class="w-6 h-6" />
      </Button>

      <NuxtLink to="/" class="text-xl font-bold tracking-tight">
        Foodology
      </NuxtLink>

      <Button variant="ghost" size="icon">
        <Icon name="mdi:account-circle" class="w-6 h-6" />
      </Button>
    </header>

    <aside
      v-if="showSidebar"
      class="bg-accent text-accent-foreground w-64 p-4 fixed top-0 left-0 h-full z-20 shadow-md"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Menu</h2>
        <Button variant="ghost" size="icon" @click="toggleSidebar">
          <Icon name="mdi:close" class="w-5 h-5" />
        </Button>
      </div>
      <ul class="space-y-2">
        <li><NuxtLink to="/" class="hover:underline">Home</NuxtLink></li>
        <li>
          <NuxtLink to="/recipes" class="hover:underline">Recipes</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/profile" class="hover:underline">Profile</NuxtLink>
        </li>
      </ul>
    </aside>

    <div
      v-if="showSidebar"
      class="fixed inset-0 bg-black/50 z-10"
      @click="toggleSidebar"
    />

    <main class="flex-1 p-4 pt-6">
      <slot />
    </main>

    <footer
      class="text-center text-sm text-muted-foreground py-4 border-t mt-auto"
    >
      © {{ new Date().getFullYear() }} My Recipes. All rights reserved.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { Button } from "@/components/ui/button"

const showSidebar = ref(false)

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}
</script>
