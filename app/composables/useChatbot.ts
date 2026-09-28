import { ref, onMounted, watch } from "vue";

export interface Pharmacy {
    apotek_id: string;
    nama: string;
    alamat: string;
    latitude?: number;    
    longitude?: number;   
    distance_km: number;
    harga: number;
    stok: number;
    jam_buka?: string;
    jam_tutup?: string;
    is_open?: boolean;
}


export interface ChatResponseData {
    reply: string;
    medicine_name: string;
    availability: "NEARBY" | "OUTSIDE_RADIUS" | "EMPTY" | "NO_MEDICINE_NEEDED";
    is_nearby: boolean;
    pharmacies: Pharmacy[];
}

export interface ChatMessage {
    id: string;
    sender: "user" | "bot";
    text: string;
    timestamp: Date;
    data?: ChatResponseData;
}

export const useChatbot = () => {
    // State rentang usia pasien
    const selectedAgeGroup = ref<string>("");
    const selectedAge = ref<number>(0);

    // Pesan selamat datang awal
    const welcomeMessage: ChatMessage = {
        id: "welcome",
        sender: "bot",
        text: "Halo! Saya asisten apoteker MediFinder 🩺\n\nAgar rekomendasi obat dan bentuk sediaan (sirup/tablet) tepat dan aman, silakan pilih kelompok usia pasien terlebih dahulu:",
        timestamp: new Date(),
    };

    const messages = ref<ChatMessage[]>([welcomeMessage]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // 1. Muat riwayat dari localStorage saat halaman dibuka/direfresh
    onMounted(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("medibot_history");
            const savedAgeGroup = localStorage.getItem("medibot_age_group");
            const savedAge = localStorage.getItem("medibot_age");

            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        messages.value = parsed;
                    }
                    if (savedAgeGroup) selectedAgeGroup.value = savedAgeGroup;
                    if (savedAge) selectedAge.value = Number(savedAge) || 0;
                } catch (e) {
                    console.error("Gagal membaca riwayat chat dari localStorage:", e);
                }
            }
        }
    });

    // 2. Setiap kali ada pesan baru, otomatis simpan ke localStorage
    watch(
        messages,
        (newMessages) => {
            if (typeof window !== "undefined") {
                localStorage.setItem("medibot_history", JSON.stringify(newMessages));
                localStorage.setItem("medibot_age_group", selectedAgeGroup.value);
                localStorage.setItem("medibot_age", selectedAge.value.toString());
            }
        },
        { deep: true }
    );

    // Helper mendapatkan GPS browser
    const getCoordinates = (): Promise<{ lat: number; lng: number }> => {
        return new Promise((resolve) => {
            if (typeof window === "undefined" || !navigator.geolocation) {
                resolve({ lat: 0, lng: 0 });
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => {
                    console.warn("Izin lokasi ditolak/gagal:", err.message);
                    resolve({ lat: 0, lng: 0 });
                },
                { timeout: 8000 }
            );
        });
    };

    // Fungsi kirim pesan keluhan
    const sendMessage = async (userText: string) => {
        if (!userText.trim() || isLoading.value) return;

        error.value = null;

        // 1. Masukkan pesan pengguna ke bubble
        messages.value.push({
            id: Date.now().toString(),
            sender: "user",
            text: userText,
            timestamp: new Date(),
        });

        isLoading.value = true;

        try {
            const coords = await getCoordinates();
            const config = useRuntimeConfig();

            // 2. Kirim ke backend Go
            const res = await $fetch<ChatResponseData>("/api/chat", {
                baseURL: (config.public.apiBase || config.public.apiUrl) as string,
                method: "POST",
                body: {
                    message: userText,
                    age_group: selectedAgeGroup.value,
                    age: selectedAge.value,
                    latitude: coords.lat,
                    longitude: coords.lng,
                },
            });

            // 3. Masukkan balasan AI ke bubble
            messages.value.push({
                id: (Date.now() + 1).toString(),
                sender: "bot",
                text: res.reply,
                timestamp: new Date(),
                data: res,
            });
        } catch (err: any) {
            console.error("Error chatbot API:", err);
            error.value = err.data?.error || "Gagal menghubungi server.";

            messages.value.push({
                id: (Date.now() + 1).toString(),
                sender: "bot",
                text: "Maaf, terjadi kendala saat memproses permintaan Anda. Pastikan koneksi backend aktif.",
                timestamp: new Date(),
            });
        } finally {
            isLoading.value = false;
        }
    };

    // 3. Reset percakapan dan bersihkan localStorage
    const clearMessages = () => {
        selectedAgeGroup.value = "";
        selectedAge.value = 0;
        messages.value = [welcomeMessage];

        if (typeof window !== "undefined") {
            localStorage.removeItem("medibot_history");
            localStorage.removeItem("medibot_age_group");
            localStorage.removeItem("medibot_age");
        }
    };

    return {
        messages,
        isLoading,
        error,
        selectedAgeGroup,
        selectedAge,
        sendMessage,
        clearMessages,
    };
};
