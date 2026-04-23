export const useApotekMap = () => {
    let map: any = null
    let markers: any[] = []

    const initMap = async (elId: string, apoteks: any[], center?: any) => {
        const leaflet = await import("leaflet")
        const L = leaflet.default

        // default center (kalau belum ada lokasi user)
        const lat = center?.lat || -6.4
        const lng = center?.lng || 108.2

        map = L.map(elId).setView([lat, lng], 12)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
            .addTo(map)

        // clear marker lama
        markers.forEach(m => m.remove())
        markers = []

        apoteks.forEach((a) => {
            if (!a.latitude || !a.longitude) return

            const marker = L.marker([a.latitude, a.longitude])
                .addTo(map)
                .bindPopup(`
                    <b>${a.nama}</b><br/>
                    ${a.alamat}
                `)

            markers.push(marker)
        })
    }

    return { initMap }
}