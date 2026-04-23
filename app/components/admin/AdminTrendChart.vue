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

            <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {{ summary }}
            </span>
        </div>

        <div class="mt-6">
            <svg viewBox="0 0 100 42" class="h-48 w-full overflow-visible">
                <defs>
                    <linearGradient :id="gradientId" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" :stop-color="fill" stop-opacity="0.38" />
                        <stop offset="100%" :stop-color="fill" stop-opacity="0.02" />
                    </linearGradient>
                </defs>

                <path d="M0 36 H100" stroke="#e2e8f0" stroke-width="0.5" />
                <path d="M0 24 H100" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="1.5 2" />
                <path d="M0 12 H100" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="1.5 2" />

                <path :d="areaPath" :fill="`url(#${gradientId})`" />
                <path :d="linePath" :stroke="stroke" stroke-width="2" fill="none" stroke-linecap="round" />

                <circle v-for="point in points" :key="`${point.x}-${point.y}`" :cx="point.x" :cy="point.y" r="1.7"
                    :fill="stroke" />
            </svg>

            <div class="mt-3 grid grid-cols-6 gap-2 text-xs text-slate-500">
                <span v-for="label in labels" :key="label" class="text-center">
                    {{ label }}
                </span>
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
    stroke?: string
    fill?: string
}>(), {
    summary: '',
    stroke: '#0f766e',
    fill: '#14b8a6'
})

const gradientId = `chart-${Math.random().toString(36).slice(2, 9)}`

const points = computed(() => {
    if (!props.values.length) return []

    const max = Math.max(...props.values, 1)
    const step = props.values.length > 1 ? 100 / (props.values.length - 1) : 100

    return props.values.map((value, index) => ({
        x: Number((index * step).toFixed(2)),
        y: Number((36 - (value / max) * 28).toFixed(2))
    }))
})

const linePath = computed(() => {
    if (!points.value.length) return ''
    return points.value.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`).join(' ')
})

const areaPath = computed(() => {
    if (!points.value.length) return ''
    const start = points.value[0]
    const end = points.value[points.value.length - 1]
    return `${linePath.value} L${end.x} 36 L${start.x} 36 Z`
})
</script>
