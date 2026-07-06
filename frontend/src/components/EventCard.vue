<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseIcon from '@/components/base/BaseIcon.vue'
import { formatShortDate } from '@/utils/format'
import type { EventItem } from '@/types/event'

const props = defineProps<{ event: EventItem }>()

const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
  <BaseCard hover>
    <article class="flex h-full flex-col gap-3">
      <BaseBadge :category="props.event.category" />

      <h3 class="font-display text-lg font-semibold leading-snug text-stone-900">{{ props.event.title }}</h3>

      <p class="line-clamp-3 flex-1 text-sm leading-relaxed text-stone-500">{{ props.event.description }}</p>

      <dl class="flex flex-col gap-2 border-t border-stone-100 pt-4 text-sm text-stone-500">
        <div class="flex items-center gap-2.5">
          <BaseIcon name="calendar" :size="15" class="shrink-0 text-stone-400" />
          <dd>{{ formatShortDate(props.event.date) }}</dd>
        </div>
        <div class="flex items-center gap-2.5">
          <BaseIcon name="map-pin" :size="15" class="shrink-0 text-stone-400" />
          <dd class="truncate">{{ props.event.location }}</dd>
        </div>
        <div class="flex items-center gap-2.5">
          <BaseIcon name="users" :size="15" class="shrink-0 text-stone-400" />
          <dd>{{ props.event.capacity }} places</dd>
        </div>
      </dl>

      <button
        class="group mt-1 inline-flex items-center gap-1.5 self-start text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
        @click="emit('select', props.event._id)"
      >
        Voir le détail
        <BaseIcon name="arrow-right" :size="15" class="transition-transform group-hover:translate-x-0.5" />
      </button>
    </article>
  </BaseCard>
</template>
