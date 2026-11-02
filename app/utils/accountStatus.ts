export const normalizeAccountStatus = (value?: string | null) => {
    const status = String(value || '').trim().toLowerCase()
    if (status === 'active' || status === 'approved') return 'active'
    if (['suspended', 'disabled', 'inactive'].includes(status)) return 'suspended'
    return status
}

export const isAccountActive = (status?: string | null) => normalizeAccountStatus(status) === 'active'

export const accountStatusLabel = (status?: string | null) => {
    switch (normalizeAccountStatus(status)) {
        case 'active': return 'Active'
        case 'suspended': return 'Nonaktif'
        case 'pending': return 'Menunggu verifikasi'
        case 'rejected': return 'Ditolak'
        default: return 'Belum diketahui'
    }
}
