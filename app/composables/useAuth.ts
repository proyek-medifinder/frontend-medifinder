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
    const config = useRuntimeConfig()

    // 🔥 RESTORE USER SAAT REFRESH
    if (token.value && !user.value) {
        const savedEmail = useCookie<string | null>('auth_email')

        if (savedEmail.value) {
            user.value = {
                name: '',
                role: '',
                email: savedEmail.value
            }
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

        // 🔥 simpan email juga ke cookie
        const emailCookie = useCookie<string | null>('auth_email')
        emailCookie.value = email

        user.value = {
            name: data.value.name,
            role: data.value.role,
            email: email
        }
    }

    const logout = () => {
        token.value = null
        const emailCookie = useCookie<string | null>('auth_email')
        emailCookie.value = null
        user.value = null
        navigateTo('/')
    }

    return {
        user,
        token,
        login,
        logout
    }
}