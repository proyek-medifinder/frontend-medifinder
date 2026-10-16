<template>
    <div>
        <div ref="mapContainer" class="w-full h-[420px] rounded-2xl z-0" aria-label="Peta lokasi Anda dan apotek dalam radius 5 km"></div>
        <div class="flex flex-wrap gap-4 px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
            <span><span class="text-blue-600">●</span> Lokasi Anda</span>
            <span><span class="text-emerald-600">✚</span> Apotek</span>
            <span>Radius pencarian: 5 km</span>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from "vue"

const props = defineProps({ apoteks: { type: Array, default: () => [] } })
const emit = defineEmits(["location", "location-error"])

const mapContainer = ref(null)
let map = null
let leaflet = null
let pharmacyMarkers = null
let userPosition = null
let disposed = false

const renderApoteks = () => {
    if (!map || !pharmacyMarkers || !userPosition) return
    pharmacyMarkers.clearLayers()
    const icon = leaflet.divIcon({
        className: 'pharmacy-map-marker',
        html: '<span style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border:3px solid white;border-radius:50%;background:#059669;color:white;font-size:22px;font-weight:bold;box-shadow:0 2px 6px #0004">✚</span>',
        iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -18]
    })
    for (const apotek of props.apoteks) {
        if (apotek.latitude == null || apotek.longitude == null ||
            String(apotek.latitude).trim() === '' || String(apotek.longitude).trim() === '') continue
        const lat = Number(apotek.latitude)
        const lng = Number(apotek.longitude)
        if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) continue
        const distance = map.distance(userPosition, [lat, lng])
        if (distance > 5000) continue

        // Render database values as text to keep popup content safe.
        const popup = document.createElement('div')
        const name = document.createElement('strong')
        name.textContent = apotek.nama
        const address = document.createElement('p')
        address.textContent = apotek.alamat
        const detail = document.createElement('a')
        detail.href = `/detailApotek/${encodeURIComponent(apotek.id)}`
        detail.textContent = `Lihat detail · ${(distance / 1000).toFixed(2)} km`
        popup.append(name, address, detail)
        leaflet.marker([lat, lng], { icon, title: apotek.nama })
            .bindPopup(popup).addTo(pharmacyMarkers)
    }
}

watch(() => props.apoteks, renderApoteks, { deep: true })

onMounted(async () => {

    await nextTick()

    if (!mapContainer.value) return

    const { setupLeafletDefaultIcon } = await import('@/utils/leaflet')
    leaflet = await setupLeafletDefaultIcon()
    if (disposed || !mapContainer.value) return

    map = leaflet.map(mapContainer.value).setView([-6.326, 108.324], 13)

    leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map)
    pharmacyMarkers = leaflet.layerGroup().addTo(map)

    if (!navigator.geolocation) {
        emit('location-error', 'Browser Anda tidak mendukung deteksi lokasi.')
        return
    }

    navigator.geolocation.getCurrentPosition((pos) => {
        if (disposed || !map) return
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude

        userPosition = [lat, lng]
        const area = leaflet.circle(userPosition, {
            radius: 5000, color: '#059669', weight: 1, fillOpacity: 0.06
        }).addTo(map)
        map.fitBounds(area.getBounds(), { padding: [20, 20] })

        leaflet.marker([lat, lng])
            .addTo(map)
            .bindPopup("Lokasi Anda")
            .openPopup()

        renderApoteks()
        emit("location", {
            lat,
            lng
        })
    }, (error) => {
        if (disposed) return
        emit('location-error', error.code === 1
            ? 'Izinkan akses lokasi untuk melihat apotek dalam radius 5 km.'
            : 'Lokasi belum dapat dideteksi. Muat ulang halaman untuk mencoba lagi.')
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 })

})

onBeforeUnmount(() => {
    disposed = true
    map?.remove()
    map = null
})
</script>
