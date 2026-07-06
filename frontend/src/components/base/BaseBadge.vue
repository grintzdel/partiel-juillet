<script setup lang="ts">
import { CATEGORY_LABELS, CATEGORY_DOT } from '@/constants/categories'
import type { EventCategory } from '@/constants/categories'

const props = defineProps<{ category: EventCategory }>()
</script>

<template>
  <span class="inline-flex items-center gap-2">
    <span :class="CATEGORY_DOT[props.category]" class="h-1.5 w-1.5 rounded-full" />
    <span class="eyebrow text-stone-500">{{ CATEGORY_LABELS[props.category] }}</span>
  </span>
</template>
