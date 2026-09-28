<template>
  <div class="fixed bottom-6 right-6 z-50 font-sans">
    <!-- 1. Floating Launcher Button -->
    <div class="relative flex items-center justify-end">
      <!-- Tooltip Helper (muncul saat tertutup) -->
      <transition 
        enter-active-class="transition duration-300 ease-out" 
        enter-from-class="opacity-0 translate-x-2"
        enter-to-class="opacity-100 translate-x-0" 
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0" 
        leave-to-class="opacity-0 translate-x-2"
      >
        <div 
          v-if="!isOpen && showTooltip"
          class="hidden sm:flex items-center gap-2 mr-3 px-3.5 py-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md text-slate-800 dark:text-slate-100 text-xs font-medium rounded-full shadow-lg border border-emerald-100 dark:border-slate-700 select-none cursor-pointer transition-colors"
          @click="toggleChat"
        >
          <span class="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Tanya <strong class="text-emerald-700 dark:text-emerald-400">MediBot</strong></span>
          <button 
            @click.stop="showTooltip = false" 
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-1 rounded-full p-0.5"
            title="Tutup tips"
          >
            ✕
          </button>
        </div>
      </transition>

      <!-- Tombol Bulat Toggle -->
      <button 
        type="button" 
        @click="toggleChat" 
        :aria-expanded="isOpen" 
        aria-label="Buka Asisten Chat MediBot"
        class="group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-[#0f766e] via-[#115e59] to-[#0d9488] text-white shadow-[0_8px_25px_rgba(15,118,110,0.4)] hover:shadow-[0_12px_32px_rgba(15,118,110,0.55)] transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-400/40 cursor-pointer"
      >
        <span 
          v-if="!isOpen"
          class="absolute -inset-1 rounded-full bg-teal-400/30 animate-ping pointer-events-none opacity-75 duration-1000"
        ></span>

        <div class="relative z-10 transition-transform duration-300" :class="{ 'rotate-90': isOpen }">
          <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg"
            class="w-7 h-7 md:w-8 md:h-8 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            <path d="M12 8v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <path d="M10 10h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>

        <span v-if="hasUnread && !isOpen" class="absolute top-0 right-0 flex h-4 w-4">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white text-[9px] font-bold text-slate-900 items-center justify-center">1</span>
        </span>
      </button>
    </div>

    <!-- 2. Chat Window Popup -->
    <transition 
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-6 scale-95" 
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in" 
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-6 scale-95"
    >
      <div 
        v-if="isOpen"
        class="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[600px] max-h-[82vh] bg-white dark:bg-slate-900 rounded-3xl shadow-[0_20px_60px_-15px_rgba(15,118,110,0.35)] border border-emerald-100/80 dark:border-slate-800 flex flex-col overflow-hidden z-50 backdrop-blur-xl transition-colors duration-300"
      >
        <!-- Header -->
        <div class="relative bg-gradient-to-r from-[#0f766e] via-[#115e59] to-[#14b8a6] px-5 py-4 text-white flex items-center justify-between shadow-md shrink-0">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_55%)] pointer-events-none"></div>

          <div class="relative z-10 flex items-center gap-3">
            <div class="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-white/15 border border-white/25 shadow-inner">
              <span class="text-xl">🩺</span>
              <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0f766e]"></span>
            </div>

            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-base tracking-tight leading-tight">MediBot</h3>
                <span class="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-white/20 text-emerald-100 rounded-md">
                  AI Groq
                </span>
              </div>
              <p class="text-xs text-emerald-100/90 flex items-center gap-1.5 mt-0.5">
                <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                Online &bull; Asisten MediFinder
              </p>
            </div>
          </div>

          <!-- Top Actions -->
          <div class="relative z-10 flex items-center gap-1">
            <button 
              type="button" 
              @click="resetChat"
              class="p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Mulai Ulang Percakapan"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
            <button 
              type="button" 
              @click="toggleChat"
              class="p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Tutup Chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Messages Feed -->
        <div 
          ref="messagesContainer"
          class="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/50 dark:from-slate-950/80 dark:via-slate-900/90 dark:to-slate-950/80 scroll-smooth transition-colors"
        >
          <div class="flex justify-center my-1">
            <span class="text-[11px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 px-3 py-1 rounded-full text-center">
              Skrining Usia &bull; Rekomendasi Obat &bull; Apotek Terdekat
            </span>
          </div>

          <!-- Loop Pesan -->
          <div 
            v-for="msg in messages" 
            :key="msg.id" 
            class="flex flex-col"
            :class="msg.sender === 'user' ? 'items-end' : 'items-start'"
          >
            <div 
              class="flex items-end gap-2 max-w-[90%]" 
              :class="msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'"
            >
              <div 
                v-if="msg.sender === 'bot'"
                class="w-7 h-7 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center text-xs shadow-sm shrink-0 mb-0.5"
              >
                🩺
              </div>

              <!-- Bubble Chat -->
              <div 
                class="rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all" 
                :class="[
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-[#0f766e] to-[#14967f] text-white rounded-br-xs shadow-teal-700/10'
                    : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-xs shadow-slate-200/60 dark:shadow-none'
                ]"
              >
                <p class="whitespace-pre-line">{{ msg.text }}</p>

                <!-- 📍 KARTU PILIHAN USIA (HANYA MUNCUL DI PESAN PERTAMA JIKA BELUM PILIH USIA) -->
                <div v-if="msg.id === 'welcome' && !selectedAgeGroup" class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <p class="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2">Pilih Kelompok Usia Pasien:</p>
                  <div class="grid grid-cols-2 gap-2">
                    <button 
                      v-for="opt in ageOptions" 
                      :key="opt.value"
                      type="button"
                      @click="selectAge(opt)"
                      class="flex flex-col items-start p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 transition-all text-left group cursor-pointer shadow-2xs"
                    >
                      <span class="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">{{ opt.label }}</span>
                      <span class="text-[10px] text-slate-500 dark:text-slate-400">{{ opt.desc }}</span>
                    </button>
                  </div>
                </div>

                <!-- 📍 KARTU APOTEK REKOMENDASI (DARI BACKEND) -->
                <div v-if="msg.data && msg.data.pharmacies && msg.data.pharmacies.length > 0" class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                  
                  <!-- Badge Status Ketersediaan -->
                  <div class="mb-2.5">
                    <span 
                      v-if="msg.data.is_nearby" 
                      class="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full"
                    >
                      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Tersedia di Apotek Terdekat
                    </span>
                    <span 
                      v-else 
                      class="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-full"
                    >
                      <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                      Tersedia di Luar Jangkauan Sekitar
                    </span>
                  </div>

                  <!-- Daftar Kartu Apotek -->
                  <div class="space-y-2">
                    <div 
                      v-for="apotek in msg.data.pharmacies" 
                      :key="apotek.apotek_id"
                      class="p-2.5 bg-slate-50/90 dark:bg-slate-900/90 hover:bg-emerald-50/60 dark:hover:bg-slate-850 rounded-xl border border-slate-200/80 dark:border-slate-700 transition-colors shadow-2xs"
                    >
                      <div class="flex items-start justify-between gap-1">
                        <h4 class="font-bold text-slate-800 dark:text-slate-100 text-xs">{{ apotek.nama }}</h4>
                        <span class="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950 px-1.5 py-0.5 rounded-md shrink-0">
                          {{ apotek.distance_km.toFixed(1) }} km
                        </span>
                      </div>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">📍 {{ apotek.alamat }}</p>

                      <!-- ⏰ INFORMASI STATUS BUKA / TUTUP -->
                      <div class="flex items-center gap-1.5 my-1.5">
                        <span 
                          v-if="isPharmacyOpen(apotek)" 
                          class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full"
                        >
                          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Buka (Tutup {{ apotek.jam_tutup }})
                        </span>
                        <span 
                          v-else 
                          class="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100/80 dark:bg-rose-950/80 px-2 py-0.5 rounded-full"
                        >
                          <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          Sedang Tutup (Buka {{ apotek.jam_buka }} - {{ apotek.jam_tutup }})
                        </span>
                      </div>
                      
                      <div class="flex items-center justify-between mt-1 pt-1.5 border-t border-slate-200/50 dark:border-slate-700/60 text-[11px]">
                        <span class="font-bold text-emerald-700 dark:text-emerald-400">Rp {{ apotek.harga.toLocaleString('id-ID') }}</span>
                        <span class="text-slate-500 dark:text-slate-400 text-[10px]">Stok: <strong class="text-slate-700 dark:text-slate-200">{{ apotek.stok }}</strong></span>
                      </div>

                      <!-- 🗺️ TOMBOL BUKA RUTE GOOGLE MAPS -->
                      <a 
                        :href="`https://www.google.com/maps/dir/?api=1&destination=${apotek.latitude},${apotek.longitude}`" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="mt-2 flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200/80 dark:border-emerald-800/80 transition-colors shadow-2xs group cursor-pointer"
                      >
                        <span>📍</span>
                        <span>Buka Rute di Google Maps</span>
                        <span class="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                      </a>
                    </div>
                  </div>
                </div>

                <!-- ⚠️ KONDISI JIKA OBAT TIDAK TERSEDIA DI APOTEK SEKITAR -->
                <div 
                  v-if="msg.data && msg.data.availability === 'EMPTY' && msg.data.medicine_name" 
                  class="mt-3 p-3 bg-amber-50/80 dark:bg-amber-950/40 rounded-2xl border border-amber-200/80 dark:border-amber-800/60 text-slate-700 dark:text-slate-200 shadow-2xs"
                >
                  <div class="flex items-start gap-2.5">
                    <span class="text-base leading-none mt-0.5">🏪</span>
                    <div class="flex-1">
                      <p class="text-xs font-bold text-amber-900 dark:text-amber-300 leading-snug">
                        Belum Tersedia di Apotek Sekitarmu
                      </p>
                      <p class="text-[11px] text-amber-800/90 dark:text-amber-200/90 mt-1 leading-relaxed">
                        Sayang sekali, apotek di sekitar lokasimu saat ini belum ada yang menyediakan <strong>{{ msg.data.medicine_name }}</strong>.
                      </p>
                      <p class="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                        Kamu bisa mencoba mencarinya di fitur <strong>Katalog Produk</strong>, siapa tahu ada apotek mitra di wilayah lain yang menyediakannya!
                      </p>

                      <NuxtLink 
                        :to="`/katalog?search=${encodeURIComponent(msg.data.medicine_name)}`"
                        class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-emerald-300 dark:border-emerald-700 px-3 py-1.5 rounded-full mt-2.5 transition-all shadow-2xs active:scale-95"
                      >
                        <span>🔍 Cek "{{ msg.data.medicine_name }}" di Katalog</span>
                        <span aria-hidden="true">&rarr;</span>
                      </NuxtLink>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <!-- Jam Pesan -->
            <span 
              class="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1" 
              :class="msg.sender === 'user' ? 'mr-1' : 'ml-9'"
            >
              {{ formatTime(msg.timestamp) }}
            </span>
          </div>

          <!-- Indikator Loading Saat AI Berpikir -->
          <div v-if="isLoading" class="flex items-end gap-2">
            <div class="w-7 h-7 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center text-xs shadow-sm shrink-0 mb-0.5">
              🩺
            </div>
            <div class="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-bl-xs px-4 py-3 shadow-sm flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]"></span>
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]"></span>
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
              <span class="text-xs text-slate-400 dark:text-slate-500 font-medium ml-1">Menganalisis usia & mencari obat...</span>
            </div>
          </div>
        </div>

        <!-- Input Bar Pesan -->
        <div class="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0 transition-colors">
          <!-- Indikator Usia yang sedang terpilih -->
          <div v-if="selectedAgeGroup" class="flex items-center justify-between px-2 pb-2 text-[11px] text-emerald-700 dark:text-emerald-400">
            <span>Usia pasien: <strong>{{ selectedAgeGroup }}</strong></span>
            <button @click="resetChat" class="text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline text-[10px]">Ganti usia</button>
          </div>

          <form @submit.prevent="handleSendMessage" class="flex items-center gap-2">
            <div class="relative flex-1">
              <input 
                v-model="inputQuery" 
                type="text" 
                :placeholder="selectedAgeGroup ? 'Ceritakan keluhan atau gejala...' : 'Silakan pilih rentang usia di atas dahulu'" 
                maxlength="250"
                class="w-full bg-slate-100/90 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm rounded-full pl-4 pr-10 py-2.5 border border-transparent focus:border-emerald-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-all disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-850"
                :disabled="isLoading || !selectedAgeGroup" 
              />
              <button 
                v-if="inputQuery.trim()" 
                type="button" 
                @click="inputQuery = ''"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <!-- Tombol Kirim -->
            <button 
              type="submit" 
              :disabled="!inputQuery.trim() || isLoading || !selectedAgeGroup"
              class="w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm shrink-0"
              :class="[
                inputQuery.trim() && !isLoading && selectedAgeGroup
                  ? 'bg-gradient-to-r from-[#0f766e] to-[#14b8a6] text-white hover:scale-105 active:scale-95 shadow-teal-700/20 cursor-pointer'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
              ]" 
              aria-label="Kirim Pesan"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 translate-x-0.5" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>

          <p class="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-2">
            💡 Informasi AI bersifat edukatif, bukan pengganti resep dokter resmi.
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'

const { messages, isLoading, selectedAgeGroup, selectedAge, sendMessage, clearMessages } = useChatbot()

const isOpen = ref(false)
const showTooltip = ref(true)
const hasUnread = ref(true)
const inputQuery = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

// Pilihan kartu rentang usia
const ageOptions = [
  { label: '👶 Balita', desc: '< 2 tahun', value: 'Balita (< 2 tahun)', age: 1 },
  { label: '🧒 Anak-anak', desc: '2 - 12 tahun', value: 'Anak-anak (2-12 tahun)', age: 7 },
  { label: '🧑 Remaja & Dewasa', desc: '12 - 59 tahun', value: 'Dewasa (12-59 tahun)', age: 25 },
  { label: '🧓 Lansia', desc: '≥ 60 tahun', value: 'Lansia (≥ 60 tahun)', age: 65 },
]

const selectAge = (opt: typeof ageOptions[0]) => {
  selectedAgeGroup.value = opt.value
  selectedAge.value = opt.age

  messages.value.push({
    id: Date.now().toString(),
    sender: 'user',
    text: `Pasien: ${opt.label} (${opt.desc})`,
    timestamp: new Date()
  })

  setTimeout(() => {
    messages.value.push({
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: `Baik, usia pasien: ${opt.label} (${opt.desc}) dicatat! 📝\n\nSekarang, ceritakan gejala atau keluhan apa yang sedang dialami?`,
      timestamp: new Date()
    })
    scrollToBottom()
  }, 350)
}

const formatTime = (date?: Date) => {
  if (!date) return ''
  return new Date(date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    hasUnread.value = false
    showTooltip.value = false
    scrollToBottom()
  }
}

const resetChat = () => {
  clearMessages()
  scrollToBottom()
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch([messages, isLoading], () => {
  scrollToBottom()
}, { deep: true })

const handleSendMessage = async () => {
  const text = inputQuery.value.trim()
  if (!text || isLoading.value || !selectedAgeGroup.value) return

  inputQuery.value = ''
  scrollToBottom()

  await sendMessage(text)
  scrollToBottom()
}

const parseTimeToMinutes = (timeStr?: string | null): number | null => {
  if (!timeStr || timeStr === '-') return null
  const parts = String(timeStr).slice(0, 5).split(':')
  if (parts.length < 2) return null
  const h = Number(parts[0])
  const m = Number(parts[1])
  if (Number.isNaN(h) || Number.isNaN(m)) return null
  return h * 60 + m
}

const isPharmacyOpen = (apotek: any) => {
  if (!apotek?.jam_buka || !apotek?.jam_tutup || apotek.jam_buka === '-' || apotek.jam_tutup === '-') {
    return apotek?.is_open ?? true
  }

  const openMinutes = parseTimeToMinutes(apotek.jam_buka)
  const closeMinutes = parseTimeToMinutes(apotek.jam_tutup)

  if (openMinutes === null || closeMinutes === null) {
    return apotek?.is_open ?? true
  }

  if (openMinutes === closeMinutes) return true

  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  if (openMinutes < closeMinutes) {
    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes
  }

  return currentMinutes >= openMinutes || currentMinutes <= closeMinutes
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
