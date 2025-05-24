<script setup lang="ts">
import { h, computed } from "vue"
import { toTypedSchema } from "@vee-validate/zod"
import { useForm, useFieldArray } from "vee-validate"
import * as zod from "zod"
import { useFilter } from "reka-ui"
import { Check } from "lucide-vue-next"
import { toast } from "vue-sonner"
import { cn } from "@/lib/utils"
import type RecipeSteps from "@/types/recipeSteps"
import type Ingredient from "@/types/ingredient"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox"
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from "@/components/ui/tags-input"

const formSchema = toTypedSchema(
  zod.object({
    title: zod.string().min(2),
    category: zod.string().min(1),
    ingredients: zod
      .array(
        zod.object({
          name: zod.string().min(1),
          quantity: zod.string().min(1),
          unit: zod.string().min(1),
        }),
      )
      .min(1),
    steps: zod.array(zod.string().min(1)).min(1),
    pictures: zod.array(zod.instanceof(File)).min(1),
    thumbnail: zod.string().min(1),
    tags: zod.array(zod.string()).optional(),
  }),
)

const tags = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten-free", label: "Gluten Free" },
  { value: "dairy-free", label: "Dairy Free" },
  { value: "low-carb", label: "Low Carb" },
  { value: "keto", label: "Keto" },
  { value: "paleo", label: "Paleo" },
  { value: "quick", label: "Quick & Easy" },
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
]

const categories = [
  { label: "dessert", value: "Dessert" },
  { label: "vegan", value: "Vegan" },
  { label: "snack", value: "Snack" },
]

const ingredientUnits = [
  "grams",
  "kilograms",
  "milliliters",
  "liters",
  "teaspoon",
  "tablespoon",
  "cup",
  "piece",
  "pinch",
  "to taste",
]

onMounted(async () => {
  setFieldValue("title", "Some Food")
  setFieldValue("category", categories[0].label)
  setFieldValue("steps", ["do this", "do that"])
  setFieldValue("tags", [tags[0].label, tags[1].label])
  setFieldValue("ingredients", [
    { name: "floor", quantity: "1", unit: "kilograms" },
  ])
})

const { handleSubmit, values, errors, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    ingredients: [{ name: "", quantity: "", unit: "" }],
    steps: [""],
    tags: [],
  },
})

const {
  fields: ingredientFields,
  push: addIngredient,
  remove: removeIngredient,
} = useFieldArray<Ingredient>("ingredients")

const {
  fields: stepFields,
  push: addStep,
  remove: removeStep,
} = useFieldArray<RecipeSteps>("steps")

const picturePreviewUrls = ref<string[]>([])

const tagsValue = computed({
  get: () => values.tags || [],
  set: (val: string[]) => setFieldValue("tags", val),
})

const tagDropOpen = ref(false)
const searchTerm = ref("")

const { contains } = useFilter({ sensitivity: "base" })
const filteredTags = computed(() => {
  const options = tags.filter((i) => !tagsValue.value.includes(i.label))
  return searchTerm.value
    ? options.filter((option) => contains(option.label, searchTerm.value))
    : options
})

function handlePictureChange(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files ? Array.from(input.files) : []
  setFieldValue("pictures", files)

  picturePreviewUrls.value = []
  files.forEach((file) => {
    const url = URL.createObjectURL(file)
    picturePreviewUrls.value.push(url)
  })

  if (files.length > 0) setFieldValue("thumbnail", files[0].name)
}
function insertStepBefore(index: number) {
  const newSteps = [...(values.steps || [])]
  newSteps.splice(index, 0, "")
  setFieldValue("steps", newSteps)
}

function moveStepUp(index: number) {
  if (index === 0) return
  const newSteps = [...(values.steps || [])]
  const temp = newSteps[index]
  newSteps[index] = newSteps[index - 1]
  newSteps[index - 1] = temp
  setFieldValue("steps", newSteps)
}

function moveStepDown(index: number) {
  if (!values.steps || index === values.steps.length - 1) return
  const newSteps = [...(values.steps || [])]
  const temp = newSteps[index]
  newSteps[index] = newSteps[index + 1]
  newSteps[index + 1] = temp
  setFieldValue("steps", newSteps)
}

const onSubmit = handleSubmit((formValues) => {
  console.log("-- submitted: ", formValues)
  toast({
    title: "Recipe Submitted",
    description: h(
      "pre",
      { class: "bg-slate-950 text-white p-4 rounded-md" },
      JSON.stringify(formValues, null, 2),
    ),
  })
})
</script>

<template>
  <NuxtLayout>
    <div class="max-w-3xl mx-auto p-6 space-y-8">
      <h1 class="text-3xl font-bold text-primary">Upload a Recipe</h1>

      <form class="space-y-6" @submit.prevent="onSubmit">
        <!-- Title -->
        <FormField v-slot="{ componentField }" name="title">
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Spaghetti Carbonara"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Category -->
        <FormField v-slot="{ componentField }" name="category">
          <FormItem class="flex flex-col">
            <FormLabel>Category</FormLabel>

            <Combobox by="label">
              <FormControl>
                <ComboboxAnchor>
                  <div
                    class="relative w-full max-w-sm items-center active:border-blue-500"
                  >
                    <ComboboxInput
                      :display-value="(val) => val?.label ?? ''"
                      placeholder="Select category..."
                      v-bind="componentField"
                    />
                    <ComboboxTrigger
                      class="absolute end-0 inset-y-0 flex items-center justify-center px-3"
                    >
                      <Icon name="heroicons:chevron-up-down" />
                    </ComboboxTrigger>
                  </div>
                </ComboboxAnchor>
              </FormControl>

              <ComboboxList>
                <ComboboxEmpty> Nothing found. </ComboboxEmpty>

                <ComboboxGroup>
                  <ComboboxItem
                    v-for="category in categories"
                    :key="category.value"
                    :value="category"
                    @select="
                      () => {
                        setFieldValue('category', category.value)
                      }
                    "
                  >
                    {{ category.label }}

                    <ComboboxItemIndicator>
                      <Check :class="cn('ml-auto h-4 w-4')" />
                    </ComboboxItemIndicator>
                  </ComboboxItem>
                </ComboboxGroup>
              </ComboboxList>
            </Combobox>

            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Ingredients -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <p class="text-lg font-medium">Ingredients</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              @click="
                addIngredient({
                  id: '',
                  name: '',
                  quantity: 0,
                  unit: '',
                })
              "
            >
              <Icon name="bx:plus-circle" />
              Add Ingredient
            </Button>
          </div>

          <div
            v-if="errors.ingredients"
            class="text-sm font-medium text-destructive"
          >
            {{ errors.ingredients }}
          </div>

          <div
            v-for="(field, index) in ingredientFields"
            :key="field.key"
            class="flex flex-row gap-4 justify-between items-start"
          >
            <!-- Ingredient Name -->
            <FormField
              v-slot="{ componentField }"
              :name="`ingredients[${index}].name`"
              class="col-span-5"
            >
              <FormItem>
                <FormLabel v-if="index === 0">Name</FormLabel>
                <div v-else class="h-6"></div>
                <FormControl>
                  <Input
                    placeholder="Ingredient name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Quantity -->
            <FormField
              v-slot="{ componentField }"
              :name="`ingredients[${index}].quantity`"
              class="col-span-3"
            >
              <FormItem>
                <FormLabel v-if="index === 0">Quantity</FormLabel>
                <div v-else class="h-6"></div>
                <FormControl>
                  <Input placeholder="Amount" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Unit -->
            <FormField
              v-slot="{ componentField }"
              :name="`ingredients[${index}].unit`"
              class="col-span-3"
            >
              <FormItem>
                <FormLabel v-if="index === 0">Unit</FormLabel>
                <div v-else class="h-6"></div>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="item in ingredientUnits"
                        :key="item"
                        :value="item"
                        >{{ item }}</SelectItem
                      >
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Remove Button -->
            <div class="col-span-1 flex items-center">
              <div class="w-auto"></div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                class="mt-6"
                @click="removeIngredient(index)"
              >
                <Icon name="bx:trash-alt" class="w-5 h-5" />
              </Button>
            </div>
          </div>

          <!-- Steps -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <p class="text-lg font-medium">Preparation Steps</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                @click="addStep({} as RecipeSteps)"
              >
                <Icon name="bx:plus-circle" class="h-5 w-5" />
                Add Step
              </Button>
            </div>

            <div
              v-if="errors.steps"
              class="text-sm font-medium text-destructive"
            >
              {{ errors.steps }}
            </div>

            <div
              v-for="(field, index) in stepFields"
              :key="field.key"
              class="flex gap-4 justify-between items-start basis-0"
            >
              <!-- Step Number -->
              <div class="col-span-1 flex items-center justify-center mt-8">
                <div
                  class="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium"
                >
                  {{ index + 1 }}
                </div>
              </div>

              <!-- Step Description -->
              <FormField
                v-slot="{ componentField }"
                :name="`steps[${index}]`"
                class="col-span-9"
              >
                <FormItem>
                  <FormLabel v-if="index === 0">Description</FormLabel>
                  <div v-else class="h-6"></div>
                  <FormControl>
                    <Textarea
                      placeholder="Describe this step..."
                      v-bind="componentField"
                      rows="2"
                      cols="20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Step Actions -->
              <div class="col-span-2 flex flex-col items-center gap-1 mt-8">
                <div class="flex space-x-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    :disabled="index === 0"
                    @click="moveStepUp(index)"
                  >
                    <Icon name="bx:up-arrow-alt" class="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    :disabled="
                      !values.steps || index === values.steps.length - 1
                    "
                    @click="moveStepDown(index)"
                  >
                    <Icon name="bx:down-arrow-alt" class="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    :disabled="!values.steps || index === 0"
                    @click="insertStepBefore(index)"
                  >
                    <Icon name="bx:arrow-to-top" class="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    :disabled="stepFields.length <= 1"
                    @click="removeStep(index)"
                  >
                    <Icon name="typcn:delete" class="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pictures -->
        <div class="space-y-4">
          <p class="text-lg font-medium">Pictures</p>

          <div
            v-if="errors.pictures"
            class="text-sm font-medium text-destructive"
          >
            {{ errors.pictures }}
          </div>

          <div
            class="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center"
          >
            <input
              id="pictures"
              type="file"
              multiple
              accept="image/*"
              class="hidden"
              @change="handlePictureChange"
            />
            <label
              for="pictures"
              class="cursor-pointer flex flex-col items-center justify-center"
            >
              <div class="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-muted-foreground"
                >
                  <path
                    d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"
                  ></path>
                  <line x1="16" x2="22" y1="5" y2="5"></line>
                  <line x1="19" x2="19" y1="2" y2="8"></line>
                  <circle cx="9" cy="9" r="2"></circle>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                </svg>
              </div>
              <span class="text-base font-medium">Click to upload images</span>
              <span class="text-sm text-muted-foreground mt-1">
                Upload multiple images of your recipe
              </span>
            </label>
          </div>

          <!-- Image Previews -->
          <div
            v-if="picturePreviewUrls.length > 0"
            class="grid grid-cols-3 gap-4 mt-4"
          >
            <div
              v-for="(url, index) in picturePreviewUrls"
              :key="index"
              class="relative rounded-md overflow-hidden aspect-square"
            >
              <img
                :src="url"
                class="w-full h-full object-cover"
                alt="Recipe preview"
              />
            </div>
          </div>
        </div>

        <!-- Thumbnail Selection -->
        <FormField v-slot="{ componentField }" name="thumbnail">
          <FormItem>
            <FormLabel>Thumbnail</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger>
                  <SelectValue placeholder="Select a thumbnail" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="(file, index) in values.pictures"
                    :key="index"
                    :value="file.name"
                  >
                    {{ file.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Tags -->
        <FormField name="tags">
          <Combobox
            v-model="tagsValue"
            v-model:open="tagDropOpen"
            :ignore-filter="true"
          >
            <ComboboxAnchor as-child>
              <TagsInput v-model="tagsValue" class="px-2 gap-2 w-80">
                <div class="flex gap-2 flex-wrap items-center">
                  <TagsInputItem
                    v-for="item in tagsValue"
                    :key="item"
                    :value="item"
                  >
                    <TagsInputItemText />
                    <TagsInputItemDelete />
                  </TagsInputItem>
                </div>

                <ComboboxInput v-model="searchTerm" as-child>
                  <TagsInputInput
                    placeholder="Tags..."
                    class="min-w-[200px] w-full p-0 border-none focus-visible:ring-0 h-auto"
                    @keydown.enter.prevent
                  />
                </ComboboxInput>
              </TagsInput>

              <ComboboxList class="w-[--reka-popper-anchor-width]">
                <ComboboxEmpty />
                <ComboboxGroup>
                  <ComboboxItem
                    v-for="tag in filteredTags"
                    :key="tag.value"
                    :value="tag.label"
                    @select.prevent="
                      (ev) => {
                        if (typeof ev.detail.value === 'string') {
                          searchTerm = ''
                          tagsValue = [...tagsValue, ev.detail.value]
                        }

                        if (filteredTags.length === 0) {
                          tagDropOpen = false
                        }
                      }
                    "
                  >
                    {{ tag.label }}
                  </ComboboxItem>
                </ComboboxGroup>
              </ComboboxList>
            </ComboboxAnchor>
          </Combobox>
        </FormField>

        <!-- Button -->
        <Button type="submit" class="w-full">Submit Recipe</Button>
      </form>
    </div>
  </NuxtLayout>
</template>
