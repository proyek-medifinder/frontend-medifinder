<template>
    <main class="relative min-h-screen overflow-hidden bg-slate-50 pb-20 pt-28 transition-colors duration-300 dark:bg-[#090d16] sm:pb-24 sm:pt-32">
        <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.09),transparent_65%)]"></div>

        <div class="relative mx-auto max-w-3xl px-5 sm:px-8">
            <header class="mb-8 text-center sm:mb-10">
                <span class="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-[#0f766e] dark:bg-emerald-950/70 dark:text-emerald-400" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-6 w-6">
                        <rect x="3" y="5" width="18" height="14" rx="3" />
                        <path d="m4 7 6.8 5.1a2 2 0 0 0 2.4 0L20 7" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </span>
                <h1 class="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    Hubungi Kami
                </h1>
                <p class="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                    Ada pertanyaan, masukan, atau ingin bekerja sama? Kirim pesan kepada tim MediFinder.
                </p>
            </header>

            <form class="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_48px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none sm:p-9"
                :aria-busy="loading" @submit.prevent="handleSubmit">
                <div class="grid gap-6 sm:grid-cols-2">
                    <div>
                        <label for="contact-name" class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Nama</label>
                        <input id="contact-name" v-model="form.nama" name="nama" type="text" autocomplete="name" required
                            placeholder="Nama lengkap"
                            class="contact-input" />
                    </div>
                    <div>
                        <label for="contact-email" class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
                        <input id="contact-email" v-model="form.email" name="email" type="email" autocomplete="email" required
                            placeholder="nama@email.com"
                            class="contact-input" />
                    </div>
                </div>

                <div>
                    <label for="contact-subject" class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Topik</label>
                    <input id="contact-subject" v-model="form.subjek" name="subjek" type="text" required
                        placeholder="Apa yang ingin kamu sampaikan?"
                        class="contact-input" />
                </div>

                <div>
                    <label for="contact-message" class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Pesan</label>
                    <textarea id="contact-message" v-model="form.pesan" name="pesan" rows="5" required
                        placeholder="Tulis pesanmu di sini..." aria-describedby="contact-message-hint"
                        class="contact-input min-h-36 resize-y"></textarea>
                    <p id="contact-message-hint" class="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        Ceritakan kebutuhan atau kendala kamu.
                    </p>
                </div>

                <div class="border-t border-slate-100 pt-5 dark:border-slate-800">
                    <div v-if="success" role="status" class="mb-4 flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5 shrink-0">
                            <path d="m5 12 4 4L19 6" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        Pesan berhasil dikirim. Terima kasih sudah menghubungi kami.
                    </div>
                    <p v-if="error" role="alert" class="mb-4 text-sm text-rose-600 dark:text-rose-400">{{ error }}</p>
                    <div class="flex justify-end">
                        <button type="submit" :disabled="loading"
                            class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#115e59] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500 disabled:cursor-wait disabled:opacity-60 dark:bg-emerald-600 dark:hover:bg-emerald-500 sm:w-auto">
                            {{ loading ? 'Mengirim...' : 'Kirim Pesan' }}
                            <svg v-if="!loading" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4">
                                <path d="M5 12h14m-6-6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </main>
</template>

<script setup lang="ts">
useHead({ title: 'Kontak Kami' })

const { sendPesan, loading, success, error } = useKontak()
const form = ref({ nama: '', email: '', subjek: '', pesan: '' })

const handleSubmit = async () => {
    if (loading.value) return
    await sendPesan(form.value)
    if (success.value) {
        form.value = { nama: '', email: '', subjek: '', pesan: '' }
    }
}
</script>

<style scoped>
@reference "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

.contact-input {
    @apply block w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-500 dark:focus:bg-slate-950/60 dark:focus:ring-emerald-500/10;
}
</style>
