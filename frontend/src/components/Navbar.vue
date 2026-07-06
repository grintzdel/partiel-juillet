<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const menuOpen = ref(false)

const linkClass =
  'rounded-md px-3 py-2 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900 [&.router-link-exact-active]:text-stone-900'

function handleLogout(): void {
  auth.logout()
  menuOpen.value = false
  router.push('/')
}
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-stone-200 bg-paper/80 backdrop-blur">
    <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
      <RouterLink
        to="/"
        class="font-display text-lg font-bold tracking-tight text-brand-600"
        @click="menuOpen = false"
      >
        Event<span class="text-stone-900">Hub</span>
      </RouterLink>

      <button
        class="rounded-md p-2 text-stone-600 sm:hidden"
        aria-label="Menu"
        @click="menuOpen = !menuOpen"
      >
        <span class="block h-0.5 w-6 bg-current" />
        <span class="mt-1.5 block h-0.5 w-6 bg-current" />
        <span class="mt-1.5 block h-0.5 w-6 bg-current" />
      </button>

      <div class="hidden items-center gap-1 sm:flex">
        <RouterLink to="/" :class="linkClass" @click="menuOpen = false">Accueil</RouterLink>
        <RouterLink to="/create" :class="linkClass">Créer</RouterLink>
        <template v-if="auth.isAuthenticated">
          <span class="px-3 text-sm text-stone-400">{{ auth.user?.name }}</span>
          <button
            class="rounded-md px-3 py-2 text-sm font-medium text-stone-500 transition-colors hover:text-red-600"
            @click="handleLogout"
          >
            Déconnexion
          </button>
        </template>
        <template v-else>
          <RouterLink to="/login" :class="linkClass">Connexion</RouterLink>
          <RouterLink
            to="/register"
            class="ml-1 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            Inscription
          </RouterLink>
        </template>
      </div>
    </nav>

    <div v-if="menuOpen" class="border-t border-stone-100 sm:hidden">
      <div class="flex flex-col gap-1 px-4 py-3">
        <RouterLink to="/" :class="linkClass" @click="menuOpen = false">Accueil</RouterLink>
        <RouterLink to="/create" :class="linkClass" @click="menuOpen = false">Créer</RouterLink>
        <template v-if="auth.isAuthenticated">
          <button
            class="rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            @click="handleLogout"
          >
            Déconnexion ({{ auth.user?.name }})
          </button>
        </template>
        <template v-else>
          <RouterLink to="/login" :class="linkClass" @click="menuOpen = false">Connexion</RouterLink>
          <RouterLink to="/register" :class="linkClass" @click="menuOpen = false">Inscription</RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>
