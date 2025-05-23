<script setup lang="ts">
import { onMounted, ref } from "vue"
import { watchOnce } from "@vueuse/core"
import { useRoute } from "vue-router"
import type Recipe from "@/types/recipe"
import type Chef from "@/types/chef"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type RecipeStep from "~/types/recipeSteps"

const route = useRoute()

const recipe = ref<Recipe | null>(null)
const error = ref<string | null>(null)
const thumbnail = ref("")
const formattedDate = ref("")
const stringArray: string[] = []
const pictures = ref(stringArray)

onMounted(async () => {
  try {
    const id = route.params.id as string
    recipe.value = await fetchRecipeById(id)

    if (!recipe.value) throw new Error("Recipe not found")
  } catch (err: any) {
    error.value = err.message || "An error occurred while loading recipe."
    console.log(err)
  }

  thumbnail.value = getImageUrl(recipe.value?.thumbnail || "")
  formattedDate.value = formatDate(recipe.value?.createdAt || "")
  recipe.value?.pictures.forEach((picture) => {
    pictures.value.push(getImageUrl(picture))
  })
})

async function fetchRecipeById(id: string): Promise<Recipe | null> {
  return {
    id,
    title: "Seefood",
    creator: {
      id: "chef-1",
      name: "Chef John Doe",
    } as Chef,
    thumbnail: "9f4bdd4e-28fc-45ad-9d88-d6bf228def2b",
    pictures: [
      "9f4bdd4e-28fc-45ad-9d88-d6bf228def2b",
      "9f4bdd4e-28fc-45ad-9d88-d6bf228def2b",
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
    rating: Math.floor(Math.random() * 5) + 1,
    likeCount: 200,
    steps: [
      {
        id: "id",
        index: 1,
        description: "do this and that",
      } as RecipeStep,
      {
        id: "id",
        index: 2,
        description: "do this and that",
      } as RecipeStep,
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

const emblaMainApi = ref<CarouselApi>()
const emblaThumbnailApi = ref<CarouselApi>()
const selectedIndex = ref(0)

function onSelect() {
  if (!emblaMainApi.value || !emblaThumbnailApi.value) return
  selectedIndex.value = emblaMainApi.value.selectedScrollSnap()
  emblaThumbnailApi.value.scrollTo(emblaMainApi.value.selectedScrollSnap())
}

function onThumbClick(index: number) {
  if (!emblaMainApi.value || !emblaThumbnailApi.value) return
  emblaMainApi.value.scrollTo(index)
}

watchOnce(emblaMainApi, (emblaMainApi) => {
  if (!emblaMainApi) return

  onSelect()
  emblaMainApi.on("select", onSelect)
  emblaMainApi.on("reInit", onSelect)
})
</script>

<template>
  <NuxtLayout>
    <div class="max-w-4xl mx-auto p-6 space-y-6">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-sm text-primary hover:underline"
      >
        <Icon name="mdi:arrow-left" class="w-4 h-4" />
        Back to home
      </NuxtLink>

      <div v-if="error" class="text-center text-destructive">
        {{ error }}
      </div>

      <div v-else-if="recipe" class="space-y-4">
        <div class="flex flex-col items-center space-y-2">
          <Carousel
            class="relative w-full max-w-2xl"
            @init-api="(val) => (emblaMainApi = val)"
          >
            <CarouselContent>
              <CarouselItem v-for="(url, index) in pictures" :key="index">
                <AspectRatio :ratio="16 / 9" class="bg-muted">
                  <img
                    :src="url"
                    :alt="recipe.title"
                    class="rounded-md object-cover w-full h-full"
                  />
                </AspectRatio>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <Carousel
            class="relative w-full max-w-xs"
            @init-api="(val) => (emblaThumbnailApi = val)"
          >
            <CarouselContent class="flex gap-1 ml-0">
              <CarouselItem
                v-for="(url, index) in pictures"
                :key="index"
                class="pl-0 basis-1/4 cursor-pointer"
                @click="onThumbClick(index)"
              >
                <AspectRatio :ratio="1 / 1" class="bg-muted">
                  <img
                    :src="url"
                    alt="recipe.title"
                    class="rounded-md object-cover w-full h-full"
                  />
                </AspectRatio>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>

        <div class="space-y-2">
          <h1 class="text-3xl font-bold text-primary">{{ recipe.title }}</h1>
          <div class="text-sm text-muted-foreground">
            By {{ recipe.creator.name }} · {{ formattedDate }}
          </div>
          <div class="flex items-center gap-1 text-yellow-500">
            <Icon
              v-for="n in 5"
              :key="n"
              :name="n <= recipe.rating ? 'mdi:star' : 'mdi:star-outline'"
              class="w-5 h-5"
            />
            <span class="text-sm text-muted-foreground">
              ({{ recipe.rating }}/5)
            </span>
          </div>
        </div>

        <Table>
          <TableCaption>A list of ingredients.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead> Name </TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="(ingredient, index) in recipe.ingredients"
              :key="index"
            >
              <TableCell class="font-medium">
                {{ ingredient.name }}
              </TableCell>
              <TableCell>{{ ingredient.quantity }}</TableCell>
              <TableCell>{{ ingredient.unit }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div v-if="recipe.steps?.length" class="space-y-1">
          <h2 class="text-xl font-semibold mt-4">Steps</h2>
          <ol class="list-decimal list-inside space-y-1 text-muted-foreground">
            <li v-for="(step, index) in recipe.steps" :key="index">
              <Card
                class="flex flex-col md:flex-row gap-4 p-4 bg-background shadow-sm border rounded-xl"
              >
                <div v-if="step.picture" class="w-full md:w-40">
                  <AspectRatio
                    :ratio="1 / 1"
                    class="bg-muted rounded-md overflow-hidden"
                  >
                    <img
                      :src="getImageUrl(step.picture)"
                      :alt="`Step ${step.index}`"
                      class="object-cover w-full h-full"
                    />
                  </AspectRatio>
                </div>

                <div class="flex-1 space-y-2">
                  <h3 class="text-lg font-semibold text-primary">
                    Step {{ step.index }}
                  </h3>
                  <p class="text-sm text-muted-foreground">
                    {{ step.description }}
                  </p>
                </div>
              </Card>
            </li>
          </ol>
        </div>
      </div>

      <div v-else class="text-center text-muted-foreground">Loading...</div>
    </div>
  </NuxtLayout>
</template>
