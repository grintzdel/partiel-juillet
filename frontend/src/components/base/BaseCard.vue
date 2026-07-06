<script setup lang="ts">
withDefaults(defineProps<{ hover?: boolean }>(), { hover: false })
</script>

<template>
  <div
    class="rounded-xl border border-stone-200 bg-white"
    :class="
      hover
        ? 'transition duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-[0_10px_30px_-12px_rgb(28_25_23/0.18)]'
        : 'shadow-[0_1px_2px_rgb(28_25_23/0.04)]'
    "
  >
    <div v-if="$slots.header" class="border-b border-stone-100 px-6 py-4">
      <slot name="header" />
    </div>
    <div class="p-6">
      <slot />
    </div>
  </div>
</template>
