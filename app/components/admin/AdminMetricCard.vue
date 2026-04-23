<template>
    <article
        class="rounded-[28px] border border-slate-200/70 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur">
        <div class="flex items-start justify-between gap-3">
            <div>
                <p class="text-sm font-medium text-slate-500">
                    {{ title }}
                </p>
                <p class="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                    {{ value }}
                </p>
            </div>

            <div class="flex h-12 w-12 items-center justify-center rounded-2xl" :class="iconClass">
                <Icon :icon="icon" class="h-6 w-6" />
            </div>
        </div>

        <div v-if="description" class="mt-4 flex items-center gap-2 text-sm">
            <span class="rounded-full px-2.5 py-1 font-medium" :class="badgeClass">
                {{ badge }}
            </span>
            <span class="text-slate-500">
                {{ description }}
            </span>
        </div>
    </article>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

withDefaults(defineProps<{
    title: string
    value: string | number
    icon: string
    badge?: string
    description?: string
    iconClass?: string
    badgeClass?: string
}>(), {
    badge: '',
    description: '',
    iconClass: 'bg-emerald-50 text-emerald-700',
    badgeClass: 'bg-emerald-50 text-emerald-700'
})
</script>
