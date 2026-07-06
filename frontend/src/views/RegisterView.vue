<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const router = useRouter()
const auth = useAuthStore()
const { loading, error } = storeToRefs(auth)

const name = ref('')
const email = ref('')
const password = ref('')

async function handleSubmit(): Promise<void> {
  const ok = await auth.register(name.value, email.value, password.value)
  if (ok) router.push('/')
}
</script>

<template>
  <section class="mx-auto max-w-md">
    <div class="mb-6 flex flex-col gap-2 text-center">
      <span class="eyebrow text-brand-600">Rejoindre EventHub</span>
      <h1 class="text-3xl font-bold tracking-tight text-stone-900">Inscription</h1>
    </div>

    <BaseCard>
      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {{ error }}
        </div>

        <div>
          <label for="name" class="mb-1.5 block text-sm font-medium text-stone-700">Nom</label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            autocomplete="name"
            class="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
          />
        </div>

        <div>
          <label for="email" class="mb-1.5 block text-sm font-medium text-stone-700">E-mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
          />
        </div>

        <div>
          <label for="password" class="mb-1.5 block text-sm font-medium text-stone-700">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="new-password"
            class="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
          />
        </div>

        <BaseButton type="submit" :disabled="loading">
          {{ loading ? 'Création…' : 'Créer mon compte' }}
        </BaseButton>

        <p class="text-center text-sm text-stone-500">
          Déjà un compte ?
          <RouterLink to="/login" class="font-medium text-brand-600 hover:text-brand-700">Connectez-vous</RouterLink>
        </p>
      </form>
    </BaseCard>
  </section>
</template>
