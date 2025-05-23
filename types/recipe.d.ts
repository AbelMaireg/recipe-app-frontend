import type Chef from "./chef.d.ts"
import type Ingredient from "./Ingredient.js"
import type RecipeStep from "./recipeSteps.js"

export default interface Recipe {
  id: string
  title: string
  creator: Chef
  thumbnail: string
  pictures: string[]
  preparationTime: string
  ingredients: Ingredient[]
  steps: RecipeStep[]
  rating: number
  likeCount: number
  createdAt: string
  updatedAt: string
}
