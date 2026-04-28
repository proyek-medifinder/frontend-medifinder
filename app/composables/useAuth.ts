

interface AuthResponse {
    name: string
    role: string
    token: string
    email: string
}

export const useAuth = () => {
    const user = useState<{
        user_id: string
        name?: string
        email?: string
        role: string
        picture?: string
    } | null>('auth_user', () => null)

    const logout = () => {
        token.value = null
        emailCookie.value = null
        user.value = null

        navigateTo('/', { replace: true })
    }

    const token = useCookie<string | null>('auth_token')
    const emailCookie = useCookie<string | null>('auth_email')
    const config = useRuntimeConfig()

    const toFriendlyAuthMessage = (err: any, fallback: string) => {
        const rawMessage = String(
            err?.data?.message ||
            err?.message ||
            ''
        ).toLowerCase()

        if (
            rawMessage.includes('password salah') ||
            rawMessage.includes('kata sandi salah') ||
            rawMessage.includes('wrong password') ||
            rawMessage.includes('invalid password') ||
            rawMessage.includes('email atau password salah') ||
            rawMessage.includes('invalid credentials') ||
            rawMessage.includes('unauthorized')
        ) {
            return 'Email atau kata sandi yang kamu masukkan belum cocok. Coba cek lagi, ya.'
        }

        if (
            rawMessage.includes('user not found') ||
            rawMessage.includes('username not found') ||
            rawMessage.includes('email not found') ||
            rawMessage.includes('akun tidak ditemukan') ||
            rawMessage.includes('user tidak ditemukan') ||
            rawMessage.includes('username tidak ditemukan')
        ) {
            return 'Akun dengan email atau username itu belum kami temukan.'
        }

        if (
            rawMessage.includes('already') ||
            rawMessage.includes('exists') ||
            rawMessage.includes('duplicate') ||
            rawMessage.includes('sudah terdaftar')
        ) {
            return 'Akun dengan data ini sudah terdaftar. Coba masuk atau gunakan data lain.'
        }

        if (
            rawMessage.includes('forbidden') ||
            rawMessage.includes('access denied')
        ) {
            return 'Akun ini belum punya akses ke halaman tersebut.'
        }

        return fallback
    }

    const fetchUser = async () => {
        if (!token.value) return

        try {
            const res = await $fetch<{
                data: {
                    id: string
                    name: string
                    email: string
                    role: string
                }
            }>(`${config.public.apiBase}/me`, {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            })

            user.value = {
                user_id: res.data.id,
                name: res.data.name,
                email: res.data.email,
                role: res.data.role
            }
        } catch (err) {
            console.error("FETCH USER ERROR:", err)
            logout()
        }
    }


    if (import.meta.client) {
        onMounted(() => {
            if (token.value && !user.value) {
                fetchUser()
            }
        })
    }
    const setAuthData = async (data: AuthResponse, email: string) => {
        token.value = data.token
        emailCookie.value = email

        await fetchUser()

        // // 🔥 GLOBAL BLOCK
        // if (user.value?.role === 'admin_apotek') {
        //     logout()
        //     throw new Error('Gunakan halaman login apotek')
        // }
    }

    const login = async (email: string, password: string) => {
        try {
            const data = await $fetch<AuthResponse>(
                `${config.public.apiBase}/login`,
                {
                    method: 'POST',
                    body: { email, password }
                }
            )

            return await setAuthData(data, email)

        } catch (err: any) {
            throw new Error(
                toFriendlyAuthMessage(err, 'Belum bisa masuk sekarang. Coba lagi beberapa saat lagi.')
            )
        }
    }

    const googleLogin = async (googleToken: string) => {
        try {
            const data = await $fetch<AuthResponse>(
                `${config.public.apiBase}/google-login`,
                {
                    method: 'POST',
                    body: { token: googleToken }
                }
            )

            console.log('GOOGLE LOGIN RESPONSE:', data)

            // 🔥 WAJIB AWAIT
            await setAuthData(data, data.email ?? '')

            return data

        } catch (err: any) {
            throw new Error(
                toFriendlyAuthMessage(err, 'Login dengan Google belum berhasil. Coba lagi sebentar.')
            )
        }
    }

    const register = async (name: string, email: string, password: string) => {
        try {
            await $fetch<AuthResponse>(
                `${config.public.apiBase}/register`,
                {
                    method: 'POST',
                    body: { name, email, password }
                }
            )
        } catch (err: any) {
            throw new Error(
                toFriendlyAuthMessage(err, 'Pendaftaran belum berhasil. Coba lagi beberapa saat lagi.')
            )
        }
    }

    const ensureUser = async () => {
        if (!user.value && token.value) {
            await fetchUser()
        }
    }


    return {
        user,
        token,
        login,
        register,
        googleLogin,
        logout,
        ensureUser
    }
}
