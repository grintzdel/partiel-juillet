<script setup lang="ts">
import { EVENT_CATEGORIES, CATEGORY_LABELS } from '@/constants/categories'
import BaseIcon from '@/components/base/BaseIcon.vue'

const search = defineModel<string>('search', { default: '' })
const category = defineModel<string>('category', { default: '' })
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row">
    <div class="relative flex-1">
      <BaseIcon
        name="search"
        :size="17"
        class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
      />
      <input
        v-model="search"
        type="search"
        placeholder="Rechercher un événement…"
        class="w-full rounded-lg border border-stone-300 bg-white py-2.5 pl-10 pr-3 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
      />
    </div>

    <select
      v-model="category"
      class="rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-700 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100 sm:w-52"
    >
      <option value="">Toutes les catégories</option>
      <option v-for="cat in EVENT_CATEGORIES" :key="cat" :value="cat">
        {{ CATEGORY_LABELS[cat] }}
      </option>
    </select>
  </div>
</template>
