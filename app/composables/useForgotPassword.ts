export const useForgotPassword = () => {
    const config = useRuntimeConfig()
    const token = useCookie<string | null>('auth_token')
    const resendUntil = ref(0)
    const now = ref(Date.now())
    const resendSeconds = computed(() => Math.max(0, Math.ceil((resendUntil.value - now.value) / 1000)))
    let timer: ReturnType<typeof setInterval> | undefined
    onMounted(() => { timer = setInterval(() => { now.value = Date.now() }, 1000) })
    onUnmounted(() => { if (timer) clearInterval(timer) })

    const sendForgotEmail = async (email: string) => {
        const response = await $fetch<{ message: string }>(`${config.public.apiBase}/forgot-password`, {
            method: 'POST',
            body: { email: email.trim() },
            retry: 0,
            timeout: 15000
        })
        now.value = Date.now()
        resendUntil.value = now.value + 60000
        return response
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
        resendSeconds,
        resetPassword,
        changePassword 
    }
}
