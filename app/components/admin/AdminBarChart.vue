<template>
    <div class="rounded-[28px] border border-slate-200/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div class="flex items-center justify-between gap-4">
            <div>
                <p class="text-lg font-semibold text-slate-900">
                    {{ title }}
                </p>
                <p class="mt-1 text-sm text-slate-500">
                    {{ subtitle }}
                </p>
            </div>

            <span class="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                {{ summary }}
            </span>
        </div>

        <div class="mt-6 flex h-52 items-end gap-4">
            <div v-for="(value, index) in values" :key="labels[index]" class="flex flex-1 flex-col items-center gap-3">
                <div class="flex h-40 w-full items-end justify-center rounded-2xl bg-slate-100/80 px-2 pb-2">
                    <div class="w-full rounded-2xl" :class="barClass(index)" :style="{ height: `${height(value)}%` }" />
                </div>
                <div class="text-center">
                    <p class="text-sm font-semibold text-slate-700">
                        {{ value }}
                    </p>
                    <p class="text-xs text-slate-500">
                        {{ labels[index] }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    title: string
    subtitle: string
    values: number[]
    labels: string[]
    summary?: string
}>(), {
    summary: ''
})

const palette = [
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-amber-500',
    'bg-orange-500',
    'bg-sky-500'
]

const height = (value: number) => {
    const max = Math.max(...props.values, 1)
    return Math.max(16, Math.round((value / max) * 100))
}

const barClass = (index: number) => palette[index % palette.length]
</script>
