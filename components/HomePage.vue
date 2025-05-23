<template>
  <div class="p-4 space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex-1 flex justify-center">
        <SearchBar class="w-full max-w-lg" />
      </div>
    </div>

    <div v-for="section in sections" :key="section.key" class="space-y-2">
      <div class="flex justify-between items-center px-1">
        <h2 class="text-lg font-semibold capitalize">{{ section.label }}</h2>
        <NuxtLink :to="section.moreUrl">
          <Button variant="link" size="sm">More</Button>
        </NuxtLink>
      </div>

      <!-- Horizontal List -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <RecipeCard
          v-for="recipe in section.items.slice(0, 4)"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchBar from "@/components/ui/SearchBar.vue"
import { Button } from "@/components/ui/button"
import type Recipe from "@/types/recipe"

const newRecipes = ref<Recipe[]>([])
const likedChefsRecipes = ref<Recipe[]>([])
const likedCategoryRecipes = ref<Recipe[]>([])

onMounted(() => {
  newRecipes.value = fakeRecipes("New")
  likedChefsRecipes.value = fakeRecipes("Chefs")
  likedCategoryRecipes.value = fakeRecipes("Categories")
})

const sections = computed(() => [
  {
    key: "new",
    label: "New Recipes",
    items: newRecipes.value,
    moreUrl: "/recipes/new",
  },
  {
    key: "chefs",
    label: "Liked by Chefs",
    items: likedChefsRecipes.value,
    moreUrl: "/recipes/chefs",
  },
  {
    key: "categories",
    label: "Liked Categories",
    items: likedCategoryRecipes.value,
    moreUrl: "/recipes/categories",
  },
])

function fakeRecipes(prefix: string): Recipe[] {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `${prefix}-${i}`,
    title: `${prefix} Recipe ${i + 1}`,
    author: `Chef ${i + 1}`,
    rating: (i % 5) + 1,
    createdAt: new Date().toISOString(),
    thumbnail: "/public/pexels-abhinavcoca-291528.jpg",
  }))
}
</script>
