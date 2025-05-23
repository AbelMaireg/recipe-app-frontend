<template>
  <div class="w-full max-w-md flex items-center gap-2">
    <Input
      v-model="searchTerm"
      type="text"
      placeholder="Search..."
      class="flex-1"
      @keydown.enter.prevent="saveSearch"
    />

    <Button
      v-if="searchTerm.length"
      variant="ghost"
      size="icon"
      @click="clearSearch"
    >
      <Icon name="mdi:close" class="w-5 h-5 text-muted-foreground" />
    </Button>

    <Popover>
      <PopoverTrigger as-child>
        <Button variant="ghost" size="icon">
          <Icon name="mdi:history" class="w-5 h-5 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-64 p-2">
        <div class="text-sm text-muted-foreground mb-2">Search History</div>
        <ul class="space-y-1 max-h-40 overflow-auto">
          <li
            v-for="(item, index) in history"
            :key="index"
            class="cursor-pointer hover:bg-accent p-1 rounded"
            @click="selectFromHistory(item)"
          >
            {{ item }}
          </li>
        </ul>
        <Button variant="link" size="sm" class="mt-2" @click="clearHistory">
          Clear history
        </Button>
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const searchTerm = ref("")
const history = ref<string[]>([])

const clearSearch = () => {
  searchTerm.value = ""
}

const clearHistory = () => {
  history.value = []
}

const selectFromHistory = (item: string) => {
  searchTerm.value = item
}

const saveSearch = () => {
  const term = searchTerm.value.trim()
  if (term && !history.value.includes(term)) {
    history.value.unshift(term)
    history.value = history.value.slice(0, 10) // Keep only 10 items
  }
}
</script>
