<template>
    <div ref="mapContainer" class="w-full h-[420px] rounded-2xl z-0"></div>
</template>

<script setup>
import L from "leaflet"
import { ref, onMounted, nextTick } from "vue"
import { useLocation } from "@/composables/useLocation"

const emit = defineEmits(["location"])

const mapContainer = ref(null)
let map = null

const { getLocationName } = useLocation()

onMounted(async () => {

    await nextTick()

    if (!mapContainer.value) return

    map = L.map(mapContainer.value).setView([-6.326, 108.324], 13)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map)

    navigator.geolocation.getCurrentPosition(async (pos) => {

        const lat = pos.coords.latitude
        const lng = pos.coords.longitude

        map.setView([lat, lng], 15)

        L.marker([lat, lng])
            .addTo(map)
            .bindPopup("Lokasi Anda")
            .openPopup()

        const locationName = await getLocationName(lat, lng)

        emit("location", locationName)

    })

})
</script>