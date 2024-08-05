import * as Environment from '$app/environment'
import * as AppNavigation from '$app/navigation'

export const connect = async () => {
  if (!Environment.browser) return

  await window.arweaveWallet.connect(
    ['ACCESS_ADDRESS', 'ACCESS_ALL_ADDRESSES', 'SIGN_TRANSACTION'],
    { name: 'Ewigkeit' },
  )
  AppNavigation.invalidateAll()
}

export const disconnect = async () => {
  if (!Environment.browser) return
  await window.arweaveWallet.disconnect()
  AppNavigation.invalidateAll()
}

export const getAddress = async () => {
  if (!Environment.browser) return ''

  const permissions = await window.arweaveWallet.getPermissions()

  if (!permissions.includes('ACCESS_ADDRESS')) return ''

  return window.arweaveWallet.getActiveAddress()
}

export const getArnsName = async () => {
  if (!Environment.browser) return ''

  const permissions = await window.arweaveWallet.getPermissions()

  if (!permissions.includes('ACCESS_ADDRESS')) return ''

  const address = await window.arweaveWallet.getActiveAddress()
  const arnsNames = await window.arweaveWallet.getWalletNames()

  return arnsNames[address]
}
