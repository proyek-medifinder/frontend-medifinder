export const useMapPicker = () => {
    let map: any = null
    let marker: any = null

    const initMap = async (elId: string, form: any, isEdit: any) => {
        const leaflet = await import("leaflet")
        const L = leaflet.default

        map = L.map(elId).setView(
            [form.value.latitude || -6.4, form.value.longitude || 108.2],
            13
        )

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
            .addTo(map)

        if (form.value.latitude && form.value.longitude) {
            marker = L.marker([form.value.latitude, form.value.longitude])
                .addTo(map)
        }

        map.on("click", (e: any) => {
            if (!isEdit.value) return

            const { lat, lng } = e.latlng
            form.value.latitude = lat
            form.value.longitude = lng

            if (marker) {
                marker.setLatLng(e.latlng)
            } else {
                marker = L.marker(e.latlng).addTo(map)
            }
        })
    }

    return { initMap }
}