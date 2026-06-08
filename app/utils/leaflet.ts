import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png?url'
import markerIcon from 'leaflet/dist/images/marker-icon.png?url'
import markerShadow from 'leaflet/dist/images/marker-shadow.png?url'

let leafletIconsConfigured = false

export const setupLeafletDefaultIcon = async () => {
    const leaflet = await import('leaflet')
    const L = leaflet.default

    if (leafletIconsConfigured) return L

    delete (L.Icon.Default.prototype as any)._getIconUrl

    L.Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2x,
        iconUrl: markerIcon,
        shadowUrl: markerShadow
    })

    leafletIconsConfigured = true

    return L
}
