<script setup lang="ts">
import { createPaymentTab, fulfillmentLabel, openPayment } from '~/utils/payment'
const props = defineProps<{ order: any }>()
const emit = defineEmits<{ changed: [] }>()
const config = useRuntimeConfig()
const token = useCookie<string | null>('auth_token')
const busy = ref(false)
const error = ref('')
const act = async (action: 'refresh' | 'payment') => {
  if (busy.value) return
  busy.value = true
  error.value = ''
  let paymentTab: Window | null = null
  try {
    if (action === 'payment') paymentTab = createPaymentTab()
    const response: any = await $fetch(`${config.public.apiBase}/transaksi/${props.order.id}/${action}`, {
      method: 'POST', headers: { Authorization: `Bearer ${token.value}`, 'ngrok-skip-browser-warning': 'true' }
    })
    if (action === 'payment') {
      if (!response.redirect_url || !paymentTab) throw new Error('Tautan pembayaran belum tersedia.')
      openPayment(response.redirect_url, paymentTab)
    }
    emit('changed')
  } catch (err: any) {
    paymentTab?.close()
    error.value = err?.data?.error || err?.message || 'Pembayaran belum dapat diproses.'
    emit('changed')
  } finally { busy.value = false }
}
</script>

<template>
  <div class="mt-3 space-y-2">
    <p v-if="Number(order.refunded_amount) > 0" class="text-xs text-slate-600 dark:text-slate-300">
      Pengembalian dana: {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.refunded_amount) }}
    </p>
    <p v-if="order.status === 'paid'" class="text-sm text-emerald-700 dark:text-emerald-300">
      {{ fulfillmentLabel(order.fulfillment_status) }}
    </p>
    <template v-if="order.status === 'pending'">
      <p v-if="order.expires_at" class="text-xs text-slate-500 dark:text-slate-400">
        Batas pembayaran: {{ new Date(order.expires_at).toLocaleString('id-ID') }}
      </p>
      <div class="flex flex-wrap gap-2">
        <button type="button" :disabled="busy" @click="act('payment')"
          class="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">
          {{ busy ? 'Memproses…' : 'Lanjutkan pembayaran' }}
        </button>
        <button type="button" :disabled="busy" @click="act('refresh')"
          class="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200 disabled:opacity-50">
          Periksa status
        </button>
      </div>
    </template>
    <p v-if="error" role="alert" class="text-xs text-rose-600 dark:text-rose-400">{{ error }}</p>
  </div>
</template>
