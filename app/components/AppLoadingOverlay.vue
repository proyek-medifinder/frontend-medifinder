<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 backdrop-blur-md">
    <div class="rounded-[28px] border border-white/70 bg-white/90 px-6 py-5 text-center shadow-[0_24px_80px_rgba(15,23,42,0.18)] dark:border-slate-700 dark:bg-slate-900/95">
      <div class="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600 dark:border-slate-700 dark:border-t-emerald-400"></div>
      <p class="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{{ label }}</p>
      <p v-if="description" class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  description?: string
}>(), {
  label: 'Memuat data...',
  description: ''
})
</script>
