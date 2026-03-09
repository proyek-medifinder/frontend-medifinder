export const useLocation = () => {

    const getLocationName = async (lat: number, lng: number) => {

        const data: any = await $fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        )

        const address = data.address || {}

        const kecamatan =
            address.suburb ||
            address.village ||
            address.town ||
            address.city_district ||
            ""

        const kota =
            address.city ||
            address.regency ||
            address.county ||
            ""

        const provinsi =
            address.state || ""

        return `${kecamatan}, ${kota}, ${provinsi}`
    }

    return { getLocationName }
}