<template>
  <section class="relative min-h-screen flex items-center overflow-hidden">
    <!-- Background Image -->
    <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('/images/bg.png');"></div>

    <!-- Overlay Gradient -->
    <div class="absolute inset-0 bg-gradient-to-r from-[#0f766e]/90 via-[#0f766e]/70 to-transparent"></div>

    <!-- Content -->
    <div class="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
      <!-- LEFT CONTENT -->
      <div class="text-white">
        <span class="hero-item inline-block mb-4 text-sm font-semibold tracking-wide text-yellow-300">
          #ApotekTapiOnline
        </span>

        <h1 class="hero-item text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Platform <br />
          <span class="text-white">Apotek Online</span>
        </h1>

        <p class="hero-item mt-6 text-lg text-white/90 max-w-xl">
          MediFinder membantu apotek menjangkau lebih banyak pelanggan
          melalui platform digital yang aman, cepat, dan terpercaya.
        </p>

        <div class="mt-8 flex flex-wrap gap-4">
          <NuxtLink to="/tentang" class="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300
           text-gray-900 font-semibold px-6 py-3 rounded-full
           transition-all duration-200 ease-out
           hover:scale-105 hover:-translate-y-1 hover:shadow-lg">
            Tentang MediFinder →
          </NuxtLink>

          <NuxtLink to="/daftar" class="inline-flex items-center gap-2 border border-white/70 text-white
           hover:bg-white/10 font-semibold px-6 py-3 rounded-full
           transition-all duration-200 ease-out
           hover:scale-105 hover:-translate-y-1 hover:shadow-lg">
            Daftarkan Apotek
          </NuxtLink>
        </div>

      </div>

      <!-- RIGHT EMPTY (for balance / future image) -->
      <div class="hidden lg:block"></div>
    </div>
  </section>

  <section class="about-section bg-white py-24">

    <div class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

      <!-- LEFT CONTENT -->
      <div>
        <span class="about-item text-sm font-semibold text-gray-500 uppercase">
          Tentang Medifinder
        </span>

        <h2 class="about-item mt-4 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          Platform Khusus <br />
          <span class="text-[#0f766e]">
            Untuk Pencarian <br />
            Apotek Online
          </span>
        </h2>

        <p class="about-item mt-6 text-gray-600 leading-relaxed max-w-xl">
          Unduh aplikasi MediFinder dan temukan kemudahan akses ke lebih dari
          50.000 produk kesehatan...
        </p>

        <!-- FEATURES -->
        <div class="mt-8 grid sm:grid-cols-2 gap-4">
          <div class="about-item flex items-center gap-3">

            <span class="flex items-center justify-center w-8 h-8 rounded-full bg-[#0f766e]/10 text-[#0f766e]">
              ✓
            </span>
            <span class="text-gray-700 font-medium">
              Pencarian apotek fleksibel
            </span>
          </div>

          <div class="about-item flex items-center gap-3">

            <span class="flex items-center justify-center w-8 h-8 rounded-full bg-[#0f766e]/10 text-[#0f766e]">
              ✓
            </span>
            <span class="text-gray-700 font-medium">
              Konsultasi online
            </span>
          </div>

          <div class="about-item flex items-center gap-3">

            <span class="flex items-center justify-center w-8 h-8 rounded-full bg-[#0f766e]/10 text-[#0f766e]">
              ✓
            </span>
            <span class="text-gray-700 font-medium">
              Beli obat dari rumah
            </span>
          </div>

          <div class="about-item flex items-center gap-3">

            <span class="flex items-center justify-center w-8 h-8 rounded-full bg-[#0f766e]/10 text-[#0f766e]">
              ✓
            </span>
            <span class="text-gray-700 font-medium">
              Pilih apotek favorit
            </span>
          </div>
        </div>
      </div>

      <!-- RIGHT MAP (DUMMY) -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Lokasi Anda
        </h3>

        <div class="map-card relative w-full h-[420px] rounded-2xl overflow-hidden shadow-lg bg-gray-200">
          <!-- Dummy Map Background -->
          <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('/images/map-dummy.png');">
          </div>

          <!-- Marker -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="relative">
              <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-white px-3 py-1 text-sm rounded-lg shadow">
                Lokasi Anda
              </span>
              <div class="w-6 h-6 bg-[#0f766e] rounded-full border-4 border-white shadow-lg"></div>
            </div>
          </div>
        </div>

        <p class="mt-3 text-sm text-[#0f766e] font-medium">
          Lohbener, Kec. Indramayu, Jawa Barat
        </p>
      </div>

    </div>
  </section>

  <section class="pharmacy-section bg-slate-50 py-24">
    <div class="max-w-7xl mx-auto px-6">

      <!-- TITLE -->
      <h2 class="pharmacy-item text-2xl md:text-3xl font-bold text-gray-900 mb-12">
        Daftar Apotek di Wilayah
        <span class="text-[#0f766e]">
          Lohbener, Kec.Indramayu, Jawa Barat
        </span>
      </h2>

      <!-- GRID -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="i in 4" :key="i"
          class="pharmacy-item bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden">
          <!-- IMAGE -->
          <img src="/images/istri.png" class="w-full h-40 object-cover" />

          <!-- CONTENT -->
          <div class="p-5 text-center">
            <h3 class="font-semibold text-lg text-gray-900">
              Apotek Test {{ i }}
            </h3>

            <p class="text-sm text-gray-500 mt-1">
              Lohbener
            </p>

            <!-- STATUS -->
            <div class="mt-3">
              <span class="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-medium">
                Tutup
              </span>
            </div>

            <!-- BUTTON -->
            <button
              class="mt-4 bg-yellow-400 hover:bg-yellow-300 px-5 py-2 rounded-full text-sm font-semibold shadow transition hover:scale-105">
              Lihat Detail
            </button>
          </div>
        </div>
      </div>

    </div>
  </section>




</template>


<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

useHead({
    title: "Kemitraan"
})

gsap.registerPlugin(ScrollTrigger)

onMounted(async () => {
  await nextTick()

  /* HERO */
  gsap.from('.hero-item', {
    opacity: 0,
    y: 40,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out',
  })

  /* ABOUT */
  gsap.from('.about-item', {
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top 75%',
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
  })

  /* MAP */
  gsap.from('.map-card', {
    scrollTrigger: {
      trigger: '.map-card',
      start: 'top 80%',
    },
    opacity: 0,
    x: 40,
    duration: 0.8,
    ease: 'power3.out',
  })

  /* PHARMACY (FIXED) */
  const cards = gsap.utils.toArray('.pharmacy-item')

  gsap.from(cards, {
    scrollTrigger: {
      trigger: '.pharmacy-section',
      start: 'top 85%',
      toggleActions: 'play none none none',
      invalidateOnRefresh: true
    },
    opacity: 0,
    y: 60,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out',
  })

  ScrollTrigger.refresh()

})
</script>
