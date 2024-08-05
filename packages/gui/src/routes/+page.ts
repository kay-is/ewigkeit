import * as Wallet from '$lib/wallet'

export async function load() {
  const address = await Wallet.getAddress()
  const arnsDomain = await Wallet.getArnsName()
  return { address, arnsDomain }
}
