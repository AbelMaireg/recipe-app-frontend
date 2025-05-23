<template>
  <div class="p-4 space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex-1 flex justify-center">
        <SearchBar class="w-full max-w-lg" />
      </div>
    </div>

    <div v-for="section in sections" :key="section" class="space-y-2">
      <RecipeSection :section="section" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchBar from "@/components/ui/SearchBar.vue"

onMounted(() => {})

const sections = ["recent", "recommended", "popular"]
</script>
