<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useEventsStore } from '@/stores/events'
import EventForm from '@/components/EventForm.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import type { CreateEventInput } from '@/types/event'

const router = useRouter()
const store = useEventsStore()
const { loading, error } = storeToRefs(store)

async function handleSubmit(payload: CreateEventInput): Promise<void> {
  const created = await store.createEvent(payload)
  if (created) router.push(`/events/${created._id}`)
}
</script>

<template>
  <section class="mx-auto max-w-2xl">
    <header class="mb-8 flex flex-col gap-3 border-b border-stone-200 pb-8">
      <span class="eyebrow text-brand-600">Nouvel événement</span>
      <h1 class="text-3xl font-bold tracking-tight text-stone-900">Créer un événement</h1>
      <p class="text-base text-stone-500">Renseignez les informations ci-dessous pour publier votre événement.</p>
    </header>

    <div v-if="error" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ error }}
    </div>

    <BaseCard>
      <EventForm :submitting="loading" @submit="handleSubmit" />
    </BaseCard>
  </section>
</template>
