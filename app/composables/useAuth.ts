interface LoginResponse {
    name: string
    role: string
    token: string
}

export const useAuth = () => {
    const user = useState<{
        name: string
        role: string
        email: string
    } | null>('auth_user', () => null)

    const token = useCookie<string | null>('auth_token')
    const emailCookie = useCookie<string | null>('auth_email')
    const config = useRuntimeConfig()

    // 🔥 restore saat refresh
    if (token.value && emailCookie.value && !user.value) {
        user.value = {
            name: '',
            role: '',
            email: emailCookie.value
        }
    }

    const login = async (email: string, password: string) => {
        const { data, error } = await useFetch<LoginResponse>(
            `${config.public.apiBase}/login`,
            {
                method: 'POST',
                body: { email, password }
            }
        )

        if (error.value || !data.value) {
            throw new Error('Email atau password salah')
        }

        token.value = data.value.token
        emailCookie.value = email

        user.value = {
            name: data.value.name,
            role: data.value.role,
            email
        }
    }

    // ✅ REGISTER SEKARANG DI SINI
    const register = async (name: string, email: string, password: string) => {
        const { data, error } = await useFetch<LoginResponse>(
            `${config.public.apiBase}/register`,
            {
                method: 'POST',
                body: { name, email, password }
            }
        )

        if (error.value || !data.value) {
            throw new Error('Registrasi gagal')
        }

        // auto login setelah register
        token.value = data.value.token
        emailCookie.value = email

        user.value = {
            name: data.value.name,
            role: data.value.role,
            email
        }
    }

    const logout = () => {
        token.value = null
        emailCookie.value = null
        user.value = null
        navigateTo('/')
    }

    return {
        user,
        token,
        login,
        register,
        logout
    }
}