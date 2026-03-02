export const useForgotPassword = () => {
    const config = useRuntimeConfig()

    const sendForgotEmail = async (email: string) => {
        return await $fetch(`${config.public.apiBase}/forgot-password`, {
            method: 'POST',
            body: { email }
        })
    }

    const verifyOtp = async (email: string, otp: string) => {
        return await $fetch(`${config.public.apiBase}/verify-otp`, {
            method: 'POST',
            body: {
                email,
                otp
            }
        })
    }

    const resetPassword = async (token: string, newPassword: string) => {
        return await $fetch(`${config.public.apiBase}/reset-password`, {
            method: 'POST',
            body: {
                token,
                new_password: newPassword
            }
        })
    }

    return {
        sendForgotEmail,
        verifyOtp,
        resetPassword
    }
}