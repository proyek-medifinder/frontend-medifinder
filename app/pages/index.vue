<template>
  <section
    class="relative min-h-screen flex items-center overflow-hidden"
  >
    <!-- Background Image -->
    <div
      class="absolute inset-0 bg-cover bg-center"
      style="background-image: url('/images/image.png');"
    ></div>

    <!-- Overlay Gradient -->
    <div class="absolute inset-0 bg-gradient-to-r from-[#0f766e]/90 via-[#0f766e]/70 to-transparent"></div>

    <!-- Content -->
    <div class="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
      <!-- LEFT CONTENT -->
      <div class="text-white">
        <span
          class="inline-block mb-4 text-sm font-semibold tracking-wide text-yellow-300"
        >
          #ApotekTapiOnline
        </span>

        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Platform <br />
          <span class="text-white">Apotek Online</span>
        </h1>

        <p class="mt-6 text-lg text-white/90 max-w-xl">
          MediFinder membantu apotek menjangkau lebih banyak pelanggan
          melalui platform digital yang aman, cepat, dan terpercaya.
        </p>

        <div class="mt-8 flex flex-wrap gap-4">
          <NuxtLink
            to="/tentang"
            class="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-6 py-3 rounded-full transition"
          >
            Tentang MediFinder →
          </NuxtLink>

          <NuxtLink
            to="/daftar"
            class="inline-flex items-center gap-2 border border-white/70 text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-full transition"
          >
            Daftarkan Apotek
          </NuxtLink>
        </div>
      </div>

      <!-- RIGHT EMPTY (for balance / future image) -->
      <div class="hidden lg:block"></div>
    </div>
  </section>
</template>
