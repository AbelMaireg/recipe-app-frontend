<template>
  <Card
    class="w-80 h-96 p-0 overflow-hidden bg-red-50 dark:bg-red-950 shadow-lg transition-shadow hover:shadow-xl rounded-lg"
  >
    <img
      :src="thumbnail"
      :alt="recipe.title"
      class="w-full h-48 object-cover rounded-t-lg"
      loading="lazy"
    />
    <CardContent class="p-4 flex flex-col gap-2">
      <CardTitle class="text-xl font-display text-primary line-clamp-1">
        {{ recipe.title }}
      </CardTitle>
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted-foreground">
          By {{ recipe.author }}
        </span>
      </div>
      <div class="flex items-center gap-1">
        <span v-for="n in 5" :key="n" class="text-yellow-400">
          <Icon
            v-if="n <= recipe.rating"
            name="typcn:star-full-outline"
            class="w-5 h-5"
          />
          <Icon v-else name="typcn:star-outline" class="w-5 h-5" />
        </span>
        <span class="text-sm text-muted-foreground">
          ({{ recipe.rating }}/5)
        </span>
      </div>
      <div class="text-sm text-muted-foreground">
        {{ formattedDate }}
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import type Recipe from "@/types/recipe"

const props = defineProps<{
  recipe: Recipe
}>()

const thumbnail = ref<string>("")
const formattedDate = ref("")

onMounted(() => {
  thumbnail.value = getImageUrl(props.recipe.thumbnail)
  formattedDate.value = formatDate(props.recipe.createdAt)
  console.log(thumbnail.value)
})
</script>

<style scoped>
.font-display {
  font-family: "Playfair Display", serif;
}
</style>
