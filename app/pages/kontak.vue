<template>
    <div
        class="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f4fbf8_0%,#ffffff_34%,#f8fafc_100%)] pb-24 pt-24">
        <div
            class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(250,204,21,0.1),_transparent_20%)]">
        </div>

        <section class="kontak-hero relative">
            <div class="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-14">
                <div
                    class="overflow-hidden rounded-[34px] border border-white/70 bg-white/80 px-7 py-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:px-9 sm:py-10">
                    <div class="grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
                        <div>
                            <p class="text-sm font-semibold uppercase tracking-[0.28em] text-[#0f766e]/70">
                                Hubungi MediFinder
                            </p>
                            <h1 class="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                                Sampaikan pertanyaan, masukan, atau kebutuhan kerja sama dengan cara yang lebih rapi.
                            </h1>
                            <p class="mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                                Halaman ini kami buat lebih fokus supaya kamu bisa langsung menyampaikan pesan tanpa
                                terganggu informasi yang tidak terlalu perlu.
                            </p>

                            <div class="mt-7 flex flex-wrap gap-3">
                                <div
                                    class="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                                    Untuk pertanyaan umum
                                </div>
                                <div
                                    class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
                                    Untuk masukan layanan
                                </div>
                                <div
                                    class="rounded-full border border-amber-100 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
                                    Untuk kerja sama
                                </div>
                            </div>
                        </div>

                        <div
                            class="contact-support relative overflow-hidden rounded-[30px] border border-emerald-200/70 bg-[linear-gradient(160deg,rgba(15,118,110,0.94),rgba(13,148,136,0.84))] p-6 text-white shadow-[0_24px_70px_rgba(15,118,110,0.2)]">
                            <div class="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
                            <div class="absolute -bottom-12 left-8 h-32 w-32 rounded-full bg-yellow-300/15 blur-2xl">
                            </div>

                            <div class="relative">
                                <p class="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                                    Lebih Nyaman
                                </p>
                                <h2 class="mt-3 max-w-sm text-2xl font-semibold leading-tight">
                                    Tulis kebutuhanmu sekali, lalu biarkan tim kami menindaklanjuti dengan lebih
                                    terarah.
                                </h2>

                                <div class="mt-6 grid gap-3">
                                    <div class="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                                        <p class="text-xs uppercase tracking-[0.18em] text-white/65">
                                            Fokus
                                        </p>
                                        <p class="mt-2 text-lg font-semibold">
                                            Form yang lebih ringkas
                                        </p>
                                    </div>
                                    <div class="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                                        <p class="text-xs uppercase tracking-[0.18em] text-white/65">
                                            Tujuan
                                        </p>
                                        <p class="mt-2 text-lg font-semibold">
                                            Pesan lebih mudah dipahami
                                        </p>
                                    </div>
                                    <div class="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                                        <p class="text-xs uppercase tracking-[0.18em] text-white/65">
                                            Hasil
                                        </p>
                                        <p class="mt-2 text-lg font-semibold">
                                            Tampilan terasa lebih modern
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="mt-6 relative">
            <div class="mx-auto max-w-6xl px-6 lg:px-8">
                <div class="grid gap-6 xl:grid-cols-[1fr_0.42fr]">
                    <div
                        class="contact-form rounded-[30px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-8">
                        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p class="text-sm font-semibold uppercase tracking-[0.22em] text-[#0f766e]/70">
                                    Form Kontak
                                </p>
                                <h2 class="mt-2 text-2xl font-semibold text-slate-900">
                                    Kirim pesanmu dengan lebih jelas
                                </h2>
                                <p class="mt-2 text-sm leading-6 text-slate-500">
                                    Isi beberapa informasi penting di bawah ini supaya tim kami lebih mudah memahami
                                    kebutuhanmu.
                                </p>
                            </div>

                            <div class="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                                Balasan akan lebih mudah diproses jika isi pesan dibuat singkat dan spesifik.
                            </div>
                        </div>

                        <form class="mt-8 space-y-5" @submit.prevent="handleSubmit">
                            <div class="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label class="mb-2 block text-sm font-medium text-slate-600">
                                        Nama
                                    </label>
                                    <input type="text" v-model="form.nama" placeholder="Tulis nama lengkapmu"
                                        class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100" />
                                </div>

                                <div>
                                    <label class="mb-2 block text-sm font-medium text-slate-600">
                                        Email
                                    </label>
                                    <input type="email" v-model="form.email" placeholder="nama@email.com"
                                        class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100" />
                                </div>
                            </div>

                            <div class="grid gap-5 md:grid-cols-[0.8fr_1.2fr]">

                                <div>
                                    <label class="mb-2 block text-sm font-medium text-slate-600">
                                        Topik
                                    </label>
                                    <input type="text" v-model="form.subjek"
                                        placeholder="Contoh: kerja sama, bantuan akun, atau masukan fitur"
                                        class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100" />
                                </div>
                            </div>

                            <div>
                                <label class="mb-2 block text-sm font-medium text-slate-600">
                                    Pesan
                                </label>
                                <textarea rows="7" v-model="form.pesan"
                                    placeholder="Ceritakan kebutuhanmu dengan singkat, jelas, dan mudah dipahami."
                                    class="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-[#0f766e] focus:ring-4 focus:ring-emerald-100"></textarea>
                            </div>

                            <div
                                class="rounded-[24px] border border-emerald-100 bg-emerald-50/70 px-5 py-4 text-sm leading-6 text-emerald-800">
                                Pesan yang baik biasanya memuat tujuan, kendala yang sedang dialami, dan harapan dari
                                tim MediFinder.
                            </div>

                            <button type="submit" :disabled="loading"
                                class="inline-flex items-center justify-center rounded-2xl bg-[#0f766e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#115e59]">
                                {{ loading ? 'Mengirim...' : 'Kirim Pesan' }}
                            </button>
                            <p v-if="success" class="text-green-600 text-sm mt-2">
                                Pesan berhasil dikirim 🎉
                            </p>

                            <p v-if="error" class="text-red-500 text-sm mt-2">
                                {{ error }}
                            </p>
                        </form>
                    </div>

                    <div class="contact-side grid gap-6">
                        <div
                            class="rounded-[30px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
                            <p class="text-sm font-semibold uppercase tracking-[0.22em] text-[#0f766e]/70">
                                Sebelum Mengirim
                            </p>
                            <div class="mt-5 space-y-4">
                                <div class="rounded-2xl bg-slate-50 px-4 py-4">
                                    <h3 class="text-base font-semibold text-slate-900">
                                        Jelaskan kebutuhan utama
                                    </h3>
                                    <p class="mt-2 text-sm leading-6 text-slate-500">
                                        Tulis inti pertanyaanmu di awal supaya pesan lebih cepat dipahami.
                                    </p>
                                </div>

                                <div class="rounded-2xl bg-slate-50 px-4 py-4">
                                    <h3 class="text-base font-semibold text-slate-900">
                                        Tambahkan konteks penting
                                    </h3>
                                    <p class="mt-2 text-sm leading-6 text-slate-500">
                                        Misalnya halaman yang bermasalah, nama fitur, atau tujuan kerja samanya.
                                    </p>
                                </div>

                                <div class="rounded-2xl bg-slate-50 px-4 py-4">
                                    <h3 class="text-base font-semibold text-slate-900">
                                        Gunakan bahasa sederhana
                                    </h3>
                                    <p class="mt-2 text-sm leading-6 text-slate-500">
                                        Tidak perlu terlalu formal, yang penting pesannya jelas dan mudah
                                        ditindaklanjuti.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            class="rounded-[30px] border border-amber-100 bg-[linear-gradient(180deg,#fff8e6_0%,#ffffff_100%)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
                            <p class="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700/80">
                                Catatan
                            </p>
                            <h3 class="mt-3 text-xl font-semibold text-slate-900">
                                Halaman kontak sekarang lebih fokus ke pengalaman kirim pesan.
                            </h3>
                            <p class="mt-3 text-sm leading-7 text-slate-500">
                                Informasi kontak statis saya hilangkan sesuai kebutuhanmu, jadi tampilan terasa lebih
                                bersih dan user langsung tahu apa yang harus dilakukan di halaman ini.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'

useHead({
    title: "Kontak Kami"
})


const { sendPesan, loading, success, error } = useKontak()

const form = ref({
    nama: '',
    email: '',
    subjek: '',
    pesan: ''
})

const handleSubmit = async () => {
    await sendPesan(form.value)

    if (success.value) {
        form.value = {
            nama: '',
            email: '',
            subjek: '',
            pesan: ''
        }
    }
}

onMounted(() => {
    gsap.from('.kontak-hero', {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power3.out'
    })

    gsap.from('.contact-form', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.2
    })

    gsap.from('.contact-support, .contact-side', {
        opacity: 0,
        y: 24,
        duration: 0.8,
        delay: 0.3
    })
})
</script>
