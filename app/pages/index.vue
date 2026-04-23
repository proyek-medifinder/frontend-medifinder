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

          <NuxtLink to="/admin/login" class="inline-flex items-center gap-2 border border-white/70 text-white
           hover:bg-white/10 font-semibold px-6 py-3 rounded-full
           transition-all duration-200 ease-out
           hover:scale-105 hover:-translate-y-1 hover:shadow-lg">
            Daftarkan Apotek anda
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

      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Lokasi Anda
        </h3>

        <ClientOnly>
          <UserMap @location="handleLocation" />
        </ClientOnly>

        <p class="mt-3 text-sm text-[#0f766e] font-medium">
          {{ userLocation }}
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
          {{ userLocation }}
        </span>
      </h2>


      <!-- GRID -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

        <div v-if="apoteks.length === 0" class="text-center py-10 text-gray-400">
          Tidak ada apotek terdekat 😢
        </div>

        <div v-for="apotek in apoteks" :key="apotek.id"
          class="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col">

          <!-- IMAGE -->
          <img src="/images/istri.png" class="w-full h-40 object-cover" />

          <!-- CONTENT -->
          <div class="p-5 flex flex-col flex-1 text-center">

            <!-- NAMA -->
            <h3 class="font-semibold text-lg text-gray-900">
              {{ apotek.nama }}
            </h3>

            <!-- ALAMAT -->
            <p class="text-sm text-gray-500 mt-1">
              {{ apotek.alamat }}
            </p>

            <!-- STATUS -->
            <div class="mt-3">
              <span class="text-xs px-3 py-1 rounded-full font-medium"
                :class="apotek.jam_buka ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
                {{ apotek.jam_buka ? 'Buka' : 'Tutup' }}
              </span>
            </div>

            <!-- JAM -->
            <p class="text-xs text-gray-400 mt-2">
              {{ apotek.jam_buka || '-' }} - {{ apotek.jam_tutup || '-' }}
            </p>

            <!-- DISTANCE -->
            <p v-if="apotek.distance" class="text-xs text-gray-400">
              {{ apotek.distance.toFixed(2) }} km
            </p>

            <!-- 🔥 BUTTON DETAIL -->
            <NuxtLink :to="`/detailApotek/${apotek.id}`"
              class="mt-4 inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 text-xs font-semibold px-4 py-2 rounded-full transition hover:scale-105">
              Lihat Detail
            </NuxtLink>

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

definePageMeta({
  layout: 'default'
})

useHead({
  title: "Kemitraan"
})

gsap.registerPlugin(ScrollTrigger)

// ========================
// STATE
// ========================
const userLocation = ref("Mendeteksi lokasi...")

// ========================
// COMPOSABLE
// ========================
const { apoteks, initNearby } = useNearbyApotek()
const { getLocationName } = useLocation()

// ========================
// MAIN
// ========================



onMounted(async () => {
  await nextTick()

  // 🔥 ambil lokasi + apotek
  // optional: auto load pertama
  const loc = await initNearby()

  if (loc) {
    const name = await getLocationName(loc.lat, loc.lng)
    userLocation.value = name
  }

  console.log("📦 APOTEK:", apoteks.value)


  // ========================
  // ANIMASI (TIDAK DIUBAH)
  // ========================

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

  /* PHARMACY */
  const cards = gsap.utils.toArray('.pharmacy-item')

  gsap.from(cards, {
    scrollTrigger: {
      trigger: '.pharmacy-section',
      start: 'top 85%',
    },
    opacity: 0,
    y: 60,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out',
  })

  ScrollTrigger.refresh()
})

const handleLocation = async (loc: any) => {
  console.log("📍 lokasi user:", loc)

  if (!loc?.lat || !loc?.lng) return

  userLocation.value = loc.name

  // 🔥 fetch apotek berdasarkan lokasi user
  await initNearby(loc.lat, loc.lng)

  console.log("📦 apotek:", apoteks.value)
}
</script>
