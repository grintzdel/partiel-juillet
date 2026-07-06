<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useEventsStore } from '@/stores/events'
import { useAuthStore } from '@/stores/auth'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseIcon from '@/components/base/BaseIcon.vue'
import { formatDate } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const store = useEventsStore()
const auth = useAuthStore()
const { current, loading, error } = storeToRefs(store)

const deleting = ref(false)

async function handleDelete(): Promise<void> {
  if (!current.value) return
  if (!window.confirm('Supprimer cet événement ?')) return
  deleting.value = true
  const ok = await store.deleteEvent(current.value._id)
  deleting.value = false
  if (ok) router.push('/')
}

onMounted(() => {
  store.fetchById(String(route.params.id))
})
</script>

<template>
  <section class="mx-auto max-w-2xl">
    <RouterLink
      to="/"
      class="group mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
    >
      <BaseIcon name="arrow-left" :size="15" class="transition-transform group-hover:-translate-x-0.5" />
      Retour aux événements
    </RouterLink>

    <div v-if="loading" class="py-16 text-center text-stone-500">Chargement…</div>

    <div v-else-if="error" class="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
      {{ error }}
    </div>

    <BaseCard v-else-if="current">
      <template #header>
        <div class="flex flex-col gap-3 py-2">
          <BaseBadge :category="current.category" />
          <h1 class="text-2xl font-bold tracking-tight text-stone-900">{{ current.title }}</h1>
        </div>
      </template>

      <div class="flex flex-col gap-6">
        <p class="whitespace-pre-line leading-relaxed text-stone-600">{{ current.description }}</p>

        <dl class="grid grid-cols-1 gap-5 border-t border-stone-100 pt-6 sm:grid-cols-3">
          <div class="flex flex-col gap-1.5">
            <dt class="flex items-center gap-2 text-stone-400">
              <BaseIcon name="calendar" :size="15" />
              <span class="eyebrow">Date</span>
            </dt>
            <dd class="font-medium text-stone-800">{{ formatDate(current.date) }}</dd>
          </div>
          <div class="flex flex-col gap-1.5">
            <dt class="flex items-center gap-2 text-stone-400">
              <BaseIcon name="map-pin" :size="15" />
              <span class="eyebrow">Lieu</span>
            </dt>
            <dd class="font-medium text-stone-800">{{ current.location }}</dd>
          </div>
          <div class="flex flex-col gap-1.5">
            <dt class="flex items-center gap-2 text-stone-400">
              <BaseIcon name="users" :size="15" />
              <span class="eyebrow">Capacité</span>
            </dt>
            <dd class="font-medium text-stone-800">{{ current.capacity }} places</dd>
          </div>
        </dl>

        <div v-if="auth.isAuthenticated" class="border-t border-stone-100 pt-6">
          <BaseButton variant="danger" :disabled="deleting" @click="handleDelete">
            {{ deleting ? 'Suppression…' : 'Supprimer l\'événement' }}
          </BaseButton>
        </div>
      </div>
    </BaseCard>
  </section>
</template>
