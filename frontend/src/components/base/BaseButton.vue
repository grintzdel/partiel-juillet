<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'danger' | 'ghost'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  { variant: 'primary', type: 'button', disabled: false }
)

defineEmits<{ click: [event: MouseEvent] }>()

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus-visible:outline-brand-600',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600',
  ghost: 'border border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50 focus-visible:outline-stone-400',
}

const classes = computed(() => variantClasses[props.variant])
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="classes"
    class="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
