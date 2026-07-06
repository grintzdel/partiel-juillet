<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-1 w-full max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <RouterView />
    </main>
    <footer class="border-t border-stone-200 py-6 text-center text-sm text-stone-400">
      EventHub EEMI — {{ new Date().getFullYear() }}
    </footer>
  </div>
</template>
