<template>
    <div class="bg-slate-50 min-h-screen pb-24">

        <!-- HERO -->
        <section class="kontak-hero pt-36 pb-10">
            <div class="max-w-6xl mx-auto px-6">
                <h1 class="text-4xl font-bold text-gray-900">
                    Kontak Kami
                </h1>
                <p class="text-gray-500 mt-2">
                    Punya pertanyaan atau ingin bekerja sama dengan MediFinder?
                </p>
            </div>
        </section>

        <!-- CONTENT -->
        <section class="mt-6">
            <div class="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-8">

                <!-- FORM -->
                <div class="contact-form bg-white rounded-2xl shadow-sm p-8">

                    <h2 class="text-lg font-semibold text-gray-900 mb-6">
                        Kirim Pesan
                    </h2>

                    <form class="space-y-4">
                        <input type="text" placeholder="Nama"
                            class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />

                        <input type="email" placeholder="Email"
                            class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />

                        <input type="text" placeholder="No Handphone"
                            class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />

                        <textarea rows="5" placeholder="Pesan"
                            class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#0f766e]"></textarea>

                        <button
                            class="bg-[#0f766e] hover:bg-[#115e59] text-white px-6 py-3 rounded-xl font-semibold transition">
                            Kirim Pesan
                        </button>
                    </form>
                </div>

                <!-- INFO -->
                <div class="contact-info bg-white rounded-2xl shadow-sm p-8 flex flex-col justify-center">

                    <h2 class="text-lg font-semibold text-gray-900 mb-6">
                        Informasi Kontak
                    </h2>

                    <div class="space-y-5 text-gray-600">

                        <div>
                            <p class="text-sm text-gray-400">Email</p>
                            <p class="font-medium">support@medifinder.id</p>
                        </div>

                        <div>
                            <p class="text-sm text-gray-400">Telepon</p>
                            <p class="font-medium">+62 812-3456-7890</p>
                        </div>

                        <div>
                            <p class="text-sm text-gray-400">Alamat</p>
                            <p class="font-medium">
                                Indramayu, Jawa Barat
                            </p>
                        </div>

                    </div>

                    <!-- MAP PLACEHOLDER -->
                    <div class="mt-8 h-40 bg-slate-100 rounded-xl flex items-center justify-center text-gray-400">
                        Map Preview
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

onMounted(() => {
    gsap.from('.kontak-hero', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out'
    })

    gsap.from('.contact-form', {
        opacity: 0,
        x: -40,
        duration: 0.8,
        delay: 0.2
    })

    gsap.from('.contact-info', {
        opacity: 0,
        x: 40,
        duration: 0.8,
        delay: 0.3
    })
})
</script>
