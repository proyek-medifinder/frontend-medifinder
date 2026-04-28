export const useCart = () => {
    const config = useRuntimeConfig()
    const token = useCookie<string | null>('auth_token')

    const cart = useState<any>('cart_data', () => null)
    const loading = ref(false)

    /* =========================
    GET CART
    ========================= */
    const fetchCart = async () => {
        try {
            const res: any = await $fetch(
                `${config.public.apiBase}/cart`,
                {
                    headers: {
                        Authorization: `Bearer ${token.value}`,
                        'ngrok-skip-browser-warning': 'true'
                    }
                }
            )

            console.log("🛒 CART API:", res)

            // 🔥 FIX DISINI
            cart.value = res || { items: [], total: 0 }

        } catch (err) {
            console.error(err)
            cart.value = { items: [], total: 0 }
        }
    }

    /* =========================
    ADD ITEM
    ========================= */
    const addToCart = async (obat: any) => {
        if (!token.value) return { needLogin: true }

        try {
            await $fetch(`${config.public.apiBase}/cart/items`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: {
                    obat_id: obat.ID,
                    jumlah: 1
                }
            })

            await fetchCart() // 🔥 refresh cart

            return { success: true }

        } catch (err) {
            console.error("❌ add cart:", err)
            return { error: true }
        }
    }

    /* =========================
    UPDATE QTY
    ========================= */
    const updateQty = async (id: string, jumlah: number) => {
        try {
            await $fetch(`${config.public.apiBase}/cart/items/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: { jumlah }
            })

            await fetchCart()

        } catch (err) {
            console.error("❌ update qty:", err)
        }
    }

    /* =========================
    DELETE ITEM
    ========================= */
    const removeItem = async (id: string) => {
        try {
            await $fetch(`${config.public.apiBase}/cart/items/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            })

            await fetchCart()

        } catch (err) {
            console.error("❌ delete item:", err)
        }
    }

    /* =========================
    CHECKOUT
    ========================= */
    const checkout = async () => {
        try {
            const res: any = await $fetch(`${config.public.apiBase}/cart/checkout`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            })

            console.log("💳 CHECKOUT:", res)

            // 🔥 buka tab baru
            if (res.redirect_url) {
                window.open(res.redirect_url, '_blank')
            }

            // refresh cart (biar kosong)
            await fetchCart()

            return res

        } catch (err) {
            console.error("❌ checkout:", err)
        }
    }

    return {
        cart,
        loading,
        fetchCart,
        addToCart,
        updateQty,
        removeItem,
        checkout
    }
}