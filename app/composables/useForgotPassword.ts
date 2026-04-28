export const useForgotPassword = () => {
    const config = useRuntimeConfig()
    const token = useCookie<string | null>('auth_token')

    const sendForgotEmail = async (email: string) => {
        return await $fetch(`${config.public.apiBase}/forgot-password`, {
            method: 'POST',
            body: { email }
        })
    }

    const resetPassword = async (tokenReset: string, newPassword: string) => {
        return await $fetch(`${config.public.apiBase}/reset-password`, {
            method: 'POST',
            body: {
                token: tokenReset,
                new_password: newPassword
            }
        })
    }

    // 🔥 NEW: CHANGE PASSWORD (LOGIN REQUIRED)
    const changePassword = async (oldPassword: string, newPassword: string) => {
        return await $fetch(`${config.public.apiBase}/change-password`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token.value}`,
                'ngrok-skip-browser-warning': 'true'
            },
            body: {
                old_password: oldPassword,
                new_password: newPassword
            }
        })
    }

    return {
        sendForgotEmail,
        resetPassword,
        changePassword 
    }
}