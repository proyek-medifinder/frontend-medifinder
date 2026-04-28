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

  <section class="about-section relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f3fbf8_100%)] py-24">
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.1),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(250,204,21,0.08),_transparent_28%)]">
    </div>

    <div class="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-[0.95fr_1.05fr] gap-16 items-center">

      <!-- LEFT CONTENT -->
      <div>
        <span
          class="about-item inline-flex rounded-full bg-[#0f766e]/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-[#0f766e]">
          Tentang Medifinder
        </span>

        <h2 class="about-item mt-6 text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
          Platform Khusus <br />
          <span class="text-[#0f766e]">
            Untuk Pencarian <br />
            Apotek Online
          </span>
        </h2>

        <p class="about-item mt-6 max-w-xl text-gray-600 leading-8">
          Unduh aplikasi MediFinder dan temukan kemudahan akses ke lebih dari
          50.000 produk kesehatan...
        </p>

        <!-- FEATURES -->
        <div class="mt-10 grid sm:grid-cols-2 gap-4">
          <div
            class="about-item flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)] backdrop-blur">

            <span class="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#0f766e]/10 text-[#0f766e]">
              ✓
            </span>
            <span class="text-gray-700 font-medium">
              Pencarian apotek fleksibel
            </span>
          </div>

          <div
            class="about-item flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)] backdrop-blur">

            <span class="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#0f766e]/10 text-[#0f766e]">
              ✓
            </span>
            <span class="text-gray-700 font-medium">
              Konsultasi online
            </span>
          </div>

          <div
            class="about-item flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)] backdrop-blur">

            <span class="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#0f766e]/10 text-[#0f766e]">
              ✓
            </span>
            <span class="text-gray-700 font-medium">
              Beli obat dari rumah
            </span>
          </div>

          <div
            class="about-item flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)] backdrop-blur">

            <span class="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#0f766e]/10 text-[#0f766e]">
              ✓
            </span>
            <span class="text-gray-700 font-medium">
              Pilih apotek favorit
            </span>
          </div>
        </div>
      </div>

      <div
        class="rounded-[32px] border border-slate-200/70 bg-white/85 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              Lokasi Anda
            </h3>
            <p class="mt-1 text-sm text-slate-500">
              Pilih titik lokasi untuk menampilkan apotek yang paling relevan.
            </p>
          </div>

          <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Live area
          </span>
        </div>

        <div class="overflow-hidden rounded-[28px] border border-slate-200">
          <ClientOnly>
            <UserMap @location="handleLocation" />
          </ClientOnly>
        </div>

        <div class="mt-4 rounded-2xl bg-[#0f766e]/6 px-4 py-3">
          <p class="text-xs uppercase tracking-[0.16em] text-[#0f766e]/70">
            Lokasi terdeteksi
          </p>
          <p class="mt-1 text-sm font-semibold text-[#0f766e]">
            {{ userLocation }}
          </p>
        </div>
      </div>

    </div>
  </section>

  <section class="pharmacy-section relative overflow-hidden bg-[#eef8f4] py-24">
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(15,118,110,0.11),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.65),_transparent_35%)]">
    </div>
    <div class="relative max-w-7xl mx-auto px-6">

      <!-- TITLE -->
      <div class="pharmacy-item mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span
            class="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#0f766e] shadow-sm">
            Apotek Terdekat
          </span>
          <h2 class="mt-5 text-2xl md:text-4xl font-bold leading-tight text-gray-900">
            Daftar Apotek di Wilayah
            <span class="block text-[#0f766e]">
              {{ userLocation }}
            </span>
          </h2>
        </div>

        <div
          class="rounded-[24px] border border-white/70 bg-white/80 px-5 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur">
          <p class="text-xs uppercase tracking-[0.16em] text-slate-400">
            Hasil ditemukan
          </p>
          <p class="mt-2 text-2xl font-semibold text-slate-900">
            {{ apoteks.length }}
          </p>
          <p class="mt-1 text-sm text-slate-500">
            apotek aktif di sekitar lokasi
          </p>
        </div>
      </div>


      <!-- GRID -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

        <div v-if="apoteks.length === 0"
          class="col-span-full rounded-[32px] border border-dashed border-slate-300 bg-white/80 py-14 text-center text-gray-400 shadow-sm">
          Tidak ada apotek terdekat 😢
        </div>

        <div v-for="apotek in apoteks" :key="apotek.id"
          class="group flex flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_22px_60px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_28px_80px_rgba(15,23,42,0.14)]">

          <!-- IMAGE -->
          <div class="relative overflow-hidden">
            <img :src="getImage(apotek.PhotoURL)"
              class="h-48 w-full object-cover transition duration-500 group-hover:scale-105" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"></div>

            <div class="absolute left-4 top-4">
              <span class="rounded-full px-3 py-1 text-xs font-semibold backdrop-blur"
                :class="apotek.jam_buka ? 'bg-emerald-100/95 text-emerald-700' : 'bg-rose-100/95 text-rose-700'">
                {{ apotek.jam_buka ? 'Buka' : 'Tutup' }}
              </span>
            </div>
          </div>

          <!-- CONTENT -->
          <div class="flex flex-1 flex-col p-5">

            <!-- NAMA -->
            <h3 class="text-lg font-semibold text-gray-900">
              {{ apotek.nama }}
            </h3>

            <!-- ALAMAT -->
            <p class="mt-2 min-h-[48px] text-sm leading-6 text-gray-500">
              {{ apotek.alamat }}
            </p>

            <div class="mt-4 grid grid-cols-2 gap-3">
              <div class="rounded-2xl bg-slate-50 px-3 py-3">
                <p class="text-[11px] uppercase tracking-[0.14em] text-slate-400">
                  Jam
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-700">
                  {{ apotek.jam_buka || '-' }} - {{ apotek.jam_tutup || '-' }}
                </p>
              </div>

              <div class="rounded-2xl bg-slate-50 px-3 py-3">
                <p class="text-[11px] uppercase tracking-[0.14em] text-slate-400">
                  Jarak
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-700">
                  {{ apotek.distance ? `${apotek.distance.toFixed(2)} km` : 'Tidak diketahui' }}
                </p>
              </div>
            </div>

            <!-- 🔥 BUTTON DETAIL -->
            <NuxtLink :to="`/detailApotek/${apotek.id}`"
              class="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-yellow-300">
              Lihat Detail
              <span class="transition group-hover:translate-x-1">
                →
              </span>
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

const config = useRuntimeConfig()

const getImage = (url: string | null) => {
  if (!url) return '/images/istri.png'

  const clean = url.replace('/public', '')

  return config.public.apiBase + clean
}
</script>
