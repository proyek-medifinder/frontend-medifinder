import { jwtDecode } from "jwt-decode"
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
        navigateTo('/')
    }

    const token = useCookie<string | null>('auth_token')
    const emailCookie = useCookie<string | null>('auth_email')
    const config = useRuntimeConfig()
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

        // langsung ambil data dari backend
        await fetchUser()
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
            throw new Error(err?.data?.message || 'Email atau password salah')
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

            setAuthData(data, data.email ?? '')
        } catch (err: any) {
            throw new Error(err?.data?.message || 'Login Google gagal')
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
            throw new Error(err?.data?.message || 'Registrasi gagal')
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