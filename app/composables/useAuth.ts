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
            const data = await $fetch<{
                user_id: string
                name: string
                email: string
                role: string
                picture?: string
            }>(`${config.public.apiBase}/me`, {
                headers: {
                    Authorization: `Bearer ${token.value}`
                }
            })

            user.value = data
        } catch {
            logout()
        }
    }



    // if (token.value && !user.value) {
    //     const decoded: any = jwtDecode(token.value)

    //     user.value = {
    //         name: decoded.name,
    //         email: decoded.email,
    //         role: decoded.role
    //     }
    //     console.log("DECODED JWT:", decoded)
    // }
    if (token.value && !user.value) {
        try {
            const decoded: any = jwtDecode(token.value)

            user.value = {
                user_id: decoded.user_id,
                role: decoded.role
            }
        } catch (e) {
            logout()
        }
    }


    // const setAuthData = (data: AuthResponse, email: string) => {
    //     token.value = data.token
    //     emailCookie.value = email

    //     user.value = {
    //         name: data.name,
    //         role: data.role,
    //         email
    //     }
    // }
    const setAuthData = (data: AuthResponse, email: string) => {
        token.value = data.token
        emailCookie.value = email

        const decoded: any = jwtDecode(data.token)

        user.value = {
            user_id: decoded.user_id,
            name: data.name,
            role: data.role,
            email
        }
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

            setAuthData(data, email)
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



    return {
        user,
        token,
        login,
        register,
        googleLogin,
        logout
    }
}