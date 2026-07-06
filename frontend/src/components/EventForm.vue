<script setup lang="ts">
import { reactive, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { EVENT_CATEGORIES, CATEGORY_LABELS } from '@/constants/categories'
import type { EventCategory } from '@/constants/categories'
import type { CreateEventInput } from '@/types/event'

const props = withDefaults(defineProps<{ submitting?: boolean }>(), { submitting: false })

const emit = defineEmits<{ submit: [payload: CreateEventInput] }>()

interface FormState {
  title: string
  description: string
  date: string
  location: string
  category: EventCategory | ''
  capacity: number
}

const form = reactive<FormState>({
  title: '',
  description: '',
  date: '',
  location: '',
  category: '',
  capacity: 30,
})

const errors = reactive<Record<string, string>>({})

function validate(): boolean {
  for (const key of Object.keys(errors)) delete errors[key]

  if (form.title.trim().length < 3) errors.title = 'Le titre doit faire au moins 3 caractères.'
  if (form.description.trim().length < 10)
    errors.description = 'La description doit faire au moins 10 caractères.'
  if (!form.date) errors.date = 'La date est obligatoire.'
  if (!form.location.trim()) errors.location = 'Le lieu est obligatoire.'
  if (!form.category) errors.category = 'La catégorie est obligatoire.'
  if (!Number.isInteger(form.capacity) || form.capacity < 1)
    errors.capacity = 'La capacité doit être un entier positif.'

  return Object.keys(errors).length === 0
}

const attempted = ref(false)

function handleSubmit(): void {
  attempted.value = true
  if (!validate()) return
  emit('submit', {
    title: form.title.trim(),
    description: form.description.trim(),
    date: form.date,
    location: form.location.trim(),
    category: form.category as EventCategory,
    capacity: form.capacity,
  })
}
</script>

<template>
  <form class="flex flex-col gap-4" novalidate @submit.prevent="handleSubmit">
    <div>
      <label for="title" class="mb-1.5 block text-sm font-medium text-stone-700">Titre</label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        class="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
      />
      <p v-if="attempted && errors.title" class="mt-1 text-xs text-red-600">{{ errors.title }}</p>
    </div>

    <div>
      <label for="description" class="mb-1.5 block text-sm font-medium text-stone-700">Description</label>
      <textarea
        id="description"
        v-model="form.description"
        rows="4"
        class="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
      />
      <p v-if="attempted && errors.description" class="mt-1 text-xs text-red-600">{{ errors.description }}</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <label for="date" class="mb-1.5 block text-sm font-medium text-stone-700">Date</label>
        <input
          id="date"
          v-model="form.date"
          type="date"
          class="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
        />
        <p v-if="attempted && errors.date" class="mt-1 text-xs text-red-600">{{ errors.date }}</p>
      </div>

      <div>
        <label for="location" class="mb-1.5 block text-sm font-medium text-stone-700">Lieu</label>
        <input
          id="location"
          v-model="form.location"
          type="text"
          class="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
        />
        <p v-if="attempted && errors.location" class="mt-1 text-xs text-red-600">{{ errors.location }}</p>
      </div>

      <div>
        <label for="category" class="mb-1.5 block text-sm font-medium text-stone-700">Catégorie</label>
        <select
          id="category"
          v-model="form.category"
          class="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
        >
          <option value="" disabled>Choisir…</option>
          <option v-for="cat in EVENT_CATEGORIES" :key="cat" :value="cat">
            {{ CATEGORY_LABELS[cat] }}
          </option>
        </select>
        <p v-if="attempted && errors.category" class="mt-1 text-xs text-red-600">{{ errors.category }}</p>
      </div>

      <div>
        <label for="capacity" class="mb-1.5 block text-sm font-medium text-stone-700">Capacité</label>
        <input
          id="capacity"
          v-model.number="form.capacity"
          type="number"
          min="1"
          class="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
        />
        <p v-if="attempted && errors.capacity" class="mt-1 text-xs text-red-600">{{ errors.capacity }}</p>
      </div>
    </div>

    <BaseButton type="submit" :disabled="props.submitting">
      {{ props.submitting ? 'Création…' : 'Créer l\'événement' }}
    </BaseButton>
  </form>
</template>
