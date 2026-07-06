<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useEventsStore } from '@/stores/events'
import SearchBar from '@/components/SearchBar.vue'
import EventCard from '@/components/EventCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const router = useRouter()
const store = useEventsStore()
const { events, loading, error } = storeToRefs(store)

const search = ref('')
const category = ref('')

const filteredEvents = computed(() => {
  const term = search.value.trim().toLowerCase()
  return events.value.filter((event) => {
    const matchesCategory = !category.value || event.category === category.value
    const matchesSearch =
      !term ||
      event.title.toLowerCase().includes(term) ||
      event.description.toLowerCase().includes(term)
    return matchesCategory && matchesSearch
  })
})

function goToDetail(id: string): void {
  router.push(`/events/${id}`)
}

onMounted(() => {
  store.fetchEvents()
})
</script>

<template>
  <section class="flex flex-col gap-8">
    <header class="flex flex-col gap-3 border-b border-stone-200 pb-8">
      <span class="eyebrow text-brand-600">EEMI · Agenda</span>
      <h1 class="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">Événements</h1>
      <p class="max-w-xl text-base leading-relaxed text-stone-500">
        Découvrez et filtrez les événements, ateliers et conférences de la vie étudiante à l'EEMI.
      </p>
    </header>

    <SearchBar v-model:search="search" v-model:category="category" />

    <div v-if="loading" class="py-16 text-center text-stone-500">
      <div class="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-brand-600" />
      Chargement des événements…
    </div>

    <div v-else-if="error" class="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <p class="mb-3 text-sm text-red-700">{{ error }}</p>
      <BaseButton variant="ghost" @click="store.fetchEvents()">Réessayer</BaseButton>
    </div>

    <div v-else-if="filteredEvents.length === 0" class="rounded-xl border border-dashed border-stone-300 py-16 text-center text-stone-500">
      Aucun événement ne correspond à votre recherche.
    </div>

    <div v-else class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <EventCard
        v-for="event in filteredEvents"
        :key="event._id"
        :event="event"
        @select="goToDetail"
      />
    </div>
  </section>
</template>
