<script setup lang="ts">
type IconName = 'calendar' | 'map-pin' | 'users' | 'search' | 'arrow-right' | 'arrow-left'

withDefaults(defineProps<{ name: IconName; size?: number }>(), { size: 16 })
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'calendar'">
      <rect x="3" y="4.5" width="18" height="17" rx="2.5" />
      <path d="M8 2.5v4" />
      <path d="M16 2.5v4" />
      <path d="M3 9.5h18" />
    </template>
    <template v-else-if="name === 'map-pin'">
      <path d="M20 10.5c0 4.5-8 11.5-8 11.5s-8-7-8-11.5a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10.5" r="2.75" />
    </template>
    <template v-else-if="name === 'users'">
      <path d="M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20" />
      <circle cx="9" cy="7" r="3.5" />
      <path d="M22 20v-1.5a4 4 0 0 0-3-3.85" />
      <path d="M16 3.65a4 4 0 0 1 0 6.7" />
    </template>
    <template v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </template>
    <template v-else-if="name === 'arrow-right'">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </template>
    <template v-else-if="name === 'arrow-left'">
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </template>
  </svg>
</template>
