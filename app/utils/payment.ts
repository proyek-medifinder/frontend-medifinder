export const paymentStatusLabel = (status?: string) => ({
  pending: 'Menunggu pembayaran', paid: 'Lunas', cancelled: 'Dibatalkan',
  refunded: 'Dana dikembalikan', partially_refunded: 'Pengembalian sebagian'
} as Record<string, string>)[status || ''] || status || '-'

export const fulfillmentLabel = (status?: string) => ({
  awaiting_payment: 'Menunggu pembayaran', paid: 'Menunggu diproses',
  preparing: 'Sedang disiapkan', ready: 'Siap diambil', completed: 'Selesai',
  needs_review: 'Sedang diperiksa apotek'
} as Record<string, string>)[status || ''] || status || '-'

// Open during the click event, before awaiting checkout, to avoid popup blocking.
export const createPaymentTab = () => {
  const tab = window.open('about:blank', '_blank')
  if (!tab) throw new Error('Izinkan tab baru/pop-up untuk membuka pembayaran Midtrans.')
  tab.opener = null
  tab.document.title = 'Menyiapkan pembayaran'
  tab.document.body.textContent = 'Menyiapkan pembayaran Midtrans…'
  return tab
}

export const openPayment = (value: string, tab: Window) => {
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.username || url.password ||
    !['app.sandbox.midtrans.com', 'app.midtrans.com'].includes(url.host)) {
    throw new Error('Alamat pembayaran tidak valid.')
  }
  if (tab.closed) throw new Error('Tab pembayaran sudah ditutup. Lanjutkan pembayaran dari riwayat transaksi.')
  tab.location.replace(url.href)
}
