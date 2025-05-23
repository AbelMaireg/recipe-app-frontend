<script setup lang="ts">
import type Recipe from "@/types/recipe"
const section = defineModel("section", {
  required: true,
})

const recipe = {
  id: "21c2c825-dfae-4d43-8444-7e42df3d0ff2",
  title: "Seefood",
  creator: {
    id: "chef-1",
    name: "Chef John Doe",
  },
  thumbnail: "9f4bdd4e-28fc-45ad-9d88-d6bf228def2b",
  pictures: [
    "9f4bdd4e-28fc-45ad-9d88-d6bf228def2b",
    "9f4bdd4e-28fc-45ad-9d88-d6bf228def2b",
    "9f4bdd4e-28fc-45ad-9d88-d6bf228def2b",
    "9f4bdd4e-28fc-45ad-9d88-d6bf228def2b",
  ],
  preparationTime: "30 minutes",
  ingredients: [
    {
      id: "id1",
      name: "sugar",
      unit: "spoon",
      quantity: 2,
    },
    {
      id: "id2",
      name: "water",
      unit: "glass",
      quantity: 2,
    },
  ],
  steps: [
    {
      id: "id",
      index: 1,
      description: "do this and that",
    },
    {
      id: "id",
      index: 2,
      description: "do this and that",
    },
  ],
  rating: 4.5,
  likeCount: 22,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
} as Recipe
</script>

<template>
  <div class="flex flex-col space-y-2 mx-auto max-w-340">
    <div class="flex justify-between">
      <h2 class="text-lg font-semibold capitalize">{{ section }}</h2>
      <Button>more</Button>
    </div>
    <div class="flex flex-row flex-wrap gap-4 justify-center">
      <div v-for="_ in 4" key="index">
        <RecipeCard :recipe="recipe" />
      </div>
    </div>
  </div>
</template>
