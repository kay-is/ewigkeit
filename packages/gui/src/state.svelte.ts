let isConnected = $state(!!localStorage.getItem('address'))
let address = $state(localStorage.getItem('address'))

export function wallet() {
  return {
    get address() {
      return address
    },
    get isConnected() {
      return isConnected
    },
    async connect(permissions: string[]) {
      await window.arweaveWallet.connect(permissions)
      address = await window.arweaveWallet.getActiveAddress()
      isConnected = true

      if (address) localStorage.setItem('address', address)
    },
  }
}
